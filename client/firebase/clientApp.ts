// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBvWD7e4VEGSe0UhDQzZaWie8-_POEkTJk",
  authDomain: "auth-a247d.firebaseapp.com",
  projectId: "auth-a247d",
  storageBucket: "auth-a247d.appspot.com",
  messagingSenderId: "600287096039",
  appId: "1:600287096039:web:804e7e7f342955bab8c642",
  measurementId: "G-QWT8PQ0NPL",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const storage = getStorage(app);
