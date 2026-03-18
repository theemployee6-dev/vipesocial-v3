"use client";

import { useState } from "react";
// Componentes de fundo e estrutura
import BackLinkComponent from "../shared/components/BackLink/page";
import CardWrapper from "../shared/components/CardWrapper/page";
import GlowsEffectComponent from "../shared/components/Glows/page";
import NoiseTextureComponent from "../shared/components/NoiseTexture/page";

// Componentes de UI e conteúdo
import DividerComponent from "../shared/components/Divider/page";
import FooterComponent from "../shared/components/Footer/page";
import GoogleButtonComponent from "../shared/components/GoogleButton/page";
import HeaderComponent from "../shared/components/Header/page";
import LogoComponent from "../shared/components/Logo/page";
import MainButton from "../shared/components/MainButton/page";
import PillComponent from "../shared/components/Pill/page";
import ProofStatsComponent from "../shared/components/ProofStats/page";
import TermFooterComponent from "../shared/components/TermFooter/page";
import TopGlowLineComponent from "../shared/components/TopGlowLine/page";

// Componentes de formulário
import FieldInput from "../shared/components/FieldInput/FieldInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CadastroFormData, cadastroSchema } from "@/shared/utils/validations";

import { useAuth } from "@/shared/hooks/useAuth";

export default function CadastroPage() {
  // Estado para guardar erros que vêm do servidor
  // como email já cadastrado ou erro de rede.
  const [serverError, setServerError] = useState<string | null>(null);

  // Inicializa o formulário com o schema do Zod como validador.
  // O TypeScript já sabe exatamente quais campos existem
  // e quais tipos eles têm graças ao CadastroFormData.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
  });

  // Essa função só é chamada se todos os campos
  // passarem na validação do Zod.
  // Por enquanto só vamos logar os dados —
  // a lógica do Supabase vem no próximo passo.

  const { loginComGoogle, cadastrar } = useAuth();

  async function onSubmit(data: CadastroFormData) {
    // Limpa erro anterior antes de tentar de novo
    setServerError(null);

    const resultado = await cadastrar({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

    // Se retornou erro, mostra na tela.
    // Se não retornou, o redirect dentro da
    // Server Action já redirecionou o usuário.
    if (resultado?.error) {
      setServerError(resultado.error);
    }
  }

  async function handleGoogle() {
    const resultado = await loginComGoogle();
    if (resultado?.error) {
      setServerError(resultado.error);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080810] px-[2%] py-[20%] sm:px-[4%] sm:py-[25%] md:py-[20%] lg:py-[15%]">
      {/* Glows — mesmos do login para consistência visual */}
      <GlowsEffectComponent />

      {/* Noise texture */}
      <NoiseTextureComponent />

      {/* Back link */}
      <BackLinkComponent href="/" />

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Nome completo */}
          <section>
            <FieldInput
              label="Nome Completo"
              type="text"
              placeholder="Digite seu nome"
              registration={register("fullName")}
              error={errors.fullName?.message}
            />
          </section>

          {/* Email */}
          <section>
            <FieldInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
              registration={register("email")}
              error={errors.email?.message}
            />
          </section>

          {/* Senha */}
          <section>
            <FieldInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              registration={register("password")}
              error={errors.password?.message}
            />
          </section>

          {/* Confirmar senha */}
          <section className="mb-2">
            <FieldInput
              label="Confirmar senha"
              type="password"
              placeholder="••••••••"
              registration={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </section>

          {/* Botão principal */}
          <MainButton title="Criar minha conta →" />

          {/* Divider */}
          <DividerComponent />

          {/* Google button */}
          <GoogleButtonComponent
            title="Entrar com o Google"
            onClick={handleGoogle}
            severError={serverError}
          />
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
