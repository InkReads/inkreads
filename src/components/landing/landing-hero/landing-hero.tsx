import { DM_Sans } from "next/font/google";
import HeroIntro from "./hero-intro";
import Image from "next/image";
import HeroImage from "@/assets/hero-image.png";
import BGImage from "@/assets/bg-image.jpg";
import LandingHeader from "../landing-header/landing-header";

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function Hero() {
  return (
    <section 
      className={`${dmSans.className} relative flex w-full justify-center items-center h-screen`}
    >
      <LandingHeader />
      <Image src={BGImage} alt="bg-image" quality={100} className="absolute top-0 -z-10 brightness-[0.5] h-full w-full" />
      <div className="max-w-5xl flex justify-evenly items-center gap-40">
        <HeroIntro />
        <Image src={HeroImage} alt="hero-image" height={450} className="rounded-xl object-cover hidden lg:inline-block"/>
      </div>
    </section>
  );
}
