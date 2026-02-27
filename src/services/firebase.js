import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA-HeCxnJz19CUYHXsLHUbBqchoH7mnfgc",
    authDomain: "r2alms.firebaseapp.com",
    projectId: "r2alms",
    storageBucket: "r2alms.firebasestorage.app",
    messagingSenderId: "602301829690",
    appId: "1:602301829690:web:488466a5d8138cb0029b03",
    measurementId: "G-CNJ4SEF6GN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
