// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);