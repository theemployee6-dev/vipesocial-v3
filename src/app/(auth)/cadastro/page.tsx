"use client";

import Link from "next/link";
import DividerComponent from "../shared/components/Divider/page";

import { GoogleIcon } from "../shared/components/GoogleButton/components/GoogleIcon";
import LogoComponent from "../shared/components/Logo/page";
import PillComponent from "../shared/components/Pill/page";
import HeaderComponent from "../shared/components/Header/page";
import TopGlowLineComponent from "../shared/components/TopGlowLine/page";
import BackLinkComponent from "../shared/components/BackLink/page";
import NoiseTextureComponent from "../shared/components/NoiseTexture/page";
import GlowsEffectComponent from "../shared/components/Glows/page";
import MainButton from "../shared/components/MainButton/page";
import GoogleButtonComponent from "../shared/components/GoogleButton/page";
import ProofStatsComponent from "../shared/components/ProofStats/page";
import TermFooterComponent from "../shared/components/TermFooter/page";
import FooterComponent from "../shared/components/Footer/page";
import CardWrapper from "../shared/components/CardWrapper/page";

export default function CadastroPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080810] px-[2%] py-[20%] sm:px-[4%] sm:py-[25%] md:py-[20%] lg:py-[15%]">
      {/* Glows — mesmos do login para consistência visual */}
      <GlowsEffectComponent />

      {/* Noise texture */}
      <NoiseTextureComponent />

      {/* Back link */}
      <BackLinkComponent />

      {/* Card */}
      <CardWrapper>
        {/* Top glow line */}
        <TopGlowLineComponent />

        {/* Logo */}
        <LogoComponent />

        {/* Pill */}
        <PillComponent />

        {/* Heading */}
        <HeaderComponent
          title=" Crie sua conta"
          subTitle="  Comece grátis. Sem cartão de crédito."
        />

        {/* Form */}
        <form className="flex flex-col gap-4">
          {/* Nome completo */}
          <div>
            <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 tracking-[0.2px]">
              Nome completo
            </label>
            <input
              type="text"
              placeholder="Seu nome"
              className="w-full bg-white/3 border border-white/7 rounded-xl px-4 py-3.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors duration-200 placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
            />
          </div>

          {/* Email */}
          <div>
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
          <div>
            <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 tracking-[0.2px]">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/3 border border-white/7 rounded-xl px-4 py-3.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors duration-200 placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
            />
            {/* Dica de senha forte */}
            <p className="text-[10px] text-[#2a2a3a] font-dm-sans mt-1.5">
              Mínimo 8 caracteres com letras e números
            </p>
          </div>

          {/* Confirmar senha */}
          <div className="mb-2">
            <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 tracking-[0.2px]">
              Confirmar senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/3 border border-white/7 rounded-xl px-4 py-3.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors duration-200 placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
            />
          </div>

          {/* Botão principal */}
          <MainButton title="Criar minha conta →" />

          {/* Divider */}
          <DividerComponent />

          {/* Google button */}
          <GoogleButtonComponent title="Entrar com o Google" />
        </form>

        {/* Footer */}
        <FooterComponent title="Já tem conta?" titleLink=" Entrar" />
      </CardWrapper>

      {/* Proof stats */}
      <ProofStatsComponent />

      {/* Terms footer */}
      <TermFooterComponent />
    </div>
  );
}
