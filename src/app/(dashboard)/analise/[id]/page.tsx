"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import { toast } from "sonner";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import Loading from "@/shared/components/Loading/Loading";
import GlowsEffectComponent from "@/shared/components/GlowsEffectComponent/GlowsEffectComponent";
import LogoComponent from "@/shared/components/LogoComponent/LogoComponent";
import TopGlowLineComponent from "@/shared/components/TopGlowLineComponent/TopGlowLineComponent";

// Os status possíveis de uma análise em ordem de progressão
const STEPS = [
  {
    status: "processing_prompt1",
    label: "Analisando o vídeo",
    description: "Extraindo DNA emocional e estrutural...",
    step: 1,
  },
  {
    status: "awaiting_niche_confirmation",
    label: "Aguardando confirmação",
    description: "Identificamos o nicho do seu vídeo...",
    step: 2,
  },
  {
    status: "processing_prompt2",
    label: "Destilando emoções",
    description: "Identificando a emoção central que viralizou...",
    step: 3,
  },
  {
    status: "processing_prompt3",
    label: "Adaptando para sua realidade",
    description: "Reconstruindo conceitos para o seu perfil...",
    step: 4,
  },
  {
    status: "processing_prompt4",
    label: "Gerando roteiros",
    description: "Criando 5 roteiros personalizados para você...",
    step: 5,
  },
  {
    status: "completed",
    label: "Análise concluída!",
    description: "Seus roteiros estão prontos.",
    step: 6,
  },
];

interface Analysis {
  id: string;
  status: string;
  current_step: number;
  confirmed_niche: string | null;
  error_message: string | null;
}

