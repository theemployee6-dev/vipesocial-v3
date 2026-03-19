"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";

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
  const supabase = createClientSupabaseClient();

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
          // Atualiza o estado local quando o banco muda
          setAnalysis(payload.new as Analysis);

          // Se completou, redireciona para os roteiros após 2 segundos
          if (payload.new.status === "completed") {
            setTimeout(() => {
              router.push(`/analise/${analysisId}/roteiros`);
            }, 2000);
          }
        },
      )
      .subscribe();

    // Limpa a subscription quando o componente desmonta
    return () => {
      supabase.removeChannel(channel);
    };
  }, [analysisId, router, supabase]);

  // Confirma o nicho identificado pelo Prompt 1
  async function handleNicheConfirmation(
    confirmed: boolean,
    customNiche?: string,
  ) {
    setConfirmingNiche(true);

    try {
      const niche = confirmed
        ? analysis?.confirmed_niche
        : customNiche || nicheInput;

      const { error } = await supabase
        .from("analyses")
        .update({
          confirmed_niche: niche,
          status: "processing_prompt2",
          niche_confirmed_at: new Date().toISOString(),
        })
        .eq("id", analysisId);

      if (error) {
        console.error("Erro ao confirmar nicho:", error);
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
    } finally {
      setConfirmingNiche(false);
    }
  }

  // Encontra o step atual para mostrar na UI
  const currentStepData =
    STEPS.find((s) => s.status === analysis?.status) || STEPS[0];

  const progressPercent = analysis ? (analysis.current_step / 5) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin"
            width="32"
            height="32"
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
          <p className="font-dm-sans text-sm text-[#3a3a55]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <p className="font-dm-sans text-sm text-[#3a3a55]">
          Análise não encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center px-4 py-8">
      {/* Glow */}
      <div
        className="fixed w-[400] h-[400] rounded-full top-[-100] left-1/2 translate-x-[-50%] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,252,0.15) 0%, rgba(124,92,252,0.05) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-syne text-xl font-extrabold text-[#e8e8f8]">
            vipe<span className="text-[#7c5cfc]">Social</span>
          </span>
        </div>

        {/* Card principal */}
        <div
          className="relative rounded-2xl px-6 py-8 border border-white/6 mb-4"
          style={{
            background:
              "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 60%, #0a0a14 100%)",
          }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(124,92,252,0.6), rgba(200,140,40,0.4), transparent)",
            }}
          />

          {/* Status atual */}
          {analysis.status !== "failed" && (
            <>
              {/* Ícone animado */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[rgba(124,92,252,0.1)] border border-[rgba(124,92,252,0.2)] flex items-center justify-center">
                  {analysis.status === "completed" ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
                      className="animate-spin"
                      width="28"
                      height="28"
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

              <h1 className="font-syne text-xl font-bold text-[#e8e8f8] text-center mb-1">
                {currentStepData.label}
              </h1>
              <p className="font-dm-sans text-sm text-[#3a3a55] text-center mb-6">
                {currentStepData.description}
              </p>

              {/* Barra de progresso */}
              {analysis.status !== "awaiting_niche_confirmation" && (
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
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
                <div className="flex flex-col gap-3">
                  <div className="w-full rounded-xl px-4 py-3 bg-[rgba(124,92,252,0.06)] border border-[rgba(124,92,252,0.12)]">
                    <p className="text-xs text-[#5a5a78] font-dm-sans mb-1">
                      Nicho identificado
                    </p>
                    <p className="text-sm text-[#e8e8f8] font-syne font-semibold">
                      {analysis.confirmed_niche}
                    </p>
                  </div>

                  <p className="text-xs text-[#3a3a55] font-dm-sans text-center">
                    Está correto?
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleNicheConfirmation(true)}
                      disabled={confirmingNiche}
                      className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white bg-gradient-to-br from-[#7c5cfc] to-[#5030d0] disabled:opacity-60"
                    >
                      Sim, está certo ✓
                    </button>
                    <button
                      onClick={() => handleNicheConfirmation(false)}
                      disabled={confirmingNiche}
                      className="flex-1 rounded-xl py-2.5 text-sm font-bold text-[#5a5a78] bg-white/3 border border-white/7 disabled:opacity-60"
                    >
                      Não, vou corrigir
                    </button>
                  </div>

                  {/* Input para nicho customizado */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite o nicho correto..."
                      value={nicheInput}
                      onChange={(e) => setNicheInput(e.target.value)}
                      className="flex-1 bg-white/3 border border-white/7 rounded-xl px-3 py-2 text-sm text-[#c8c8e8] font-dm-sans outline-none focus:border-[rgba(124,92,252,0.4)]"
                    />
                    <button
                      onClick={() => handleNicheConfirmation(false, nicheInput)}
                      disabled={!nicheInput || confirmingNiche}
                      className="px-4 rounded-xl text-sm font-bold text-white bg-[rgba(124,92,252,0.3)] border border-[rgba(124,92,252,0.4)] disabled:opacity-40"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="flex flex-col gap-2 mt-4">
                {STEPS.filter((s) => s.status !== "completed").map((step) => {
                  const isDone = analysis.current_step > step.step;
                  const isCurrent = currentStepData.status === step.status;

                  return (
                    <div
                      key={step.status}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                        isCurrent
                          ? "bg-[rgba(124,92,252,0.08)] border border-[rgba(124,92,252,0.15)]"
                          : "opacity-40"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isDone
                            ? "bg-[#22c55e]"
                            : isCurrent
                              ? "bg-[#7c5cfc]"
                              : "bg-white/10"
                        }`}
                      >
                        {isDone ? (
                          <svg
                            width="10"
                            height="10"
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
                          <span className="text-[8px] text-white font-bold">
                            {step.step}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#c8c8e8] font-dm-sans">
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
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
                <h1 className="font-syne text-xl font-bold text-[#e8e8f8] mb-1">
                  Algo deu errado
                </h1>
                <p className="font-dm-sans text-sm text-[#3a3a55]">
                  {analysis.error_message ||
                    "Erro inesperado durante a análise."}
                </p>
              </div>
              <button
                onClick={() => router.push("/nova-analise")}
                className="w-full rounded-xl py-3 text-sm font-bold text-white bg-linear-to-br from-[#7c5cfc] to-[#5030d0]"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#1e1e2e] font-dm-sans">
          Não feche essa página durante a análise
        </p>
      </div>
    </div>
  );
}
