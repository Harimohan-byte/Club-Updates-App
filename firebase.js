// Firebase setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCupBTZNDur3y_Buz6o5uwXGHKo6Ey5MS0",
  authDomain: "clubupdatesapp.firebaseapp.com",
  projectId: "clubupdatesapp",
  storageBucket: "clubupdatesapp.firebasestorage.app",
  messagingSenderId: "658448534903",
  appId: "1:658448534903:web:0f5f454b12e79acb652572",
  measurementId: "G-DZQXJYXN2R"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
