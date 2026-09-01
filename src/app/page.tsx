import Navbar from "@/components/Navbar";
import { ParallaxHero } from "@/components/ui/parallax-hero";
import VideoSection from "@/components/VideoSection";
import FeaturesSection from "@/components/FeaturesSection";
import ProgramsSection from "@/components/ProgramsSection";
import TransformationsSection from "@/components/TransformationsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ParallaxHero />
        <VideoSection />
        <ProgramsSection />
        <FeaturesSection />
        <TransformationsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
