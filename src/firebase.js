import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";


// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDe-iO0mkEAAKVZzOMqr3PR0qbbU6MV2H4",
    authDomain: "smart-garage-b4c5e.firebaseapp.com",
    databaseURL: "https://smart-garage-b4c5e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smart-garage-b4c5e",
    storageBucket: "smart-garage-b4c5e.firebasestorage.app",
    messagingSenderId: "1084290463431",
    appId: "1:1084290463431:web:8e90771b610f619754b0e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set };
