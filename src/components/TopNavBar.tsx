'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { MenuIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
import Logo from "@/assets/logo.png";

import { usePathname } from "next/navigation"

const roboto = Roboto({
  subsets: ["latin"],  
  weight: "500",
});

const sections = [
  {"COMMUNITY": ["Stories", "Authors", "Users"]}, 
  {"BROWSE": ["Novels", "Light Novels", "Comics", "Fanfiction"]},
];

export default function TopNavBar() {
    const pathname = usePathname();

    const hiddenPages = ["/login-page", "/signup-page"];
    if (hiddenPages.includes(pathname)) return null;

  return (
    <header className={`${roboto.className} px-4 border-b-[0.5px]`}>
      <div className="flex w-full h-16 justify-between">
        <nav className="flex gap-2 pl-1 items-center">
          <div className="flex gap-5">
            <NavSheet />
            <Link href="/" className="flex item-center">
              <Image src={Logo} alt="logo" className="w-[40px] h-[40px] object-contain" />
            </Link>
          </div>
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
        </nav>

        <section className="flex gap-4 items-center">
          <div className="flex relative w-full max-w-sm items-center gap-1.5">
            <div className="absolute left-2.5 top-2 text-muted-foreground">
              <SearchIcon />
            </div>
            <Input placeholder="Search..." className="max-w-sm md:w-[16rem] lg:w-[20rem] h-10 shadow-none pl-10"  />
          </div>
                  <Button variant="link" asChild className="hidden sm:block"><Link href="/login-page">LOGIN</Link></Button>
          <Button variant="link" asChild className="hidden sm:block"><Link href="/signup-page">SIGN UP </Link></Button>
        </section>
      </div>
    </header>
  );
}

const NavSheet = () => {
  return (
    <main className="lg:hidden flex items-center">
      <Sheet>
        <SheetTrigger>
            <MenuIcon size={24} />
        </SheetTrigger>
        <SheetContent side="left" className="font-bold">
          <SheetTitle className="border-b-gray-500 border-b-[1px]">NAVIGATION</SheetTitle>
          <div className="flex flex-col items-start pt-2 [&>*]:p-0">
            {sections.map((item, key) => (
              <Button
                variant="link"
                asChild
                key={key}
                className="w-full justify-start" 
              >
                <Link href="/">{Object.keys(item)}</Link>
              </Button>
            ))}
            <Button variant="link" asChild><Link href="/login-page">LOGIN</Link></Button>
            <Button variant="link" asChild><Link href="/signup-page">SIGN UP</Link></Button>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  )
}