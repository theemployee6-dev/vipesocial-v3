import DifferentiatorSection from "@/app/components/DifferentiatorSection/DifferentiatorSection";
import FinalCTA from "@/app/components/FinalCTA/FinalCTA";
import Footer from "@/app/components/Footer/Footer";
import Hero from "@/app/components/Hero/Hero";
import HowItWorks from "@/app/components/HowItWorks/HowItWorks";
import Navbar from "@/app/components/Navbar/Navbar";
import PricingSection from "@/app/components/PricingSection/PricingSection";
import ProblemSection from "@/app/components/ProblemSection/ProblemSection";

export default function LandingPage() {
  return (
    <div className="bg-[#07070e] text-[#e8e8f8] overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <DifferentiatorSection />
        <PricingSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
