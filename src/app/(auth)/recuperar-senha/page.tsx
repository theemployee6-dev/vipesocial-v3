"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import BackLinkComponent from "../_shared/_components/BackLink/page";

import CardWrapper from "@/shared/components/CardWrapper/page";
import FieldInput from "@/shared/components/FieldInput/FieldInput";
import GlowsEffectComponent from "@/shared/components/Glows/page";
import HeaderComponent from "@/shared/components/Header/page";
import LogoComponent from "@/shared/components/Logo/page";
import MainButton from "@/shared/components/MainButton/page";
import TopGlowLineComponent from "@/shared/components/TopGlowLine/page";

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
        // Após o usuário clicar no link do email,
        // ele será redirecionado para essa rota
        // onde pode digitar a nova senha.
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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080810] px-4 py-8">
      {/* Glow */}
      <GlowsEffectComponent />

      {/* Back link */}
      <BackLinkComponent href="/login" />

      {/* Card */}
      <CardWrapper>
        {/* Top glow line */}
        <TopGlowLineComponent />

        {/* Logo */}
        <LogoComponent className="max-w-[clamp(180px,15vw,200px)] md:max-w-[clamp(180px,12vw,280px)] lg:max-w-[clamp(220px,10vw,350px)] mb-5" />

        {/* Heading */}
        <section>
          <HeaderComponent
            title="Recuperar senha"
            subTitle=" Digite seu email e enviaremos um link para redefinir sua senha."
          />
        </section>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <FieldInput
            label="Email"
            type="email"
            placeholder="seu@email.com"
            registration={register("email")}
            error={errors.email?.message}
          />

          {/* Botão */}
          <div className="relative mt-2">
            <MainButton
              title={
                isSubmitting ? "Enviando..." : "Enviar link de recuperação →"
              }
            />
          </div>
        </form>
      </CardWrapper>
    </div>
  );
}
