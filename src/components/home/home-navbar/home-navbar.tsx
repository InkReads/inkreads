"use client"

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { systemFonts } from "@/lib/fonts";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchInput from "./search-input";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import AuthActions from "./auth-actions";

const sections = [
  {"Community": ["Stories", "Authors", "Users"]}, 
  {"Browse": ["Novels", "Light Novels", "Comics", "Fanfiction"]},
]

export default function HomeNavbar() {
  const { user, username, setUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const ProfileItems = [
    { name: "Profile", href: `/profile/${username}` },
    { name: "Settings", href:"/settings" },
    { name: "Sign out", onClick: handleSignOut },
  ]

  return (
    <nav style={{ fontFamily: systemFonts.sans }} className="fixed top-0 left-0 right-0 h-16 px-4 flex items-center z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          InkReads
        </Link>
        <SearchInput />
        <AuthActions />
      </div>
    </nav>
  );
}