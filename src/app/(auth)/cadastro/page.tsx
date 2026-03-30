"use client";

// React
import { useState } from "react";

// React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Third‑party libraries
import { toast } from "sonner";

// Internal hooks
import { useAuth } from "@/shared/hooks/useAuth";

// Internal utils (types & schemas)
import { CadastroFormData, cadastroSchema } from "@/shared/utils/validations";

// Shared components (absolute imports)
import CardWrapper from "@/shared/components/CardWrapper/page";
import FieldInput from "@/shared/components/FieldInput/FieldInput";
import GlowsEffectComponent from "@/shared/components/Glows/page";
import HeaderComponent from "@/shared/components/Header/page";
import LogoComponent from "@/shared/components/Logo/page";
import MainButton from "@/shared/components/MainButton/page";

// Shared components (relative imports – _shared folder)
import BackLink from "../_shared/_components/BackLink/BackLink";
import Divider from "../_shared/_components/Divider/Divider";
import FooterComponent from "../_shared/_components/Footer/Footer";
import GoogleButton from "../_shared/_components/GoogleButton/GoogleButton";
import NoiseTexture from "../_shared/_components/NoiseTexture/NoiseTexture";
import Pill from "../_shared/_components/Pill/Pill";
import ProofStats from "../_shared/_components/ProofStats/ProofStats";
import TermFooter from "../_shared/_components/TermFooter/TermFooter";

export default function CadastroPage() {
  const [loading, setLoading] = useState(false);
  const { cadastrar, loginComGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: CadastroFormData) {
    setLoading(true);
    try {
      const resultado = await cadastrar({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (resultado?.error) {
        toast.error(resultado.error);
        return;
      }

      reset();
      toast.success("Conta criada com sucesso! Verifique seu e-mail.");
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000000] px-4 py-12">
      {/* Efeitos visuais */}
      <GlowsEffectComponent />
      <NoiseTexture />

      <div className="w-full max-w-[440] z-10">
        {/* Card principal */}
        <CardWrapper>
          {/* Botão voltar */}
          <BackLink href="/login" />

          {/* Logo (simplificada) */}
          <LogoComponent />

          {/* Pill */}
          <Pill className="mb-4">ACESSO VIP</Pill>

          <HeaderComponent
            title="Crie sua conta"
            subTitle="Comece grátis. Sem cartão de crédito."
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Nome completo */}
            <FieldInput
              label="Nome completo"
              type="text"
              placeholder="Digite seu nome"
              registration={register("fullName")}
              error={errors.fullName?.message}
              disabled={loading}
            />

            {/* E-mail */}
            <FieldInput
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              registration={register("email")}
              error={errors.email?.message}
              disabled={loading}
            />

            {/* Senha e Confirmar senha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldInput
                label="Senha"
                type="password"
                placeholder="••••••••"
                registration={register("password")}
                error={errors.password?.message}
                disabled={loading}
              />
              <FieldInput
                label="Confirmar senha"
                type="password"
                placeholder="••••••••"
                registration={register("confirmPassword")}
                error={errors.confirmPassword?.message}
                disabled={loading}
              />
            </div>

            {/* Botão principal */}
            <MainButton
              title={loading ? "Criando conta..." : "Criar minha conta →"}
              type="submit"
              disabled={loading}
              className="mt-2"
            />
          </form>

          <Divider />

          {/* Botão Google */}
          <GoogleButton
            title="Entrar com Google"
            onClick={handleGoogle}
            disabled={loading}
          />

          {/* Footer (já tem conta?) */}
          <FooterComponent
            href="/login"
            title="Já tem conta?"
            titleLink="Entrar"
          />
        </CardWrapper>

        {/* Proof Stats (estatística de sucesso) */}
        <ProofStats className="mt-6" />

        {/* Term Footer (links legais) */}
        <TermFooter className="mt-4" />
      </div>
    </div>
  );
}
