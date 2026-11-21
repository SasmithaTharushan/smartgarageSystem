import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Secure Firebase configuration using environment variables
// Falls back gracefully if running in offline/demo mode on Vercel
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDe-iO0mkEAAKVZzOMqr3PR0qbbU6MV2H4",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "smart-garage-b4c5e.firebaseapp.com",
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://smart-garage-b4c5e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "smart-garage-b4c5e",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "smart-garage-b4c5e.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1084290463431",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1084290463431:web:8e90771b610f619754b0e2"
};

let app = null;
let db = null;

try {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }
    db = getDatabase(app);
} catch (error) {
    console.warn("Firebase initialization skipped or failed (running in offline simulation mode):", error.message);
}

export { db, ref, onValue, set };
