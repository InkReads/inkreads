import { DM_Sans } from "next/font/google";
import HeroIntro from "./hero-intro";
import Image from "next/image";
import HeroImage from "@/assets/hero-image.jpg";

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function Hero() {
  return (
    <section className={`${dmSans.className} flex justify-evenly items-center w-full h-[48rem] bg-black text-white`}>
      <div className="flex justify-center items-center gap-24">
        <HeroIntro />
        <div className="relative bg-white p-2 rounded-2xl">

          <Image src={HeroImage} alt="hero-image" height={600} className="rounded-xl object-cover"/>
        </div>
      </div>
    </section>
  );
}
