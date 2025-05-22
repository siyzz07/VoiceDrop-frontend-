// src/config/FirebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqESflv9_qZuTnbCGG-QzcZqcrEjJiFl4",
  authDomain: "voicedrop-b5ea5.firebaseapp.com",
  projectId: "voicedrop-b5ea5",
  storageBucket: "voicedrop-b5ea5.firebasestorage.app",
  messagingSenderId: "144560950775",
  appId: "1:144560950775:web:5728a3fe15887b649ff2f2",
  measurementId: "G-4XQ1NGNHYY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
