"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase.config";
import { useAuth } from "@/context/auth-context";

export default function Logout() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await auth.signOut();
        setUser(null);
        setTimeout(() => {
          router.push("/");
        }, 2500);
      } catch (error) {
        console.error("Error signing out:", error);
        router.push("/");
      }
    };

    handleSignOut();
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Signing out...
        </h1>
        <p className="text-gray-600">
          You will be redirected to the home page shortly.
        </p>
      </div>
    </div>
  );
}