"use client"

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { DM_Sans } from "next/font/google";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchInput from "./search-input";
import AuthActions from "./auth-actions";
import { useAuth } from "@/modules/context/auth-context";

const dmSans = DM_Sans({
  subsets: ["latin"],  
  weight: "500",
});

const sections = [
  {"Community": ["Stories", "Authors", "Users"]}, 
  {"Browse": ["Novels", "Light Novels", "Comics", "Fanfiction"]},
]

export default function HomeNavbar() {
  const user = useAuth();
  
  return (
    <nav className={`${dmSans.className} fixed top-0 left-0 right-0 h-16 px-4 bg-white border-b-[0.5px] flex items-center z-50`}>
      <header className="w-full flex gap-8 items-center">
        {/* Menu and Logo */ }
        <div className="flex gap-4 items-center">
          <SidebarTrigger size={"icon"} />
          <Link href="/">
            <span className="text-2xl">InkReads</span>
          </Link>
        </div>
      </header>

      {/* Search and Auth Actions */ }
      <section className="inline-flex items-center">
        <SearchInput />
        {/* Navbar Menu Items */ }
        <div className="flex justify-between pr-2">
          {sections.map((item, key) => (
            <DropdownMenu key={key}>
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
                        href="/"
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
        <AuthActions />
      </section>
    </nav>
  );
}