// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { User } from "@/types/user";

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
			readingList: [],
			followers: [],
			following: []
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

const fetchUser = async () => {
	const user = auth.currentUser;
	console.log("Current User: ", user);
	if (user) {
		const userRef = doc(db, "users", user.uid);
		const userDoc = await getDoc(userRef);
		return userDoc.data();
	}
	return null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
	try {
		const usersRef = collection(db, "users");
		const q = query(usersRef, where("username", "==", username));
		const querySnapshot = await getDocs(q);
		
		if (!querySnapshot.empty) {
			const userData = querySnapshot.docs[0].data() as User;
			return {
				...userData,
				uid: querySnapshot.docs[0].id
			};
		}
		return null;
	} catch (error) {
		console.error("Error fetching user:", error);
		return null;
	}
}

export { app, auth, googleProvider, signInWithPopup, db, storage, saveUserProfile, fetchBooks, fetchUser };