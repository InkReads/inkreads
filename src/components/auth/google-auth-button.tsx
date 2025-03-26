"use client";

import { Button } from "@/components/ui/button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function GoogleAuthButton() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: user.displayName || user.email?.split('@')[0],
        createdAt: new Date().toISOString(),
      });

      router.push("/novels");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outline"
      className="w-[420px] sm:w-[521px] h-10 text-xl rounded-lg border-2 border-[#4D74FF] text-[#4D74FF] hover:bg-[#4D74FF] hover:text-white"
    >
      Continue with Google
    </Button>
  );
} 