// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore, doc, setDoc} from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTeYT0Ok5jYrxdHTSFbTPGAQUiKI-NqnE",
  authDomain: "financely-11174.firebaseapp.com",
  projectId: "financely-11174",
  storageBucket: "financely-11174.appspot.com",
  messagingSenderId: "299803964043",
  appId: "1:299803964043:web:36d047d9a714f917f31a8e",
  measurementId: "G-Q8VBLCQSMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};