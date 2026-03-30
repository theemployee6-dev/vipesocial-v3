"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import GlowsEffectComponent from "@/shared/components/GlowsEffectComponent/GlowsEffectComponent";
import CardWrapper from "@/shared/components/CardWrapper/CardWrapper";
import FieldInput from "@/shared/components/FieldInput/FieldInput";
import MainButton from "@/shared/components/MainButton/MainButton";
import BackLink from "../_shared/_components/BackLink/BackLink";
import NoiseTexture from "../_shared/_components/NoiseTexture/NoiseTexture";
import LogoComponent from "@/shared/components/LogoComponent/LogoComponent";
import HeaderComponent from "@/shared/components/HeaderComponent/HeaderComponent";
import Pill from "../_shared/_components/Pill/Pill";

const schema = z.object({
  email: z
    .email("Digite um email válido")
    .min(1, "Email é obrigatório")
    .transform((val) => val.toLowerCase()),
});

type FormData = z.infer<typeof schema>;

export default function RecuperarSenhaPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      const supabase = createClientSupabaseClient();

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/nova-senha`,
      });

      if (error) {
        toast.error("Erro ao enviar email. Tente novamente.");
        return;
      }
      reset();
      toast.success("Email enviado! Verifique sua caixa de entrada.");
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
          <BackLink href="/login" />
          <LogoComponent className="mb-4" />
          <Pill className="mb-4">RECUPERAÇÃO DE SENHA</Pill>

          <HeaderComponent
            title="Recuperar senha"
            subTitle="Digite seu email e enviaremos um link para redefinir sua senha."
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
              disabled={isSubmitting}
            />

            <MainButton
              title={
                isSubmitting ? "Enviando..." : "Enviar link de recuperação"
              }
              type="submit"
              disabled={isSubmitting}
            />
          </form>
        </CardWrapper>
      </div>
    </div>
  );
}
