"use client";

import { Button } from "@/components/ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase.config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import googleIcon from '@/assets/google.png'

export default function GoogleAuthButton() {
  const router = useRouter();

  {/*
    const handleGoogleSignIn = async () => {
      try {
        await signInWithPopup(auth, googleProvider);
        alert("Logged in successfully!");
        router.push('/');
      } catch (error) {
        console.error("Google Sign-In Error:", error);
      }
    };
  */}
  
  return (
    <Button type="submit" className="flex justify-center items-center text-base font-bold w-[426px] h-10 bg-white hover:bg-white text-[#656565] relative shadow-none border-[1px] rounded-lg mt-3">
      <Image
        src={googleIcon}
        className="w-7 h-7 absolute left-2"
        alt="google"
      />
      Continue with Google
    </Button>
  )
}