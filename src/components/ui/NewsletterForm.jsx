import React, { useState } from 'react';
import toast from 'react-hot-toast';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md mx-auto sm:mx-0">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-grow px-4 py-3 rounded-l border border-gray-300 focus:outline-none focus:border-ayurveda focus:ring-1 focus:ring-ayurveda"
      />
      <button
        type="submit"
        className="bg-ayurveda text-white px-6 py-3 rounded-r font-medium hover:bg-ayurveda-dark transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
};

export default NewsletterForm;
