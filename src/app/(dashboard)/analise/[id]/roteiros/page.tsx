"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";

interface Script {
  id: string;
  script_number: number;
  title: string;
  central_concept: string;
  activated_emotion: string;
  suggested_caption: string;
  hashtags: string[];
  best_posting_time: string;
  posting_time_justification: string;
  scenario: {
    onde_gravar: string;
    horario_de_gravacao: string;
    tipo_de_luz: string;
    o_que_deve_aparecer_no_fundo: string;
    o_que_nao_deve_aparecer_no_fundo: string;
  };
  recording_setup: {
    orientacao: string;
    altura_do_celular: string;
    distancia_do_rosto: string;
    posicao_do_corpo: string;
    onde_apoiar_o_celular: string;
    como_segurar_se_for_na_mao: string;
  };
  wardrobe: {
    peca: string;
    cor: string;
    tecido: string;
    caimento: string;
    aparencia_realista: string;
  };
  script_timeline: {
    "0_a_3s": TimelineInterval;
    "4_a_15s": TimelineInterval;
    "16_a_35s": TimelineInterval;
    "36_a_55s": TimelineInterval;
    "56_a_75s": TimelineInterval;
  };
  editing_instructions: {
    onde_cortar: string;
    onde_acelerar: string;
    onde_inserir_legenda: string;
    onde_usar_silencio: string;
    musica_de_fundo: string;
    onde_fazer_corte_seco: string;
  };
  strategic_elements: {
    ponto_de_maior_tensao: string;
    quebra_de_expectativa: string;
    loop_de_retencao: string;
    cta_invisivel: string;
  };
  fatal_errors: string[];
  execution_status: string;
}

interface TimelineInterval {
  fala_exata: string;
  tom_de_voz: string;
  intensidade_emocional: string;
  expressao_facial: string;
  movimento_corporal: string;
  direcao_do_olhar: string;
  objetivo_desse_momento: string;
}

