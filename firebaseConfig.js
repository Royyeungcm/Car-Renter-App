// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getStorage } from 'firebase/storage';


// TODO: Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvE4nx7QK6S3F6RpXY5E7F0tI6dd1DI0Q",
    authDomain: "cpmd-c0233.firebaseapp.com",
    projectId: "cpmd-c0233",
    storageBucket: "cpmd-c0233.appspot.com",
    messagingSenderId: "201203398295",
    appId: "1:201203398295:web:b9e58d4fc5010dbfc19bd2",
    measurementId: "G-8HV3J1H274"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Services (database, auth, etc)
const db = getFirestore(app);
const auth = getAuth(app)

const storage = getStorage(app)

export {db, auth, storage};