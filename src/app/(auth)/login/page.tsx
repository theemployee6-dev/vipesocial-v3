"use client";

import GlowsEffectComponent from "../shared/components/Glows/page";
import NoiseTextureComponent from "../shared/components/NoiseTexture/page";
import BackLinkComponent from "../shared/components/BackLink/page";
import TopGlowLineComponent from "../shared/components/TopGlowLine/page";
import LogoComponent from "../shared/components/Logo/page";
import PillComponent from "../shared/components/Pill/page";
import HeaderComponent from "../shared/components/Header/page";
import DividerComponent from "../shared/components/Divider/page";
import GoogleButtonComponent from "../shared/components/GoogleButton/page";
import FooterComponent from "../shared/components/Footer/page";
import ProofStatsComponent from "../shared/components/ProofStats/page";
import TermFooterComponent from "../shared/components/TermFooter/page";
import RememberAndForgotComponent from "./components/RememberForgot/page";
import MainButton from "../shared/components/MainButton/page";
import CardWrapper from "../shared/components/CardWrapper/page";
import FieldInput from "../shared/components/FieldInput/FieldInput";

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
        <TopGlowLineComponent />

        {/* Logo */}
        <LogoComponent />

        {/* Pill */}
        <PillComponent />

        {/* Heading */}
        <HeaderComponent
          title="Acesse sua conta"
          subTitle="Bem-vindo de volta. Vamos viralizar."
        />

        {/* Form */}
        <form className="flex flex-col gap-4">
          {/* Email */}
          <section className="mb-3.5">
            <FieldInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
            />
          </section>

          {/* Senha */}
          <section className="mb-3.5">
            <FieldInput label="Senha" type="password" placeholder="••••••••" />
          </section>

          {/* Row: remember + forgot */}
          <RememberAndForgotComponent />

          {/* Button wrapper */}
          <MainButton title="Entrar" />

          {/* Divider */}
          <DividerComponent />

          {/* Google button */}
          <GoogleButtonComponent title="Entrar" />
        </form>

        {/* Footer */}
        <FooterComponent
          href="/cadastro"
          title="Não tem conta?"
          titleLink="Criar conta grátis"
        />
      </CardWrapper>

      {/* Proof stats */}
      <ProofStatsComponent />

      {/* Terms footer */}
      <TermFooterComponent />
    </div>
  );
}
