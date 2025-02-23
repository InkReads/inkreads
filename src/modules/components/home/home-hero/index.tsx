import Image from "next/image";
import HeroImage from "@/assets/hero-image.png";

export default function Hero() {
  return (
    <section className="flex flex-col w-full h-screen justify-center items-end">
      <Image
        priority
        quality={100}
        className="pointer-events-none select-none"
        src={HeroImage}
        alt="hero book image"
        width={650}
      />
    </section>
  );
}
