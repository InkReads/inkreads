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
import { DM_Sans } from "next/font/google";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchInput from "./search-input";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase.config";

const dmSans = DM_Sans({
  subsets: ["latin"],  
  weight: "500",
});

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
    <nav className={`${dmSans.className} fixed top-0 left-0 right-0 h-16 px-4 flex items-center z-50 bg-white shadow-md`}>
      <header className="w-full flex gap-8 items-center">
        {/* Menu and Logo */}
        <div className="flex gap-4 items-center">
          {user && <SidebarTrigger size={"icon"} />}
          <Link href="/">
            <span className="text-2xl">InkReads</span>
          </Link>
        </div>
      </header>

      {/* Search and Auth Actions */}
      <section className="inline-flex items-center">
        <SearchInput />
        {/* Navbar Menu Items - Show for all users */}
        <div className="flex justify-between mx-2">
          {sections.map((item, key) => (
            <DropdownMenu key={key} modal={false}>
              <DropdownMenuTrigger asChild className="focus:outline-none text-inherit">
                <div className="hidden lg:block items-center cursor-pointer hover:text-gray-600">
                  <Button variant={"ghost"}>
                    {Object.keys(item)}
                    <ChevronDownIcon className="w-4 h-4" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="flex flex-col">
                  {Object.values(item)[0].map((subItem: string, key: string) => (
                    <Button 
                      variant="link" 
                      asChild key={key}
                      className="px-4 hover:bg-muted"
                    >
                      <Link
                        href={`/${subItem.toLowerCase().replace(" ", "")}`}
                      >
                        {subItem}
                      </Link>
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
        {/* Auth Actions */}
        {user ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Avatar>
                <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{username || user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator className="w-full ml-0 bg-gray-300"/>
              <section className="flex flex-col items-start">
                {ProfileItems.map((item, key) => (
                  <Button 
                    variant="link" 
                    key={key}
                    onClick={item.onClick}
                    asChild={!item.onClick}
                  >
                    {item.onClick ? (
                      item.name
                    ) : (
                      <Link href={item.href}>{item.name}</Link>
                    )}
                  </Button>
                ))}
              </section>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Button variant="default" asChild className="hidden sm:block">
              <Link href="/login-page">Login</Link>
            </Button>
            <Button variant="default" asChild className="hidden sm:block">
              <Link href="/signup-page">Sign Up</Link>
            </Button>
          </div>
        )}
      </section>
    </nav>
  );
}