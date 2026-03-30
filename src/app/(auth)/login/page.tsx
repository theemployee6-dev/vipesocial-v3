"use client";

// React
import { useState } from "react";

// React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Third-party libraries
import { toast } from "sonner";

// Internal hooks
import { useAuth } from "@/shared/hooks/useAuth";

// Internal utils
import { LoginFormData, loginSchema } from "@/shared/utils/validations";

// Shared components (caminho @/shared)
import CardWrapper from "@/shared/components/CardWrapper/CardWrapper";
import FieldInput from "@/shared/components/FieldInput/FieldInput";
import GlowsEffectComponent from "@/shared/components/GlowsEffectComponent/GlowsEffectComponent";
import HeaderComponent from "@/shared/components/HeaderComponent/HeaderComponent";
import LogoComponent from "@/shared/components/LogoComponent/LogoComponent";
import MainButton from "@/shared/components/MainButton/MainButton";

// Shared components (caminho relativo _shared)
import BackLink from "../_shared/_components/BackLink/BackLink";
import Divider from "../_shared/_components/Divider/Divider";
import FooterComponent from "../_shared/_components/Footer/Footer";
import GoogleButton from "../_shared/_components/GoogleButton/GoogleButton";
import NoiseTexture from "../_shared/_components/NoiseTexture/NoiseTexture";
import ProofStats from "../_shared/_components/ProofStats/ProofStats";
import TermFooter from "../_shared/_components/TermFooter/TermFooter";

// Local components
import RememberAndForgotComponent from "./_components/RememberForgot/RememberForgot";
import Pill from "../_shared/_components/Pill/Pill";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login, loginComGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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
      toast.success("Login com sucesso!");
    } catch {
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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#000000] px-4 py-12">
      <GlowsEffectComponent />
      <NoiseTexture />

      <div className="w-full max-w-[440] z-10">
        <CardWrapper showCornerGlow>
          <BackLink href="/" />
          <LogoComponent className="mb-4" />
          <Pill className="mb-4">LOGIN</Pill>

          <HeaderComponent
            title=" Acesse sua conta"
            subTitle=" Bem-vindo de volta. Vamos viralizar."
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FieldInput
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              registration={register("email")}
              error={errors.email?.message}
              disabled={loading}
            />
            <div>
              <FieldInput
                label="Senha"
                type="password"
                placeholder="••••••••"
                registration={register("password")}
                error={errors.password?.message}
                disabled={loading}
              />
            </div>

            <RememberAndForgotComponent />

            <MainButton
              title={loading ? "Carregando..." : "Entrar"}
              disabled={loading}
              type="submit"
            />
          </form>

          <Divider />

          <GoogleButton
            title="Entrar com Google"
            onClick={handleGoogle}
            disabled={loading}
          />

          <FooterComponent
            href="/cadastro"
            title="Não tem conta?"
            titleLink="Criar conta grátis"
          />
        </CardWrapper>

        <ProofStats className="mt-6" />
        <TermFooter className="mt-4" />
      </div>
    </div>
  );
}
