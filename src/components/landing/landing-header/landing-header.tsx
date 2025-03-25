"use client"

import Link from "next/link";
import AuthActions from "./auth-actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { dmSans } from "@/lib/fonts";

export default function LandingHeader() {
  const [scroll, setScroll] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleScroll = () => {
    setScroll(window.scrollY > 10);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scroll ? "bg-white shadow-md" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="InkReads Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className={`text-xl font-bold ${dmSans.className}`}>
              InkReads
            </span>
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
      </div>
    </header>
  );
}