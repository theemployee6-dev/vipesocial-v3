"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import GlowsEffectComponent from "@/shared/components/Glows/page";
import TopGlowLineComponent from "@/shared/components/TopGlowLine/page";
import OnboardingHeader from "../_components/OnboardingHeader/OnboardingHeader";
import HeaderComponent from "@/shared/components/Header/page";
import FieldInput from "@/shared/components/FieldInput/FieldInput";
import MainButton from "@/shared/components/MainButton/page";
import ProgressBar from "../_components/ProgressBar/ProgressBar";
import BackButton from "../_components/BackButton/BackButton";
import OnboardingMainButton from "../_components/OnboardingMainButton/OnboardingMainButton";
import RadioButton from "../_components/RadioButton/RadioButton";
import Label from "../_components/Label/Label";
import CardWrapper from "@/shared/components/CardWrapper/page";
import CheckboxButton from "../_components/CheckboxButton/CheckboxButton";

// Schema de validação para cada etapa
const step1Schema = z.object({
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  tiktokHandle: z
    .string()
    .min(1, "Handle do TikTok é obrigatório")
    .regex(/^@?[\w.]+$/, "Handle inválido"),
});

const step2Schema = z.object({
  age: z
    .number({ error: "Digite sua idade" })
    .min(13, "Idade mínima é 13 anos")
    .max(80, "Idade inválida"),
  city: z.string().min(2, "Digite sua cidade"),
  state: z.string().min(2, "Digite seu estado"),
});

const step3Schema = z.object({
  recordingDevice: z.string().min(1, "Selecione uma opção"),
  hasDedicatedSpace: z.boolean(),
  weeklyProductionHours: z
    .number({ error: "Digite as horas" })
    .min(1, "Mínimo 1 hora")
    .max(168, "Máximo 168 horas"),
});

