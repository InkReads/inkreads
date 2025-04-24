import { Link } from 'react-router-dom';
import BGImage from '@/assets/icons/bg-image.jpg';
import HeroImage from '@/assets/icons/hero-image.png';
import { Button } from '@/components/ui/button';
import LandingHeader from '@/components/LandingHeader';

export default function Landing() {
  return (
    <main className="flex flex-col">
      <section
        className="font-dmSans relative flex w-full justify-center items-center h-screen"
      >
        <LandingHeader />
        <img src={BGImage} alt="bg-image" className="absolute top-0 -z-10 brightness-[0.5] h-full w-full" />
        <div className="max-w-5xl flex justify-evenly items-center gap-40">
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
              <Link to="/signup">Get started</Link>
            </Button>
          </div>          
          <img src={HeroImage} alt="hero-image" width={400} className="rounded-xl object-cover hidden lg:inline-block" />
        </div>
      </section>
    </main>
  );
}
