// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-6e723.firebaseapp.com",
  projectId: "mern-blog-6e723",
  storageBucket: "mern-blog-6e723.appspot.com",
  messagingSenderId: "71672623854",
  appId: "1:71672623854:web:7301f0aa2e9c2ee4b7b9ff"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
