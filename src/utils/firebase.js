import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyByh_YIzJLx7apFkYxJPDuLXa0PpfujjRE",
  authDomain: "aruvedic-website-final.firebaseapp.com",
  projectId: "aruvedic-website-final",
  storageBucket: "aruvedic-website-final.firebasestorage.app",
  messagingSenderId: "591221349306",
  appId: "1:591221349306:web:43c7427f3e50ebf2dbdb83",
  measurementId: "G-NRYJZT5W76"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Analytics (Browser-only support check)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { analytics };
export default app;
