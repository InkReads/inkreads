"use client";

import { Button } from "@/components/ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, saveUserProfile } from "@/lib/firebase.config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import googleIcon from '@/assets/google.png'

export default function GoogleAuthButton() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user profile to Firestore
      await saveUserProfile(
        user.uid,
        user.email || '',
        user.displayName || user.email?.split('@')[0] || ''
      );
      
      alert("Logged in successfully!");
      router.push('/');
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  }

  return (
    <Button type="submit" onClick={handleGoogleSignIn} className="flex justify-center items-center text-base font-bold w-[426px] h-10 bg-white hover:bg-white text-[#656565] relative shadow-none border-[1px] rounded-lg mt-3">
      <Image
        src={googleIcon}
        className="w-7 h-7 absolute left-2"
        alt="google"
      />
      Continue with Google
    </Button>
  )
}