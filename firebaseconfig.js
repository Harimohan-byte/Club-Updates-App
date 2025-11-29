// firebaseconfig.js

// Firebase setup imports
import { initializeApp } from "firebase/app";
// Import the new modular persistence functions
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";

// Import AsyncStorage package (the one you installed)
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    // Your actual configuration details
    apiKey: "AIzaSyCupBTZNDur3y_Buz6o5uwXGHKo6Ey5MS0",
    authDomain: "clubupdatesapp.firebaseapp.com",
    projectId: "clubupdatesapp",
    storageBucket: "clubupdatesapp.firebasestorage.app",
    messagingSenderId: "658448534903",
    appId: "1:658448534903:web:0f5f454b12e79acb652572",
    measurementId: "G-DZQXJYXN2R"
};

// Initialize the core Firebase app
const app = initializeApp(firebaseConfig);

// FIX: Initialize Auth with AsyncStorage for state persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);