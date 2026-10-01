import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { auth, googleProvider, db } from '../utils/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ayurveda_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync Firebase user profile with backend store & Firestore
  const syncWithBackend = async (fbUser, customName = null) => {
    try {
      // 1. Sync to Firebase Firestore 'users' collection
      try {
        const userRef = doc(db, 'users', fbUser.uid);
        await setDoc(userRef, {
          uid: fbUser.uid,
          name: customName || fbUser.displayName || fbUser.email.split('@')[0],
          email: fbUser.email,
          photoURL: fbUser.photoURL || '',
          lastLogin: serverTimestamp()
        }, { merge: true });
      } catch (fsErr) {
        // Firestore rules or offline mode fallback
        console.warn('Firestore user save notice:', fsErr.message);
      }

      // 2. Sync to Backend API
      const payload = {
        uid: fbUser.uid,
        email: fbUser.email,
        name: customName || fbUser.displayName || fbUser.email.split('@')[0],
        photoURL: fbUser.photoURL || ''
      };
      const { data } = await api.post('/auth/firebase-sync', payload);
      if (data.success && data.data) {
        setUser(data.data);
        if (data.token) {
          localStorage.setItem('ayurveda_token', data.token);
        }
        localStorage.setItem('ayurveda_user', JSON.stringify(data.data));
        return data.data;
      }
    } catch (err) {
      console.warn('Backend sync warning:', err.message);
      // Fallback local state if backend sync has network delay
      const fallbackUser = {
        _id: fbUser.uid,
        id: fbUser.uid,
        name: customName || fbUser.displayName || fbUser.email.split('@')[0],
        email: fbUser.email,
        photoURL: fbUser.photoURL || '',
        role: 'customer'
      };
      setUser(fallbackUser);
      localStorage.setItem('ayurveda_user', JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  };

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        await syncWithBackend(fbUser);
      } else {
        // If not in Firebase, check existing backend session
        const token = localStorage.getItem('ayurveda_token');
        if (token) {
          try {
            const { data } = await api.get('/auth/me');
            if (data.success && data.data) {
              setUser(data.data);
              localStorage.setItem('ayurveda_user', JSON.stringify(data.data));
            }
          } catch {
            localStorage.removeItem('ayurveda_token');
            localStorage.removeItem('ayurveda_user');
            setUser(null);
          }
        } else {
          setUser(null);
          localStorage.removeItem('ayurveda_user');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getFirebaseErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/operation-not-allowed':
        return 'Email/Password sign-in is disabled in your Firebase Console. Please enable it in Firebase Console > Authentication > Sign-in method.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please register first.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please login instead.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by the browser. Please allow popups for Google Sign-in.';
      case 'auth/unauthorized-domain':
        return 'Current domain is not authorized in Firebase Console (Authentication > Settings > Authorized domains).';
      default:
        return error.message || 'Authentication failed. Please try again.';
    }
  };

  const login = async (email, password) => {
    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const syncedUser = await syncWithBackend(userCredential.user);

      // Background Supabase auth login
      try {
        supabase.auth.signInWithPassword({ email, password }).catch(() => {});
      } catch (e) {}

      toast.success(`Welcome back, ${syncedUser?.name || userCredential.user.displayName || 'User'}!`);
      return true;
    } catch (error) {
      console.error('Firebase login error:', error);
      // If Firebase failed due to operation-not-allowed or misconfiguration, try fallback to backend
      if (error.code === 'auth/operation-not-allowed') {
        toast.error('Firebase Auth: ' + getFirebaseErrorMessage(error), { duration: 6000 });
      }

      // Fallback backend login attempt
      try {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.success) {
          setUser(data.data);
          if (data.token) {
            localStorage.setItem('ayurveda_token', data.token);
          }
          localStorage.setItem('ayurveda_user', JSON.stringify(data.data));
          toast.success(`Welcome back, ${data.data.name}!`);
          return true;
        }
      } catch (backErr) {
        toast.error(getFirebaseErrorMessage(error));
        return false;
      }
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Profile display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name
        });
      }

      // 2. Sync to Backend
      const syncedUser = await syncWithBackend(userCredential.user, name);

      // Background Supabase auth signup
      try {
        supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        }).catch(() => {});
      } catch (e) {}

      toast.success(`Account created! Welcome, ${name}!`);
      return true;
    } catch (error) {
      console.error('Firebase register error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        toast.error('Firebase Auth: ' + getFirebaseErrorMessage(error), { duration: 6000 });
      }

      // Fallback backend registration
      try {
        const { data } = await api.post('/auth/register', { name, email, password });
        if (data.success) {
          setUser(data.data);
          if (data.token) {
            localStorage.setItem('ayurveda_token', data.token);
          }
          localStorage.setItem('ayurveda_user', JSON.stringify(data.data));
          toast.success(`Account created! Welcome, ${name}!`);
          return true;
        }
      } catch (backErr) {
        toast.error(getFirebaseErrorMessage(error));
        return false;
      }
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const syncedUser = await syncWithBackend(user, user.displayName);
      toast.success(`Signed in with Google! Welcome, ${syncedUser?.name || user.displayName}!`);
      return true;
    } catch (error) {
      console.error('Firebase Google sign-in error:', error);
      toast.error(getFirebaseErrorMessage(error), { duration: 5000 });
      return false;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth).catch(() => {});
      await api.post('/auth/logout').catch(() => {});
      try {
        supabase.auth.signOut().catch(() => {});
      } catch (e) {}
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('ayurveda_token');
      localStorage.removeItem('ayurveda_user');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      loginWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