export default function AnalisePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => createClientSupabaseClient(), []);

  const analysisId = params.id as string;

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmingNiche, setConfirmingNiche] = useState(false);
  const [nicheInput, setNicheInput] = useState("");

  // Busca a análise inicial
  useEffect(() => {
    async function fetchAnalysis() {
      const { data, error } = await supabase
        .from("analyses")
        .select("id, status, current_step, confirmed_niche, error_message")
        .eq("id", analysisId)
        .single();

      if (error) {
        console.error("Erro ao buscar análise:", error);
        return;
      }

      setAnalysis(data);
      setLoading(false);
    }

    fetchAnalysis();
  }, [analysisId, supabase]);

  // Escuta atualizações em tempo real via Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`analysis-${analysisId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "analyses",
          filter: `id=eq.${analysisId}`,
        },
        (payload) => {
          setAnalysis(payload.new as Analysis);

          if (payload.new.status === "completed") {
            setTimeout(() => {
              router.push(`/analise/${analysisId}/roteiros`);
            }, 2000);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [analysisId, router, supabase]);

  async function handleNicheConfirmation(
    confirmed: boolean,
    customNiche?: string,
  ) {
    setConfirmingNiche(true);

    try {
      const niche = confirmed
        ? analysis?.confirmed_niche
        : customNiche || nicheInput;

      if (!niche) return;

      // Atualiza o banco
      await supabase
        .from("analyses")
        .update({
          confirmed_niche: niche,
          niche_confirmed_at: new Date().toISOString(),
        })
        .eq("id", analysisId);

      const response = await fetch("/api/analysis/confirm-niche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, confirmedNiche: niche }),
      });

      if (!response.ok) {
        toast.error("Erro ao confirmar nicho. Tente novamente.");
        return;
      }
    } catch (err) {
      console.error("Erro ao confirmar nicho:", err);
      toast.error("Erro ao confirmar nicho. Tente novamente.");
    } finally {
      setConfirmingNiche(false);
    }
  }

  const currentStepData =
    STEPS.find((s) => s.status === analysis?.status) || STEPS[0];

  const progressPercent = analysis ? (analysis.current_step / 5) * 100 : 0;

  if (loading) {
    return <Loading />;
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center p-4">
        <p className="font-dm-sans text-sm text-[#E6BCBD]">
          Análise não encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      {/* Glow responsivo com nova cor */}
      <GlowsEffectComponent />
      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <LogoComponent />
        </div>

        {/* Card principal - sem borda, fundo tonal */}
        <div className="relative rounded-2xl bg-[#1C1B1B] p-6 sm:p-8">
          {/* Top glow line (mantido como elemento decorativo) */}
          <TopGlowLineComponent />

          {/* Status atual */}
          {analysis.status !== "failed" ? (
            <>
              {/* Ícone animado */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[rgba(254,44,85,0.1)] flex items-center justify-center">
                  {analysis.status === "completed" ? (
                    <Check size={28} stroke="#FE2C55" strokeWidth={2} />
                  ) : (
                    <Loader2
                      className="animate-spin"
                      size={28}
                      stroke="#FE2C55"
                      strokeWidth={2}
                    />
                  )}
                </div>
              </div>

              <h1 className="font-syne text-xl font-bold text-white text-center mb-1">
                {currentStepData.label}
              </h1>
              <p className="font-dm-sans text-sm text-[#E6BCBD] text-center mb-6">
                {currentStepData.description}
              </p>

              {/* Barra de progresso */}
              {analysis.status !== "awaiting_niche_confirmation" && (
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-[#FE2C55]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              )}

              {/* Confirmação de nicho */}
              {analysis.status === "awaiting_niche_confirmation" && (
                <div className="flex flex-col gap-4">
                  <div className="w-full rounded-xl p-4 bg-[rgba(254,44,85,0.06)]">
                    <p className="text-xs text-[#888888] font-dm-sans mb-1">
                      Nicho identificado
                    </p>
                    <p className="text-sm text-white font-syne font-semibold">
                      {analysis.confirmed_niche}
                    </p>
                  </div>

                  <p className="text-xs text-[#E6BCBD] font-dm-sans text-center">
                    Está correto?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleNicheConfirmation(true)}
                      disabled={confirmingNiche}
                      className="w-full sm:flex-1 rounded-xl py-3 text-sm font-bold text-white bg-[#FE2C55] hover:bg-[#e03c4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sim, está certo ✓
                    </button>
                    <button
                      onClick={() => handleNicheConfirmation(false)}
                      disabled={confirmingNiche}
                      className="w-full sm:flex-1 rounded-xl py-3 text-sm font-bold text-[#E6BCBD] bg-[#1C1B1B] hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
                    >
                      Não, vou corrigir
                    </button>
                  </div>

                  {/* Input para nicho customizado */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Digite o nicho correto..."
                      value={nicheInput}
                      onChange={(e) => setNicheInput(e.target.value)}
                      className="flex-1 bg-[#1C1B1B] rounded-xl px-4 py-3 text-sm text-white font-dm-sans outline-none focus:ring-1 focus:ring-[#FE2C55] placeholder:text-[#888888]"
                    />
                    <button
                      onClick={() => handleNicheConfirmation(false, nicheInput)}
                      disabled={!nicheInput || confirmingNiche}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#FE2C55] hover:bg-[#e03c4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="flex flex-col gap-2 mt-6">
                {STEPS.filter((s) => s.status !== "completed").map((step) => {
                  const isDone = analysis.current_step > step.step;
                  const isCurrent = currentStepData.status === step.status;

                  return (
                    <div
                      key={step.status}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                        isCurrent ? "bg-[rgba(254,44,85,0.08)]" : "opacity-50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isDone
                            ? "bg-[#22c55e]"
                            : isCurrent
                              ? "bg-[#FE2C55]"
                              : "bg-white/10"
                        }`}
                      >
                        {isDone ? (
                          <Check size={10} strokeWidth={1.5} color="white" />
                        ) : (
                          <span className="text-[10px] text-white font-bold">
                            {step.step}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white font-dm-sans">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            // Estado de erro
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
                <TriangleAlert size={28} strokeWidth={1.5} color="#ef4444" />
              </div>
              <div>
                <h1 className="font-syne text-xl font-bold text-white mb-1">
                  Algo deu errado
                </h1>
                <p className="font-dm-sans text-sm text-[#E6BCBD]">
                  {analysis.error_message ||
                    "Erro inesperado durante a análise."}
                </p>
              </div>
              <button
                onClick={() => router.push("/nova-analise")}
                className="w-full rounded-xl py-3 text-sm font-bold text-white bg-[#FE2C55] hover:bg-[#e03c4a] transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#888888] font-dm-sans mt-4">
          Não feche essa página durante a análise
        </p>
      </div>
    </div>
  );
}
