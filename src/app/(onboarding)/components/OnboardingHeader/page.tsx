import LogoComponent from "@/shared/components/Logo/page";

const OnboardingHeader = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex items-center justify-between mb-1">
      <section>
        <LogoComponent />
      </section>
      <span className="text-xs text-[#3a3a55] font-dm-sans">
        Etapa {currentStep} de 4
      </span>
    </div>
  );
};

export default OnboardingHeader;
