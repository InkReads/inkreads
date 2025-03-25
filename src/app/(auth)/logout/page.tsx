"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase.config";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/auth-context";

export default function LogoutPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
<<<<<<< Updated upstream
    auth.signOut().then(() => {
      setUser(null);
      setTimeout(() => {
        router.push("/");
      }, 2500)
    })
  }, [router, setUser])
=======
    const handleLogout = async () => {
      try {
        await signOut(auth);
        setUser(null);
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    handleLogout();
  }, [router, setUser]);
>>>>>>> Stashed changes

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Logging out...</p>
    </div>
  );
}