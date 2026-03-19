"use client";

// Componentes visuais compartilhados (layout/estrutura)
import BackLinkComponent from "../shared/components/BackLink/page";
import CardWrapper from "../shared/components/CardWrapper/page";
import DividerComponent from "../shared/components/Divider/page";
import FooterComponent from "../shared/components/Footer/page";
import GlowsEffectComponent from "../shared/components/Glows/page";
import HeaderComponent from "../shared/components/Header/page";
import LogoComponent from "../shared/components/Logo/page";
import MainButton from "../shared/components/MainButton/page";
import NoiseTextureComponent from "../shared/components/NoiseTexture/page";
import PillComponent from "../shared/components/Pill/page";
import ProofStatsComponent from "../shared/components/ProofStats/page";
import TermFooterComponent from "../shared/components/TermFooter/page";
import TopGlowLineComponent from "../shared/components/TopGlowLine/page";

// Componentes de formulário (também compartilhados, mas com propósito específico)
import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import FieldInput from "../shared/components/FieldInput/FieldInput";
import GoogleButtonComponent from "../shared/components/GoogleButton/page";

// Componentes específicos desta página (não reutilizados em outras rotas)
import RememberAndForgotComponent from "./components/RememberForgot/page";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/shared/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { login, loginComGoogle } = useAuth();

  async function onSubmit(data: LoginFormData) {
    setLoading(true);
    try {
      const resultado = await login({
        email: data.email,
        password: data.password,
      });

      if (resultado?.error) {
        toast.error(resultado.error);
        return;
      }

      reset();
      toast.success("Login com Sucesso!");
    } catch {
      // Erro inesperado — rede caiu, servidor fora do ar, etc.
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      const resultado = await loginComGoogle();
      if (resultado?.error) {
        toast.error(resultado.error);
        return;
      }
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080810] px-[2%] py-[20%] sm:px-[4%] sm:py-[25%] md:py-[20%] lg:py-[15%]">
      {/* GlowEffect */}
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
          title="Acesse sua conta"
          subTitle="Bem-vindo de volta. Vamos viralizar."
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <section className="mb-3.5">
            <FieldInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
              registration={register("email")}
              error={errors.email?.message}
              disabled={loading}
            />
          </section>

          {/* Senha */}
          <section className="mb-3.5">
            <FieldInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              registration={register("password")}
              error={errors.password?.message}
              disabled={loading}
            />
          </section>

          {/* Row: remember + forgot */}
          <RememberAndForgotComponent />

          {/* Button wrapper */}
          <MainButton
            title={loading ? "Carregando..." : "Entrar"}
            disabled={loading}
          />

          {/* Divider */}
          <DividerComponent />

          {/* Google button */}
          <GoogleButtonComponent
            title="Entrar com o Google"
            onClick={handleGoogle}
            disabled={loading}
          />
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
