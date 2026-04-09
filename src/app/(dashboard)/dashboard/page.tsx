"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import {
  Plus,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Loader2,
  Sparkles,
  FileText,
} from "lucide-react";
import clsx from "clsx";
import { getGreeting } from "@/shared/utils/time";
import { toast } from "sonner";
import { Analysis, Stats } from "./_utils/types/dashboardTypes";
import { STATUS_MAP } from "./_utils/helpers/dashboard_StatusMap";
import { formatDate } from "./_utils/helpers/formatters/formatDate";

// ─── Design Tokens — Cinematic Intelligence ───────────────────────────────────
// bg:           #131313
// sidebar:      #0E0E0E
// card-1:       #1C1B1B   card-2: #201F1F
// accent:       #FE2C55
// accent-dim:   rgba(254,44,85,0.08)
// text-primary: #FFFFFF   text-secondary: #E6BCBD
// text-muted:   #5A5A5A   border: rgba(255,255,255,0.06)
// font-title:   Syne      font-body: DM Sans
// ─────────────────────────────────────────────────────────────────────────────

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: "#1C1B1B" }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: "rgba(254,44,85,0.08)",
          color: "#FE2C55",
        }}
      >
        {icon}
      </div>
      <div>
        <p
          className="font-syne text-2xl font-bold"
          style={{ color: "#FFFFFF" }}
        >
          {value}
        </p>
        <p className="font-dm-sans text-xs mt-0.5" style={{ color: "#5A5A5A" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── AnalysisRow ──────────────────────────────────────────────────────────────

function AnalysisRow({
  analysis,
  onView,
  onContinue,
}: {
  analysis: Analysis;
  onView: () => void;
  onContinue: () => void;
}) {
  const status = STATUS_MAP[analysis.status] || STATUS_MAP.pending;
  const isCompleted = analysis.status === "completed";
  const isProcessing =
    !isCompleted &&
    analysis.status !== "failed" &&
    analysis.status !== "pending";
  const awaitingNiche = analysis.status === "awaiting_niche_confirmation";

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Assinatura ativada com sucesso! Bem-vindo ao plano.");
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams]);

  return (
    <div
      className="group flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl transition-all"
      style={{
        background: "#1C1B1B",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#201F1F")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#1C1B1B")}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Status icon */}
        <div
          className={clsx(
            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
            isCompleted && "text-[#FE2C55]",
            isProcessing && "text-[#FE2C55]",
            awaitingNiche && "text-amber-400",
            analysis.status === "failed" && "text-[#E6BCBD]",
            analysis.status === "pending" && "text-[#5A5A5A]",
          )}
          style={{
            background: isCompleted
              ? "rgba(254,44,85,0.08)"
              : isProcessing || awaitingNiche
                ? "rgba(254,44,85,0.08)"
                : "rgba(255,255,255,0.04)",
          }}
        >
          {status.icon}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p
            className="font-dm-sans text-sm truncate"
            style={{ color: "#FFFFFF" }}
          >
            {analysis.confirmed_niche || "Análise sem nicho"}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={clsx(
                "text-[10px] font-dm-sans flex items-center gap-1",
                status.color,
              )}
            >
              {status.label}
            </span>
            <span style={{ color: "#2E2E2E" }} className="text-[10px]">
              ·
            </span>
            <span
              className="text-[10px] font-dm-sans"
              style={{ color: "#5A5A5A" }}
            >
              {formatDate(analysis.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Right — action */}
      <div className="shrink-0">
        {isCompleted && (
          <button
            onClick={onView}
            className="flex items-center gap-1 text-xs font-dm-sans transition-colors"
            style={{ color: "#E6BCBD" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FE2C55")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#E6BCBD")}
          >
            Ver roteiros
            <ChevronRight size={12} />
          </button>
        )}
        {(isProcessing || awaitingNiche) && (
          <button
            onClick={onContinue}
            className="flex items-center gap-1 text-xs font-dm-sans transition-colors"
            style={{ color: "#5A5A5A" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E6BCBD")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#5A5A5A")}
          >
            Acompanhar
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClientSupabaseClient(), []);
  const searchParams = useSearchParams();

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    scripts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("Criador");

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Assinatura ativada com sucesso! Bem-vindo ao plano.");
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Busca nome do usuário
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (prof?.full_name) {
        setFirstName(prof.full_name.split(" ")[0]);
      }

      // Busca análises
      const { data: analysesData } = await supabase
        .from("analyses")
        .select(
          "id, status, confirmed_niche, created_at, processing_completed_at",
        )
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(20);

      // Busca contagem de roteiros
      const { count: scriptsCount } = await supabase
        .from("scripts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (analysesData) {
        setAnalyses(analysesData);
        setStats({
          total: analysesData.length,
          completed: analysesData.filter((a) => a.status === "completed")
            .length,
          scripts: scriptsCount || 0,
        });
      }

      setLoading(false);
    }

    loadData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "#FE2C55" }}
        />
      </div>
    );
  }

  const activeAnalysis = analyses.find(
    (a) => a.status !== "completed" && a.status !== "failed",
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1
            className="font-syne text-2xl font-bold mb-1"
            style={{ color: "#FFFFFF" }}
          >
            {getGreeting()}, {firstName}
          </h1>
          <p className="font-dm-sans text-sm" style={{ color: "#5A5A5A" }}>
            Aqui está um resumo da sua atividade.
          </p>
        </div>

        <button
          onClick={() => router.push("/nova-analise")}
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold font-dm-sans transition-all shrink-0"
          style={{ background: "#FE2C55" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#D9203F")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FE2C55")}
        >
          <Plus size={16} />
          Nova análise
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard
          icon={<TrendingUp size={16} />}
          label="Análises feitas"
          value={stats.total}
        />
        <StatCard
          icon={<CheckCircle2 size={16} />}
          label="Concluídas"
          value={stats.completed}
        />
        <StatCard
          icon={<FileText size={16} />}
          label="Roteiros gerados"
          value={stats.scripts}
        />
      </div>

      {/* ── Análise ativa ─────────────────────────────────────── */}
      {activeAnalysis && (
        <div
          className="rounded-2xl p-5 mb-8 cursor-pointer transition-all"
          style={{
            background: "rgba(254,44,85,0.05)",
            border: "1px solid rgba(254,44,85,0.18)",
          }}
          onClick={() => router.push(`/analise/${activeAnalysis.id}`)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "rgba(254,44,85,0.35)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "rgba(254,44,85,0.18)")
          }
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#FE2C55" }}
              />
              <span
                className="font-dm-sans text-xs font-medium"
                style={{ color: "#FE2C55" }}
              >
                Análise em andamento
              </span>
            </div>
            <ChevronRight size={14} style={{ color: "#FE2C55" }} />
          </div>
          <p
            className="font-syne text-sm font-semibold mb-1"
            style={{ color: "#FFFFFF" }}
          >
            {STATUS_MAP[activeAnalysis.status]?.label || "Processando"}
          </p>
          <p className="font-dm-sans text-xs" style={{ color: "#5A5A5A" }}>
            Iniciada em {formatDate(activeAnalysis.created_at)} · clique para
            acompanhar
          </p>
        </div>
      )}

      {/* ── Histórico ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-syne text-sm font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            Análises recentes
          </h2>
          {analyses.length > 0 && (
            <span className="font-dm-sans text-xs" style={{ color: "#5A5A5A" }}>
              {analyses.length} total
            </span>
          )}
        </div>

        {analyses.length === 0 ? (
          /* Empty state */
          <div
            className="rounded-2xl p-12 flex flex-col items-center text-center"
            style={{
              border: "1px dashed rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(254,44,85,0.08)",
                color: "#FE2C55",
              }}
            >
              <Sparkles size={20} />
            </div>
            <p
              className="font-syne text-sm font-semibold mb-1"
              style={{ color: "#FFFFFF" }}
            >
              Nenhuma análise ainda
            </p>
            <p
              className="font-dm-sans text-xs mb-5 max-w-xs"
              style={{ color: "#5A5A5A" }}
            >
              Sobe um vídeo que viralizou e descubra o DNA emocional que fez ele
              bombar.
            </p>
            <button
              onClick={() => router.push("/nova-analise")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold font-dm-sans transition-all"
              style={{ background: "#FE2C55" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#D9203F")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#FE2C55")
              }
            >
              <Plus size={14} />
              Fazer primeira análise
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {analyses.map((analysis) => (
              <AnalysisRow
                key={analysis.id}
                analysis={analysis}
                onView={() => router.push(`/analise/${analysis.id}/roteiros`)}
                onContinue={() => router.push(`/analise/${analysis.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
