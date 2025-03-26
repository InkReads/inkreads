"use client";

import { Separator } from "@/components/ui/separator";
import Hero from "@/components/landing/landing-hero/landing-hero";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);
  
  return (
    <main className="flex flex-col">
      <Hero />
      <Separator />
    </main>
  );
}
