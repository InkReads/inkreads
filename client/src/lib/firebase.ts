import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
	apiKey: "AIzaSyBtnhMy10t1v8NTuB48Bfcuf8y8WHlLAYg",
	authDomain: "inkreads-a9b7e.firebaseapp.com",
	projectId: "inkreads-a9b7e",
	storageBucket: "inkreads-a9b7e.firebasestorage.app",
	messagingSenderId: "74535854826",
	appId: "1:74535854826:web:0c397ba589b0a849b3ed93",
	measurementId: "G-VMCSFVQ6MX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);
