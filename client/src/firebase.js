// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogs-mern.firebaseapp.com",
  projectId: "blogs-mern",
  storageBucket: "blogs-mern.appspot.com",
  messagingSenderId: "38566831324",
  appId: "1:38566831324:web:5e7b0df9845b26aed3c019"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
