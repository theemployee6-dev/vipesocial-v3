"use client";

import DividerComponent from "../shared/components/Divider/page";

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
import FieldInput from "../shared/components/FieldInput/FieldInput";

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
          <section>
            <FieldInput
              label="Nome Completo"
              type="text"
              placeholder="Digite seu nome"
            />
          </section>

          {/* Email */}
          <section>
            <FieldInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
            />
          </section>

          {/* Senha */}
          <section>
            <FieldInput label="Senha" type="password" placeholder="••••••••" />
          </section>

          {/* Confirmar senha */}
          <section className="mb-2">
            <FieldInput
              label="Confirmar senha"
              type="password"
              placeholder="••••••••"
            />
          </section>

          {/* Botão principal */}
          <MainButton title="Criar minha conta →" />

          {/* Divider */}
          <DividerComponent />

          {/* Google button */}
          <GoogleButtonComponent title="Entrar com o Google" />
        </form>

        {/* Footer */}
        <FooterComponent
          href="/login"
          title="Já tem conta?"
          titleLink=" Entrar"
        />
      </CardWrapper>

      {/* Proof stats */}
      <ProofStatsComponent />

      {/* Terms footer */}
      <TermFooterComponent />
    </div>
  );
}
