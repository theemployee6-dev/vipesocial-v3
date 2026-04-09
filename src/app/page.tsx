import DifferentiatorSection from "./_componentsLandingPage/DifferentiatorSection/DifferentiatorSection";
import FinalCTA from "./_componentsLandingPage/FinalCTA/FinalCTA";
import Footer from "./_componentsLandingPage/Footer/Footer";
import Hero from "./_componentsLandingPage/Hero/Hero";
import HowItWorks from "./_componentsLandingPage/HowItWorks/HowItWorks";
import Navbar from "./_componentsLandingPage/Navbar/Navbar";
import PricingSection from "./_componentsLandingPage/PricingSection/PricingSection";
import ProblemSection from "./_componentsLandingPage/ProblemSection/ProblemSection";

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
