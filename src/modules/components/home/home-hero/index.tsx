import { Button } from "@/components/ui/button";
import { DM_Sans } from "next/font/google";
import BentoGrid from "./bento-grid";

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function Hero() {
  return (
    <section className={`${dmSans.className} flex flex-col justify-center items-center w-full gap-10 mt-16 md:flex-row md:pr-10`}>
      <div className="flex flex-col items-center gap-4 tracking-tight text-center">
        <p className="text-6xl font-medium">Welcome to InkReads.</p>
        <span className="mx-8">
          <p className="text-2xl">Read, storytell, and review.</p>
          <p className="text-lg hidden md:inline-block">Create reading lists and explore new titles to your mind's content.</p>
        </span>
        <Button variant={"default"} size={"lg"} className="text-xl h-12">Get started</Button>
      </div>
      <div className="flex w-48 md:w-72 lg:w-96 h-full justify-center items-center ">
        <BentoGrid />
      </div>
    </section>
  );
}
