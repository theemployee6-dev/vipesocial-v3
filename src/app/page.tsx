import DifferentiatorSection from "./_components/DifferentiatorSection/DifferentiatorSection";
import FinalCTA from "./_components/FinalCTA/FinalCTA";
import Footer from "./_components/Footer/Footer";
import Hero from "./_components/Hero/Hero";
import HowItWorks from "./_components/HowItWorks/HowItWorks";
import Navbar from "./_components/Navbar/Navbar";
import PricingSection from "./_components/PricingSection/PricingSection";
import ProblemSection from "./_components/ProblemSection/ProblemSection";

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