export default function RoteirosPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const analysisId = params.id as string;

  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScript, setActiveScript] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("roteiro");

  useEffect(() => {
    async function fetchScripts() {
      const { data, error } = await supabase
        .from("scripts")
        .select("*")
        .eq("analysis_id", analysisId)
        .order("script_number", { ascending: true });

      if (error) {
        console.error("Erro ao buscar roteiros:", error);
        return;
      }

      setScripts(data || []);
      setLoading(false);
    }

    fetchScripts();
  }, [analysisId, supabase]);

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
          <p className="font-dm-sans text-sm text-[#3a3a55]">
            Carregando roteiros...
          </p>
        </div>
      </div>
    );
  }

  if (scripts.length === 0) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <p className="font-dm-sans text-sm text-[#3a3a55]">
          Nenhum roteiro encontrado.
        </p>
      </div>
    );
  }

  const script = scripts[activeScript];

  const sections = [
    { id: "roteiro", label: "Roteiro" },
    { id: "cenario", label: "Cenário" },
    { id: "setup", label: "Setup" },
    { id: "roupa", label: "Roupa" },
    { id: "edicao", label: "Edição" },
    { id: "estrategia", label: "Estratégia" },
    { id: "erros", label: "Erros fatais" },
  ];

  const timelineIntervals = [
    { key: "0_a_3s", label: "0 a 3s — Hook" },
    { key: "4_a_15s", label: "4 a 15s — Desenvolvimento" },
    { key: "16_a_35s", label: "16 a 35s — Tensão" },
    { key: "36_a_55s", label: "36 a 55s — Virada" },
    { key: "56_a_75s", label: "56 a 75s — Resolução" },
  ];

  return (
    <div className="min-h-screen bg-[#080810]">
      {/* Header fixo */}
      <div
        className="sticky top-0 z-20 border-b border-white/6 px-4 py-3"
        style={{
          background: "rgba(8,8,16,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-xs text-[#3a3a50] hover:text-[#6a6a90] transition-colors font-dm-sans"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Dashboard
          </button>

          <span className="font-syne text-sm font-bold text-[#e8e8f8]">
            vipe<span className="text-[#7c5cfc]">Social</span>
          </span>

          <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="text-[10px] text-[#22c55e] font-dm-sans">
              5 roteiros prontos
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Título */}
        <div className="mb-6">
          <h1 className="font-syne text-2xl font-bold text-[#e8e8f8] mb-1">
            Seus roteiros virais
          </h1>
          <p className="font-dm-sans text-sm text-[#3a3a55]">
            Baseados no DNA emocional do seu vídeo. Escolhe um e grava hoje.
          </p>
        </div>

        {/* Seletor de roteiros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {scripts.map((s, index) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveScript(index);
                setActiveSection("roteiro");
              }}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition-all font-dm-sans ${
                activeScript === index
                  ? "bg-[#7c5cfc] text-white"
                  : "bg-white/3 border border-white/7 text-[#5a5a78] hover:border-white/15"
              }`}
            >
              Roteiro {s.script_number}
            </button>
          ))}
        </div>

        {/* Card do roteiro ativo */}
        <div
          className="relative rounded-2xl border border-white/6 overflow-hidden mb-4"
          style={{
            background:
              "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 60%, #0a0a14 100%)",
          }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(124,92,252,0.6), rgba(200,140,40,0.4), transparent)",
            }}
          />

          {/* Header do roteiro */}
          <div className="px-6 py-5 border-b border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-2 bg-[rgba(124,92,252,0.08)] border border-[rgba(124,92,252,0.15)]">
                  <span className="text-[10px] text-[#6a50c0] font-dm-sans">
                    {script.activated_emotion}
                  </span>
                </div>
                <h2 className="font-syne text-lg font-bold text-[#e8e8f8]">
                  {script.title}
                </h2>
                <p className="font-dm-sans text-xs text-[#3a3a55] mt-1">
                  {script.central_concept}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-[#5a5a78] font-dm-sans">Postar às</p>
                <p className="text-sm font-bold text-[#e8e8f8] font-syne">
                  {script.best_posting_time}
                </p>
              </div>
            </div>

            {/* Legenda e hashtags */}
            <div className="mt-3 p-3 rounded-xl bg-white/2 border border-white/5">
              <p className="text-xs text-[#5a5a78] font-dm-sans mb-1">
                Legenda sugerida
              </p>
              <p className="text-sm text-[#c8c8e8] font-dm-sans">
                {script.suggested_caption}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {script.hashtags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-[#6a50c0] font-dm-sans"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navegação de seções */}
          <div className="flex gap-1 px-4 py-3 border-b border-white/5 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-dm-sans transition-all ${
                  activeSection === section.id
                    ? "bg-[rgba(124,92,252,0.15)] text-[#7c5cfc] border border-[rgba(124,92,252,0.3)]"
                    : "text-[#3a3a55] hover:text-[#5a5a78]"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Conteúdo da seção */}
          <div className="px-6 py-5">
            {/* ROTEIRO CRONOLÓGICO */}
            {activeSection === "roteiro" && (
              <div className="flex flex-col gap-4">
                {timelineIntervals.map(({ key, label }) => {
                  const interval =
                    script.script_timeline[
                      key as keyof typeof script.script_timeline
                    ];
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-white/7 bg-white/2 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-white/5 bg-[rgba(124,92,252,0.05)]">
                        <span className="text-xs font-bold text-[#7c5cfc] font-syne">
                          {label}
                        </span>
                      </div>
                      <div className="px-4 py-3 flex flex-col gap-2">
                        <div>
                          <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-0.5">
                            O que falar
                          </p>
                          <p className="text-sm text-[#e8e8f8] font-dm-sans font-medium">
                            &quot;{interval.fala_exata}&quot;
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-0.5">
                              Tom de voz
                            </p>
                            <p className="text-xs text-[#c8c8e8] font-dm-sans">
                              {interval.tom_de_voz}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-0.5">
                              Intensidade
                            </p>
                            <p className="text-xs text-[#c8c8e8] font-dm-sans">
                              {interval.intensidade_emocional}/10
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-0.5">
                              Expressão
                            </p>
                            <p className="text-xs text-[#c8c8e8] font-dm-sans">
                              {interval.expressao_facial}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-0.5">
                              Olhar
                            </p>
                            <p className="text-xs text-[#c8c8e8] font-dm-sans">
                              {interval.direcao_do_olhar}
                            </p>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-[rgba(124,92,252,0.05)] border border-[rgba(124,92,252,0.1)]">
                          <p className="text-[10px] text-[#6a50c0] font-dm-sans">
                            🎯 {interval.objetivo_desse_momento}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CENÁRIO */}
            {activeSection === "cenario" && (
              <div className="flex flex-col gap-3">
                {Object.entries({
                  "Onde gravar": script.scenario.onde_gravar,
                  "Horário de gravação": script.scenario.horario_de_gravacao,
                  "Tipo de luz": script.scenario.tipo_de_luz,
                  "O que deve aparecer no fundo":
                    script.scenario.o_que_deve_aparecer_no_fundo,
                  "O que NÃO deve aparecer no fundo":
                    script.scenario.o_que_nao_deve_aparecer_no_fundo,
                }).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/7 bg-white/2 px-4 py-3"
                  >
                    <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-[#c8c8e8] font-dm-sans">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* SETUP */}
            {activeSection === "setup" && (
              <div className="flex flex-col gap-3">
                {Object.entries({
                  Orientação: script.recording_setup.orientacao,
                  "Altura do celular": script.recording_setup.altura_do_celular,
                  "Distância do rosto":
                    script.recording_setup.distancia_do_rosto,
                  "Posição do corpo": script.recording_setup.posicao_do_corpo,
                  "Onde apoiar o celular":
                    script.recording_setup.onde_apoiar_o_celular,
                  "Como segurar na mão":
                    script.recording_setup.como_segurar_se_for_na_mao,
                }).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/7 bg-white/2 px-4 py-3"
                  >
                    <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-[#c8c8e8] font-dm-sans">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ROUPA */}
            {activeSection === "roupa" && (
              <div className="flex flex-col gap-3">
                {Object.entries({
                  Peça: script.wardrobe.peca,
                  Cor: script.wardrobe.cor,
                  Tecido: script.wardrobe.tecido,
                  Caimento: script.wardrobe.caimento,
                  "Aparência realista": script.wardrobe.aparencia_realista,
                }).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/7 bg-white/2 px-4 py-3"
                  >
                    <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-[#c8c8e8] font-dm-sans">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* EDIÇÃO */}
            {activeSection === "edicao" && (
              <div className="flex flex-col gap-3">
                {Object.entries({
                  "Onde cortar": script.editing_instructions.onde_cortar,
                  "Onde acelerar": script.editing_instructions.onde_acelerar,
                  "Onde inserir legenda":
                    script.editing_instructions.onde_inserir_legenda,
                  "Onde usar silêncio":
                    script.editing_instructions.onde_usar_silencio,
                  "Música de fundo":
                    script.editing_instructions.musica_de_fundo,
                  "Onde fazer corte seco":
                    script.editing_instructions.onde_fazer_corte_seco,
                }).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/7 bg-white/2 px-4 py-3"
                  >
                    <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-[#c8c8e8] font-dm-sans">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ESTRATÉGIA */}
            {activeSection === "estrategia" && (
              <div className="flex flex-col gap-3">
                {Object.entries({
                  "Ponto de maior tensão":
                    script.strategic_elements.ponto_de_maior_tensao,
                  "Quebra de expectativa":
                    script.strategic_elements.quebra_de_expectativa,
                  "Loop de retenção":
                    script.strategic_elements.loop_de_retencao,
                  "CTA invisível": script.strategic_elements.cta_invisivel,
                }).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/7 bg-white/2 px-4 py-3"
                  >
                    <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-[#c8c8e8] font-dm-sans">
                      {value}
                    </p>
                  </div>
                ))}

                <div className="rounded-xl border border-white/7 bg-white/2 px-4 py-3">
                  <p className="text-[10px] text-[#3a3a55] font-dm-sans mb-1">
                    Melhor horário para postar
                  </p>
                  <p className="text-sm text-[#e8e8f8] font-syne font-bold">
                    {script.best_posting_time}
                  </p>
                  <p className="text-xs text-[#3a3a55] font-dm-sans mt-1">
                    {script.posting_time_justification}
                  </p>
                </div>
              </div>
            )}

            {/* ERROS FATAIS */}
            {activeSection === "erros" && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-[#3a3a55] font-dm-sans mb-1">
                  Evita esses erros que vão destruir esse roteiro específico.
                </p>
                {script.fatal_errors?.map((erro, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3 flex gap-3"
                  >
                    <span className="text-red-400 text-sm shrink-0">⚠️</span>
                    <p className="text-sm text-[#c8c8e8] font-dm-sans">
                      {erro}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botão de nova análise */}
        <button
          onClick={() => router.push("/nova-analise")}
          className="w-full rounded-xl py-3.5 text-sm font-bold text-[#5a5a78] bg-white/3 border border-white/7 font-dm-sans hover:border-white/15 transition-colors"
        >
          Fazer nova análise
        </button>
      </div>
    </div>
  );
}