const step4Schema = z.object({
  primaryNiche: z.string().min(1, "Selecione um nicho"),
  identityLimit: z.string().min(10, "Descreva com mais detalhes"),
  admiresCreator: z.string().min(1, "Digite um criador"),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

// Nichos disponíveis na vipeSocial
const NICHOS = [
  "Humor",
  "Finanças e dinheiro",
  "Relacionamento e amor",
  "Motivação e superação",
  "Lifestyle e rotina",
  "Beleza e autocuidado",
  "Saúde e corpo",
  "Educação e conhecimento",
  "Fé e espiritualidade",
  "Empreendedorismo",
  "Tecnologia",
  "Cultura e identidade brasileira",
];

// Opções de celular para inferir realidade socioeconômica
const DISPOSITIVOS = [
  "iPhone (qualquer modelo)",
  "Samsung Galaxy S ou A (intermediário/top)",
  "Motorola linha G ou E",
  "Outro Android básico",
  "Outro",
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  // Controla qual etapa está sendo exibida
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Guarda os dados de cada etapa conforme o usuário avança
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Data | null>(null);

  // Form da etapa 1
  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  // Form da etapa 2
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  });

  // Form da etapa 3
  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      hasDedicatedSpace: false,
      recordingDevice: "", // adiciona essa linha
      weeklyProductionHours: 0, // e essa
    },
  });

  // Form da etapa 4
  const form4 = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      primaryNiche: "",
      identityLimit: "",
      admiresCreator: "",
    },
  });

  // Avança da etapa 1 para 2
  async function onStep1Submit(data: Step1Data) {
    setStep1Data(data);
    setCurrentStep(2);
  }

  // Avança da etapa 2 para 3
  async function onStep2Submit(data: Step2Data) {
    setStep2Data(data);
    setCurrentStep(3);
  }

  // Avança da etapa 3 para 4
  async function onStep3Submit(data: Step3Data) {
    setStep3Data(data);
    setCurrentStep(4);
  }

  async function onStep4Submit(data: Step4Data) {
    if (!step1Data || !step2Data || !step3Data) return;

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Sessão expirada. Faça login novamente.");
        router.push("/login");
        return;
      }

      const inferSocioeconomic = (device: string) => {
        if (device.includes("iPhone")) return "wealthy";
        if (device.includes("Samsung Galaxy S")) return "middle_class";
        return "poor";
      };

      // Salva o creator_profile no banco
      const { error: profileError } = await supabase
        .from("creator_profiles")
        .insert({
          user_id: user.id,
          socioeconomic_reality: inferSocioeconomic(step3Data.recordingDevice),
          socioeconomic_confidence: 0.7,
          age: step2Data.age,
          city: step2Data.city,
          state: step2Data.state,
          recording_device: step3Data.recordingDevice,
          has_dedicated_space: step3Data.hasDedicatedSpace,
          weekly_production_hours: step3Data.weeklyProductionHours,
          primary_niche: data.primaryNiche,
          identity_limits: { neverWouldPost: data.identityLimit },
          cultural_references: { admiresCreator: data.admiresCreator },
          channel_stage: "beginner",
        });

      if (profileError) {
        console.error(
          "Erro ao salvar perfil:",
          JSON.stringify(profileError, null, 2),
        );
        console.error("Código:", profileError.code);
        console.error("Mensagem:", profileError.message);
        console.error("Detalhes:", profileError.details);
        toast.error("Erro ao salvar seu perfil. Tente novamente.");
        return;
      }

      // Marca onboarding como completo na tabela profiles
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user.id);

      if (updateError) {
        console.error("Erro ao atualizar profiles:", updateError);
        toast.error("Erro ao finalizar onboarding. Tente novamente.");
        return;
      }

      // Salva o flag nos metadados do Auth para o proxy verificar
      const { error: metaError } = await supabase.auth.updateUser({
        data: { onboarding_completed: true },
      });

      if (metaError) {
        console.error("Erro ao atualizar metadados:", metaError);
        toast.error("Erro ao finalizar onboarding. Tente novamente.");
        return;
      }

      toast.success("Perfil configurado com sucesso!");
      router.push("/dashboard");
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Barra de progresso
  const progressPercent = (currentStep / 4) * 100;

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Glow superior */}
      <GlowsEffectComponent />

      {/* Card principal */}
      <CardWrapper>
        {/* Top glow line */}
        <TopGlowLineComponent />

        {/* Header */}
        <section>
          <OnboardingHeader currentStep={currentStep} />
        </section>

        {/* Barra de progresso */}
        <section>
          <ProgressBar progressPercent={progressPercent} />
        </section>

        {/* ETAPA 1 */}
        {currentStep === 1 && (
          <form
            onSubmit={form1.handleSubmit(onStep1Submit)}
            className="flex flex-col gap-3"
          >
            <section>
              <HeaderComponent
                title="Vamos começar"
                subTitle=" Como posso te chamar?"
              />
            </section>

            <section>
              <FieldInput
                label="Seu nome"
                type="text"
                placeholder="Como você quer ser chamado"
                registration={form1.register("fullName")}
                error={form1.formState.errors.fullName?.message}
              />
            </section>

            <section>
              <FieldInput
                label="Seu @ no TikTok"
                type="text"
                placeholder="@seuhandle"
                registration={form1.register("tiktokHandle")}
                error={form1.formState.errors.tiktokHandle?.message}
              />
            </section>

            <section className="mt-5">
              <MainButton title="Continuar →" />
            </section>
          </form>
        )}

        {/* ETAPA 2 */}
        {currentStep === 2 && (
          <form
            onSubmit={form2.handleSubmit(onStep2Submit)}
            className="flex flex-col gap-3"
          >
            <section>
              <HeaderComponent
                title="Sobre você 👤"
                subTitle="Essas informações personalizam sua análise."
              />
            </section>

            <section>
              <FieldInput
                label="Sua idade"
                type="number"
                placeholder="25"
                registration={form2.register("age", { valueAsNumber: true })}
                error={form2.formState.errors.age?.message}
              />
            </section>

            <div className="flex gap-3">
              <section className="flex-1">
                <FieldInput
                  label="Cidade"
                  type="text"
                  placeholder="São Paulo"
                  registration={form2.register("city")}
                  error={form2.formState.errors.city?.message}
                />
              </section>

              <section className="w-24">
                <FieldInput
                  label="Estado"
                  type="text"
                  placeholder="SP"
                  maxLength={2}
                  registration={form2.register("state")}
                  error={form2.formState.errors.state?.message}
                />
              </section>
            </div>

            <section className="flex gap-3 mt-2">
              <BackButton title=" ← Voltar" onClick={() => setCurrentStep(1)} />
              <OnboardingMainButton title="Continuar →" />
            </section>
          </form>
        )}

        {/* ETAPA 3 */}
        {currentStep === 3 && (
          <form
            onSubmit={form3.handleSubmit(onStep3Submit)}
            className="flex flex-col gap-2"
          >
            <section>
              <HeaderComponent
                title="Sua realidade 📱"
                subTitle="Isso ajuda a criar roteiros que você consegue executar hoje."
              />
            </section>

            <section>
              <Label title=" Qual celular você usa para gravar?" />
              <div className="flex flex-col gap-2">
                {DISPOSITIVOS.map((device) => (
                  <RadioButton
                    key={device}
                    title={device}
                    value={device}
                    registration={form3.register("recordingDevice")}
                  />
                ))}
                {form3.formState.errors.recordingDevice && (
                  <p className="text-[11px] text-red-400 mt-1.5 font-dm-sans">
                    {form3.formState.errors.recordingDevice.message}
                  </p>
                )}
              </div>
            </section>

            <div>
              <CheckboxButton
                title="Tenho um espaço dedicado para gravar"
                registration={form3.register("hasDedicatedSpace")}
              />
            </div>

            <div>
              <FieldInput
                label="Horas por semana disponíveis para criar conteúdo"
                type="number"
                placeholder="5"
                registration={form3.register("weeklyProductionHours", {
                  valueAsNumber: true,
                })}
                error={form3.formState.errors.weeklyProductionHours?.message}
              />
            </div>

            <section className="flex gap-3 mt-2">
              <BackButton title=" ← Voltar" onClick={() => setCurrentStep(2)} />
              <OnboardingMainButton title="Continuar →" />
            </section>
          </form>
        )}

        {/* ETAPA 4 */}
        {currentStep === 4 && (
          <form
            onSubmit={form4.handleSubmit(onStep4Submit)}
            className="flex flex-col gap-5"
          >
            <section>
              <HeaderComponent
                title="Seu conteúdo 🎬"
                subTitle="Última etapa. Prometo que vale a pena."
              />
            </section>

            <section>
              <Label title=" Qual é o seu nicho principal?" />
              <div className="grid grid-cols-2 gap-2">
                {NICHOS.map((niche) => (
                  <RadioButton
                    key={niche}
                    title={niche}
                    value={niche}
                    registration={form4.register("primaryNiche")}
                  />
                ))}
                {form4.formState.errors.primaryNiche && (
                  <p className="text-[11px] text-red-400 mt-1.5 font-dm-sans">
                    {form4.formState.errors.primaryNiche!.message}
                  </p>
                )}
              </div>
            </section>

            <section>
              <FieldInput
                label="O que você nunca postaria mesmo que pagassem?"
                type="textarea"
                placeholder="Ex: nunca exporia minha família, nunca faria conteúdo político..."
                rows={3}
                registration={form4.register("identityLimit")}
                error={form4.formState.errors.identityLimit?.message}
              />
            </section>

            <section>
              <FieldInput
                label="Qual criador você mais admira no TikTok?"
                type="text"
                placeholder="@criador"
                registration={form4.register("admiresCreator")}
                error={form4.formState.errors.admiresCreator?.message}
              />
            </section>

            <section className="flex gap-3 mt-2">
              <BackButton title=" ← Voltar" onClick={() => setCurrentStep(3)} />
              <OnboardingMainButton
                title={isSubmitting ? "Salvando..." : "Começar a viralizar →"}
                disabled={isSubmitting}
              />
            </section>
          </form>
        )}
      </CardWrapper>
    </div>
  );
}
