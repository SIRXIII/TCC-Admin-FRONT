import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCrprjZ6U1eMADduUMeVECxRzHHfU3qbUc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "travelclothingclub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "travelclothingclub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "travelclothingclub.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "599053543859",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:599053543859:web:c334a66004316537c203c6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7LREJJYB5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;

