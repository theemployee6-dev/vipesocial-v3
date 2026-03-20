"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import { toast } from "sonner";

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
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#7c5cfc"
              strokeWidth="2"
              strokeDasharray="32"
              strokeDashoffset="12"
            />
          </svg>
          <p className="font-dm-sans text-sm sm:text-base text-[#3a3a55]">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4">
        <p className="font-dm-sans text-sm sm:text-base text-[#3a3a55]">
          Análise não encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
      {/* Glow responsivo */}
      <div
        className="fixed w-[300] sm:w-[400] md:w-[500] lg:w-[600] xl:w-[700] 2xl:w-[800] h-[300] sm:h-[400] md:h-[500] lg:h-[600] xl:h-[700] 2xl:h-[800] rounded-full top-[-50] sm:top-[-80] md:top-[-100] lg:top-[-120] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,252,0.15) 0%, rgba(124,92,252,0.05) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <span className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold text-[#e8e8f8]">
            vipe<span className="text-[#7c5cfc]">Social</span>
          </span>
        </div>

        {/* Card principal */}
        <div
          className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/6"
          style={{
            background:
              "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 60%, #0a0a14 100%)",
          }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-2xl sm:rounded-t-3xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(124,92,252,0.6), rgba(200,140,40,0.4), transparent)",
            }}
          />

          {/* Status atual */}
          {analysis.status !== "failed" && (
            <>
              {/* Ícone animado */}
              <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl bg-[rgba(124,92,252,0.1)] border border-[rgba(124,92,252,0.2)] flex items-center justify-center">
                  {analysis.status === "completed" ? (
                    <svg
                      width="28"
                      height="28"
                      className="w-8 h-8 sm:w-10 sm:h-10"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="animate-spin w-8 h-8 sm:w-10 sm:h-10"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#7c5cfc"
                        strokeWidth="2"
                        strokeDasharray="32"
                        strokeDashoffset="12"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <h1 className="font-syne text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#e8e8f8] text-center mb-1 sm:mb-2">
                {currentStepData.label}
              </h1>
              <p className="font-dm-sans text-sm sm:text-base md:text-lg text-[#3a3a55] text-center mb-6 sm:mb-8 md:mb-10">
                {currentStepData.description}
              </p>

              {/* Barra de progresso */}
              {analysis.status !== "awaiting_niche_confirmation" && (
                <div className="w-full h-2 sm:h-3 md:h-4 bg-white/5 rounded-full overflow-hidden mb-6 sm:mb-8 md:mb-10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg, #7c5cfc, #5a3de0)",
                    }}
                  />
                </div>
              )}

              {/* Confirmação de nicho */}
              {analysis.status === "awaiting_niche_confirmation" && (
                <div className="flex flex-col gap-4 sm:gap-5">
                  <div className="w-full rounded-xl p-4 sm:p-5 bg-[rgba(124,92,252,0.06)] border border-[rgba(124,92,252,0.12)]">
                    <p className="text-xs sm:text-sm text-[#5a5a78] font-dm-sans mb-1">
                      Nicho identificado
                    </p>
                    <p className="text-sm sm:text-base text-[#e8e8f8] font-syne font-semibold">
                      {analysis.confirmed_niche}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#3a3a55] font-dm-sans text-center">
                    Está correto?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleNicheConfirmation(true)}
                      disabled={confirmingNiche}
                      className="w-full sm:flex-1 rounded-xl py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-linear-to-br from-[#7c5cfc] to-[#5030d0] disabled:opacity-60"
                    >
                      Sim, está certo ✓
                    </button>
                    <button
                      onClick={() => handleNicheConfirmation(false)}
                      disabled={confirmingNiche}
                      className="w-full sm:flex-1 rounded-xl py-3 sm:py-3.5 text-sm sm:text-base font-bold text-[#5a5a78] bg-white/3 border border-white/7 disabled:opacity-60"
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
                      className="flex-1 bg-white/3 border border-white/7 rounded-xl px-4 py-3 text-sm sm:text-base text-[#c8c8e8] font-dm-sans outline-none focus:border-[rgba(124,92,252,0.4)]"
                    />
                    <button
                      onClick={() => handleNicheConfirmation(false, nicheInput)}
                      disabled={!nicheInput || confirmingNiche}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm sm:text-base font-bold text-white bg-[rgba(124,92,252,0.3)] border border-[rgba(124,92,252,0.4)] disabled:opacity-40"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="flex flex-col gap-2 sm:gap-3 mt-6 sm:mt-8">
                {STEPS.filter((s) => s.status !== "completed").map((step) => {
                  const isDone = analysis.current_step > step.step;
                  const isCurrent = currentStepData.status === step.status;

                  return (
                    <div
                      key={step.status}
                      className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-colors ${
                        isCurrent
                          ? "bg-[rgba(124,92,252,0.08)] border border-[rgba(124,92,252,0.15)]"
                          : "opacity-40"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isDone
                            ? "bg-[#22c55e]"
                            : isCurrent
                              ? "bg-[#7c5cfc]"
                              : "bg-white/10"
                        }`}
                      >
                        {isDone ? (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <span className="text-[10px] sm:text-xs text-white font-bold">
                            {step.step}
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-[#c8c8e8] font-dm-sans">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Estado de erro */}
          {analysis.status === "failed" && (
            <div className="flex flex-col items-center gap-4 sm:gap-5 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="font-syne text-lg sm:text-xl md:text-2xl font-bold text-[#e8e8f8] mb-1">
                  Algo deu errado
                </h1>
                <p className="font-dm-sans text-sm sm:text-base text-[#3a3a55]">
                  {analysis.error_message ||
                    "Erro inesperado durante a análise."}
                </p>
              </div>
              <button
                onClick={() => router.push("/nova-analise")}
                className="w-full rounded-xl py-3 sm:py-4 text-sm sm:text-base font-bold text-white bg-linear-to-br from-[#7c5cfc] to-[#5030d0]"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs sm:text-sm text-[#1e1e2e] font-dm-sans mt-4">
          Não feche essa página durante a análise
        </p>
      </div>
    </div>
  );
}
