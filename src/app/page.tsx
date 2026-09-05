import Navbar from "@/components/Navbar";
import { ParallaxHero } from "@/components/ui/parallax-hero";
import VideoSection from "@/components/VideoSection";
import FeaturesSection from "@/components/FeaturesSection";
import ProgramsSection from "@/components/ProgramsSection";
import TransformationsSection from "@/components/TransformationsSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WelcomeModal from "@/components/WelcomeModal";

export default function Home() {
  return (
    <>
      <Navbar />
      <WelcomeModal />
      <main>
        <ParallaxHero />
        <VideoSection />
        <ProgramsSection />
        <FeaturesSection />
        <TransformationsSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
