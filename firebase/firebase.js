// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { db, getCurrentUser } from "./firebase.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTYTjyaAt1FwKbHmZX1A1kiayskiFRBUw",
    authDomain: "fed-assignment-f0cd8.firebaseapp.com",
    projectId: "fed-assignment-f0cd8",
    storageBucket: "fed-assignment-f0cd8.firebasestorage.app",
    messagingSenderId: "114542382438",
    appId: "1:114542382438:web:3227de541d821031004ca7",
    measurementId: "G-VDMMRF2WE5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

export async function getCurrentUser() {  
  if (!currentUser) {
    try {
      const userCredential = await signInAnonymously(auth);
      currentUser = userCredential.user;
      console.log("Signed in as guest");
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      alert("Unable to connect. Please refresh the page.");
    }
  }
  return currentUser;
}