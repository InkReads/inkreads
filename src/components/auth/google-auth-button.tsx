"use client";

import { Button } from "@/components/ui/button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";

export function GoogleAuthButton() {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create a username from email
      const username = user.email?.split('@')[0] || 'user';

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      setUser(user);
      router.push('/home');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
    >
      Continue with Google
    </Button>
  );
} 