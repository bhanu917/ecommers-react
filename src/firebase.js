// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDoc, doc } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBW1ivUrD3R9wkqY6wOQUj3rgOxFoUzWdI",
    authDomain: "ecommers-57dd3.firebaseapp.com",
    projectId: "ecommers-57dd3",
    storageBucket: "ecommers-57dd3.firebasestorage.app",
    messagingSenderId: "877754574236",
    appId: "1:877754574236:web:8672c8e2d3d3d3a8395459",
    measurementId: "G-WXSS491WEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export async function getUserDetails() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const snap = await getDoc(doc(db, "Users", user.uid));
                    unsubscribe(); // stop listening after first result
                    resolve(snap.exists() ? snap.data() : null);
                } else {
                    unsubscribe();
                    resolve(null);
                }
            } catch (error) {
                unsubscribe();
                reject(error);
            }
        });
    });
}
