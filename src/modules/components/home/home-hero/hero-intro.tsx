import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroIntro() {
  return (
    <div className="flex flex-col gap-4 tracking-tight text-start">
      <span className="font-semibold text-5xl md:text-6xl">WELCOME TO
        <br />
        <span className="font-medium">
          InkReads.
        </span>
      </span>
      <span className="text-3xl">Read, storytell, and review.</span>
      <span className="text-xl hidden lg:inline-block">Create reading lists and explore new titles to your mind's content.</span>
      <Button variant={"default"} size={"lg"} className="text-xl h-12 bg-black //bg-[#a27de6] //hover:bg-[#b194e5]"><Link href="/signup-page">Get started</Link></Button>
    </div>
  )
}