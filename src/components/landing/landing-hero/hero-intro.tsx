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
      <span className="text-xl hidden lg:inline-block">
        Create reading lists and explore new titles to your mind&apos;s content.
      </span>
      <p className="text-lg text-gray-600">
        Discover and share your favorite stories. Join our community of readers and writers.
        Don&apos;t miss out on the latest updates!
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
