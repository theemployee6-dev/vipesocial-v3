"use client";

import GlowsEffectComponent from "./components/Glows/page";
import NoiseTextureComponent from "./components/NoiseTexture/page";
import BackLinkComponent from "./components/BackLink/page";
import GlowLineComponent from "./components/GlowLine/page";
import LogoComponent from "./components/Logo/page";
import PillComponent from "./components/Pill/page";
import HeaderComponent from "./components/Header/page";
import DividerComponent from "./components/Divider/page";
import GoogleButtonComponent from "./components/GoogleButton/page";
import FooterComponent from "./components/Footer/page";
import ProofStatsComponent from "./components/ProofStats/page";
import TermFooterComponent from "./components/TermFooter/page";
import RememberAndForgotComponent from "./components/RememberForgot/page";
import ButtonWrapper from "./components/ButtonWrapper/page";
import CardWrapper from "./components/CardWrapper/page";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080810] px-[2%] py-[20%] sm:px-[4%] sm:py-[25%] md:py-[20%] lg:py-[15%]">
      {/* GlowEffect */}
      <GlowsEffectComponent />

      {/* Noise texture */}
      <NoiseTextureComponent />

      {/* Back link */}
      <BackLinkComponent />

      {/* Card */}
      <CardWrapper>
        {/* Top glow line */}
        <GlowLineComponent />

        {/* Logo */}
        <LogoComponent />

        {/* Pill */}
        <PillComponent />

        {/* Heading */}
        <HeaderComponent />

        {/* Form */}
        <form className="flex flex-col gap-4">
          {/* Email */}
          <div className="mb-3.5">
            <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 tracking-[0.2px]">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full bg-white/3 border border-white/7 rounded-xl px-4 py-3.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors duration-200 placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
            />
          </div>

          {/* Senha */}
          <div className="mb-3.5">
            <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 tracking-[0.2px]">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/3 border border-white/7 rounded-xl px-4 py-3.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors duration-200 placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
            />
          </div>

          {/* Row: remember + forgot */}
          <RememberAndForgotComponent />

          {/* Button wrapper */}
          <ButtonWrapper />

          {/* Divider */}
          <DividerComponent />

          {/* Google button */}
          <GoogleButtonComponent />
        </form>

        {/* Footer */}
        <FooterComponent />
      </CardWrapper>

      {/* Proof stats */}
      <ProofStatsComponent />

      {/* Terms footer */}
      <TermFooterComponent />
    </div>
  );
}
