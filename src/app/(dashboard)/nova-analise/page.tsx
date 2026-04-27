"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import { VideoUploader } from "@/shared/components/VideoUploader/VideoUploader";
import Loading from "@/shared/components/Loading/Loading";
import { Check, ChevronLeft } from "lucide-react";
import {
  MetricasFormData,
  metricasSchema,
} from "./_validation/validationSchema";

// ─── Design Tokens — Cinematic Intelligence ───────────────────────────────────
// bg: #131313 | card-1: #1C1B1B | card-2: #201F1F
// accent: #FE2C55 | text-secondary: #E6BCBD | text-muted: #5A5A5A
// border: rgba(255,255,255,0.06) | input-bg: rgba(255,255,255,0.04)
// ─────────────────────────────────────────────────────────────────────────────

// ─── MetricInput ──────────────────────────────────────────────────────────────

function MetricInput({
  emoji,
  label,
  error,
  inputProps,
}: {
  emoji: string;
  label: string;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        className="block font-dm-sans text-xs font-medium mb-1.5 truncate"
        style={{ color: "#5A5A5A" }}
      >
        {emoji} {label}
      </label>
      <input
        type="number"
        min="0"
        {...inputProps}
        onFocus={(e) => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        className="w-full rounded-xl px-3 py-2.5 text-sm font-dm-sans outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: focused
            ? "1px solid rgba(254,44,85,0.5)"
            : "1px solid rgba(255,255,255,0.07)",
          color: "#FFFFFF",
          boxShadow: focused ? "0 0 0 3px rgba(254,44,85,0.08)" : "none",
        }}
      />
      {error && (
        <p
          className="text-[10px] mt-1 font-dm-sans"
          style={{ color: "#E6BCBD" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ─── SectionCard ──────────────────────────────────────────────────────────────

function SectionCard({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-6 sm:p-8" style={{ background: "#1C1B1B" }}>
      {/* Step badge */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center font-syne text-xs font-bold shrink-0"
          style={{
            background: "rgba(254,44,85,0.12)",
            color: "#FE2C55",
          }}
        >
          {step}
        </div>
        <div>
          <h2
            className="font-syne text-base font-semibold leading-tight"
            style={{ color: "#FFFFFF" }}
          >
            {title}
          </h2>
          <p
            className="font-dm-sans text-xs mt-0.5"
            style={{ color: "#5A5A5A" }}
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function NovaAnalisePage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [videoData, setVideoData] = useState<{
    url: string;
    name: string;
    size: number;
  } | null>(null);

  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MetricasFormData>({
    resolver: zodResolver(metricasSchema),
    defaultValues: { views: 0, likes: 0, comments: 0, shares: 0, saves: 0 },
  });

  async function onSubmit(metricas: MetricasFormData) {
    if (!videoData) {
      toast.error("Envie o vídeo antes de continuar.");
      return;
    }

    setIsStartingAnalysis(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Sessão expirada. Faça login novamente.");
        router.push("/login");
        return;
      }

      const { data: videoRecord, error: videoError } = await supabase
        .from("videos")
        .insert({
          user_id: user.id,
          storage_path: videoData.url,
          storage_bucket: "uploadthing",
          original_filename: videoData.name,
          file_size_bytes: videoData.size,
          upload_status: "completed",
          processing_status: "pending",
          is_viral_reference: true,
        })
        .select()
        .single();

      if (videoError) {
        console.error("Erro ao salvar vídeo:", videoError);
        toast.error("Erro ao salvar vídeo. Tente novamente.");
        return;
      }

      const { error: metricasError } = await supabase
        .from("video_metrics")
        .insert({
          video_id: videoRecord.id,
          views: metricas.views,
          likes: metricas.likes,
          comments: metricas.comments,
          shares: metricas.shares,
          saves: metricas.saves,
          source: "manual_input",
        });

      if (metricasError) {
        console.error("Erro ao salvar métricas:", metricasError);
        toast.error("Erro ao salvar métricas. Tente novamente.");
        return;
      }

      const { data: analysisRecord, error: analysisError } = await supabase
        .from("analyses")
        .insert({
          user_id: user.id,
          video_id: videoRecord.id,
          analysis_type: "viral_video",
          status: "pending",
          current_step: 0,
        })
        .select()
        .single();

      if (analysisError) {
        console.error("Erro ao criar análise:", analysisError);
        toast.error("Erro ao iniciar análise. Tente novamente.");
        return;
      }

      const inngestResponse = await fetch("/api/analysis/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: analysisRecord.id }),
      });

      if (!inngestResponse.ok) {
        toast.error("Erro ao iniciar análise. Tente novamente.");
        return;
      }

      toast.success("Análise iniciada! Processando seu vídeo...");
      router.push(`/analise/${analysisRecord.id}`);
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setIsStartingAnalysis(false);
    }
  }

  const metrics = [
    { key: "views", emoji: "👁", label: "Visualizações" },
    { key: "likes", emoji: "❤️", label: "Curtidas" },
    { key: "comments", emoji: "💬", label: "Comentários" },
    { key: "shares", emoji: "🔁", label: "Compartilhamentos" },
    { key: "saves", emoji: "🔖", label: "Salvamentos" },
  ] as const;

  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12"
      style={{ background: "#131313" }}
    >
      <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="mb-8 sm:mb-10">
          {/* Back */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-xs font-dm-sans mb-6 transition-colors"
            style={{ color: "#5A5A5A" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E6BCBD")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#5A5A5A")}
          >
            <ChevronLeft size={14} strokeWidth={1.5} color="currentColor" />
            Voltar
          </button>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4"
            style={{
              background: "rgba(254,44,85,0.08)",
              border: "1px solid rgba(254,44,85,0.18)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FE2C55" }}
            />
            <span
              className="text-xs font-dm-sans font-medium"
              style={{ color: "#FE2C55" }}
            >
              Nova análise
            </span>
          </div>

          <h1
            className="font-syne text-2xl sm:text-3xl font-bold mb-2 leading-tight"
            style={{ color: "#FFFFFF" }}
          >
            Qual vídeo viralizou?
          </h1>
          <p
            className="font-dm-sans text-sm sm:text-base max-w-xl"
            style={{ color: "#5A5A5A" }}
          >
            Sobe o vídeo que bombou e as métricas do TikTok. A IA vai descobrir
            por que funcionou e criar 5 roteiros novos para você.
          </p>
        </div>

        {/* ── Form ────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Seção 1 — Upload */}
          <SectionCard
            step="1"
            title="Sobe o vídeo"
            description="O mesmo vídeo que você postou no TikTok."
          >
            <VideoUploader
              onUploadComplete={(data) => setVideoData(data)}
              onUploadError={() => setVideoData(null)}
            />

            {/* Confirmação de upload */}
            {videoData && (
              <div
                className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-xl"
                style={{
                  background: "rgba(52,211,153,0.06)",
                  border: "1px solid rgba(52,211,153,0.15)",
                }}
              >
                <Check
                  size={14}
                  color="rgb(52,211,153)"
                  style={{ flexShrink: 0 }}
                />
                <span
                  className="font-dm-sans text-xs truncate"
                  style={{ color: "rgb(52,211,153)" }}
                >
                  {videoData.name}
                </span>
              </div>
            )}
          </SectionCard>

          {/* Seção 2 — Métricas */}
          <SectionCard
            step="2"
            title="Métricas do TikTok"
            description="Abre o vídeo no TikTok, clica nos três pontos e vê as métricas."
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {metrics.map(({ key, emoji, label }) => (
                <MetricInput
                  key={key}
                  emoji={emoji}
                  label={label}
                  error={errors[key]?.message}
                  inputProps={register(key, { valueAsNumber: true })}
                />
              ))}
            </div>
          </SectionCard>

          {/* ── Submit ──────────────────────────────────────────── */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!videoData || isStartingAnalysis}
              className="relative w-full rounded-xl py-4 text-sm font-bold font-dm-sans text-white transition-all"
              style={{
                background:
                  videoData && !isStartingAnalysis
                    ? "#FE2C55"
                    : "rgba(254,44,85,0.3)",
                cursor:
                  !videoData || isStartingAnalysis ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (videoData && !isStartingAnalysis)
                  e.currentTarget.style.background = "#D9203F";
              }}
              onMouseLeave={(e) => {
                if (videoData && !isStartingAnalysis)
                  e.currentTarget.style.background = "#FE2C55";
              }}
            >
              {isStartingAnalysis ? (
                <span className="flex items-center justify-center gap-2">
                  <Loading />
                  Iniciando análise...
                </span>
              ) : (
                "Analisar vídeo"
              )}
            </button>

            {!videoData && (
              <p
                className="text-center text-xs font-dm-sans mt-3"
                style={{ color: "#5A5A5A" }}
              >
                Envie o vídeo para habilitar a análise
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
