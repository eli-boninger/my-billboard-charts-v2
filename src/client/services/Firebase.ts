import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "my-billboard-charts.firebaseapp.com",
    projectId: "my-billboard-charts",
    storageBucket: "my-billboard-charts.appspot.com",
    messagingSenderId: "653090121846",
    appId: "1:653090121846:web:b7b824e2c792cd62b75757",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app;