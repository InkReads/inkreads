import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroStart() {
  return (
    <div className="flex flex-col gap-4 tracking-tight text-white text-start">
      <span className="font-semibold text-5xl md:text-6xl">
        WELCOME TO
        <br />
        <span className="font-medium">InkReads.</span>
      </span>
      <span className="text-3xl">Read, storytell, and review.</span>
      <p className="text-xl hidden lg:inline-block text-gray-300">
        Create reading lists and explore new titles to your mind&apos;s content.
      </p>
      <Button
        variant={"default"}
        size={"lg"}
        className="text-xl h-12 text-black bg-white hover:bg-[#dcdcdc]"
      >
        <Link href="/signup">Get started</Link>
      </Button>
    </div>
  );
}
