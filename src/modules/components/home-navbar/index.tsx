'use client';

import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation"
import { sections } from "@/modules/constants/sections";
import { Roboto } from "next/font/google";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchInput from "./search-input";

const roboto = Roboto({
  subsets: ["latin"],  
  weight: "500",
});

export default function HomeNavbar() {
    const pathname = usePathname();

    const hiddenPages = ["/login-page", "/signup-page"];
    if (hiddenPages.includes(pathname)) return null;

  return (
    <nav className={`${roboto.className} fixed top-0 left-0 right-0 h-16 px-4 bg-white border-b-[0.5px] flex items-center z-50`}>
      <header className="w-full flex gap-2 items-center">
        {/* Menu and Logo */ }
        <div className="flex gap-4 items-center">
          <SidebarTrigger size={"icon"} />
          <Link href="/">
            <Image src={Logo} alt="logo" width={40} height={40} className="object-contain" />
          </Link>
        </div>

        {/* Navbar Menu Items */ }
        {sections.map((item, key) => (
          <DropdownMenu key={key}>
            <DropdownMenuTrigger asChild className="focus:outline-none w-fit text-inherit">
              <div className="hidden lg:block items-center gap-1 cursor-pointer hover:text-gray-600">
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
      </header>

      {/* Search and Auth */ }
      <section className="flex gap-4 items-center">
        <SearchInput />
        <Button variant="link" asChild className="hidden sm:block"><Link href="/login-page">LOGIN</Link></Button>
        <Button variant="link" asChild className="hidden sm:block"><Link href="/signup-page">SIGN UP </Link></Button>
      </section>
    </nav>
  );
}