// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

const saveUserProfile = async (uid: string, email: string, username: string) => {
	try {
		console.log("Saving user to Firestore:", { uid, email, username });
		await setDoc(doc(db, "users", uid), {
			uid,
			email,
			username,
			readingList: []
		}, { merge: true });
	} catch (error) {
		console.error("Error saving user profile: ", error);
	}
};

const fetchBooks = async () => {
	const booksCollection = collection(db, "books");
	const booksSnapshot = await getDocs(booksCollection);
	return booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export { app, auth, googleProvider, signInWithPopup, db, storage, saveUserProfile, fetchBooks };