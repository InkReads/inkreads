import { Button } from "@/components/ui/button";

export default function HeroIntro() {
  return (
    <div className="flex flex-col lg:col-span-3 items-center justify-center gap-4 tracking-tight mx-2 text-center">
      <p className="text-6xl font-medium">Welcome to InkReads.</p>
      <span className="flex flex-col gap-4 mx-8">
        <p className="text-2xl">Read, storytell, and review.</p>
        <p className="text-lg hidden md:inline-block">Create reading lists and explore new titles to your mind's content.</p>
      </span>
      <Button variant={"default"} size={"lg"} className="text-xl h-12">Get started</Button>
    </div>
  )
}