"use client"

import { auth } from "@/lib/firebase.config";
import { useAuth } from "@/modules/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const { setUser } = useAuth();  

  useEffect(() => {
    auth.signOut().then(() => {
      setUser(null);
      setTimeout(() => {
        router.push("/");
      }, 5000)
    })
  }, [])

  return (
    <div>Logging out...</div>
  )
}