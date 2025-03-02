import { DM_Sans } from "next/font/google";
import HeroIntro from "./hero-intro";
import Image from "next/image";
import HeroImage from "@/assets/hero-image.png";

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function Hero() {
  return (
    <section className={`${dmSans.className} flex justify-center items-center h-[80vh] bg-gradient-to-b from-[#e3abfb] to-[#6ebbfe] via-[#d7adfc]`}>
      <div className="w-[60%] flex justify-evenly items-center gap-48">
        <HeroIntro />
        <Image src={HeroImage} alt="hero-image" height={450} className="rounded-xl object-cover hidden lg:inline-block"/>
      </div>
    </section>
  );
}
