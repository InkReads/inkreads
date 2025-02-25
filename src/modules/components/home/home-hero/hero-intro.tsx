import { Button } from "@/components/ui/button";

export default function HeroIntro() {
  return (
    <div className="flex flex-col  gap-4 tracking-tight text-start">
      <h1 className="text-6xl font-medium">Welcome to <br /> InkReads.</h1>
      <p className="text-2xl">Read, storytell, and review.</p>
      <p className="text-lg hidden lg:inline-block">Create reading lists and explore new titles to your mind's content.</p>
      <Button variant={"default"} size={"lg"} className="text-xl h-12 bg-[#a27de6] hover:bg-[#b194e5]">Get started</Button>
    </div>
  )
}