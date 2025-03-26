import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { systemFonts } from "@/lib/fonts";

export default function LandingHero() {
  return (
    <div
      style={{ fontFamily: systemFonts.sans }}
      className="relative flex w-full justify-center items-center h-screen"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          Your next favorite book awaits.
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl">
          Join our community of book lovers. Share your thoughts, discover new reads, and connect with fellow bibliophiles.
        </p>
        <Link href="/signup">
          <Button size="lg" className="text-lg">
            Get Started
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
