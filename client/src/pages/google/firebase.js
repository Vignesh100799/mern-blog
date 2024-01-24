// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-blog-2709f.firebaseapp.com",
  projectId: "mern-blog-2709f",
  storageBucket: "mern-blog-2709f.appspot.com",
  messagingSenderId: "911955676310",
  appId: "1:911955676310:web:8ecbad0a64a967967246b7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);