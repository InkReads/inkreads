import { Separator } from "@/components/ui/separator";
import Hero from "@/modules/components/home/home-hero";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Separator />
    </main>
  );
}
