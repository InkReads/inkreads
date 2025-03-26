"use client"

import Link from "next/link";
import AuthActions from "./auth-actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { systemFonts } from "@/lib/fonts";

export default function LandingHeader() {
  const [scroll, setScroll] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleScroll = () => {
    setScroll(window.scrollY > 0);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [])

  return (
    <header
      style={{ fontFamily: systemFonts.sans }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scroll ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          InkReads
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        <AuthActions />
      </div>
    </header>
  );
}