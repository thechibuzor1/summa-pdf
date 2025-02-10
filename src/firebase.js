// Import necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiuhE6SnZ5HMvNOcCdCSYo8h7ahXrdpbQ",
  authDomain: "scholarark-ae444.firebaseapp.com",
  projectId: "scholarark-ae444",
  storageBucket: "scholarark-ae444.appspot.com", // Fixed storageBucket format
  messagingSenderId: "844719618763",
  appId: "1:844719618763:web:400fefe0908ab59b70b94e",
  measurementId: "G-9FRR7RQQG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore for storing summaries

export default app;
