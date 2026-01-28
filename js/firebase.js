// Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// Firebase services we need
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// 🔹 Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC95cVHx60F0vGsFJKDa3bAPeKNahuUefE",
  authDomain: "carbontrack-fad3c.firebaseapp.com",
  projectId: "carbontrack-fad3c",
  storageBucket: "carbontrack-fad3c.firebasestorage.app",
  messagingSenderId: "255031369578",
  appId: "1:255031369578:web:e610af1a294d1e3df00f13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
