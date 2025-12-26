import { useState, useEffect, useRef } from 'react';
import { listenToMessages } from '../services/firebaseMessaging';

/**
 * Custom hook for Firebase real-time messages
 * @param {string} ticketId - The ticket/chat ID
 * @returns {Object} { messages, loading, error }
 */
export const useFirebaseMessages = (ticketId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (!ticketId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Subscribe to Firebase messages
      const unsubscribe = listenToMessages(ticketId, (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      });

      unsubscribeRef.current = unsubscribe;

      // Cleanup on unmount
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    } catch (err) {
      console.error('Error setting up Firebase listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [ticketId]);

  return { messages, loading, error };
};

