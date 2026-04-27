"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import { FileText, ChevronRight, Sparkles } from "lucide-react";
import Loading from "@/shared/components/Loading/Loading";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ScriptSummary {
  id: string;
  script_number: number;
  title: string;
  activated_emotion: string;
  central_concept: string;
}

interface AnalysisGroup {
  id: string;
  confirmed_niche: string | null;
  created_at: string;
  scripts: ScriptSummary[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── ScriptCard ───────────────────────────────────────────────────────────────

function ScriptCard({
  script,
  analysisId,
}: {
  script: ScriptSummary;
  analysisId: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push(
          `/analise/${analysisId}/roteiros?script=${script.script_number}`,
        )
      }
      className="w-full text-left rounded-xl px-4 py-3 transition-all"
      style={{ background: "#201F1F" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#262525")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#201F1F")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Número */}
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-syne text-xs font-bold"
            style={{
              background: "rgba(254,44,85,0.10)",
              color: "#FE2C55",
            }}
          >
            {script.script_number}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <p
              className="font-syne text-sm font-semibold truncate"
              style={{ color: "#FFFFFF" }}
            >
              {script.title}
            </p>
            <p
              className="font-dm-sans text-[11px] truncate mt-0.5"
              style={{ color: "#5A5A5A" }}
            >
              {script.central_concept}
            </p>
          </div>
        </div>

        {/* Emoção + seta */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="font-dm-sans text-[10px] px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(254,44,85,0.08)",
              color: "#FE2C55",
            }}
          >
            {script.activated_emotion}
          </span>
          <ChevronRight size={12} style={{ color: "#5A5A5A" }} />
        </div>
      </div>
    </button>
  );
}

// ─── AnalysisGroup ────────────────────────────────────────────────────────────

function AnalysisGroupCard({
  group,
  defaultOpen,
}: {
  group: AnalysisGroup;
  defaultOpen: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#1C1B1B" }}
    >
      {/* Header do grupo */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 transition-all"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(254,44,85,0.08)",
              color: "#FE2C55",
            }}
          >
            <FileText size={15} />
          </div>
          <div className="text-left min-w-0">
            <p
              className="font-syne text-sm font-semibold truncate"
              style={{ color: "#FFFFFF" }}
            >
              {group.confirmed_niche || "Análise sem nicho"}
            </p>
            <p
              className="font-dm-sans text-[11px] mt-0.5"
              style={{ color: "#5A5A5A" }}
            >
              {formatDate(group.created_at)} · {group.scripts.length} roteiros
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/analise/${group.id}/roteiros`);
            }}
            className="font-dm-sans text-xs transition-colors"
            style={{ color: "#E6BCBD" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FE2C55")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#E6BCBD")}
          >
            Ver todos
          </button>
          <ChevronRight
            size={14}
            style={{
              color: "#5A5A5A",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </div>
      </button>

      {/* Lista de roteiros */}
      {open && (
        <div
          className="px-4 pb-4 flex flex-col gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="pt-3 flex flex-col gap-2">
            {group.scripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                analysisId={group.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function RoteirosPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClientSupabaseClient(), []);

  const [groups, setGroups] = useState<AnalysisGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Busca análises concluídas com scripts
      const { data: analyses } = await supabase
        .from("analyses")
        .select("id, confirmed_niche, created_at")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (!analyses || analyses.length === 0) {
        setLoading(false);
        return;
      }

      const analysisIds = analyses.map((a) => a.id);

      const { data: scripts } = await supabase
        .from("scripts")
        .select(
          "id, script_number, title, activated_emotion, central_concept, analysis_id",
        )
        .in("analysis_id", analysisIds)
        .order("script_number", { ascending: true });

      // Agrupa scripts por análise
      const grouped: AnalysisGroup[] = analyses.map((analysis) => ({
        ...analysis,
        scripts: (scripts || []).filter((s) => s.analysis_id === analysis.id),
      }));

      // Remove análises sem roteiros
      setGroups(grouped.filter((g) => g.scripts.length > 0));
      setLoading(false);
    }

    load();
  }, [supabase]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen" style={{ background: "#131313" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1
            className="font-syne text-2xl font-bold mb-1"
            style={{ color: "#FFFFFF" }}
          >
            Roteiros
          </h1>
          <p className="font-dm-sans text-sm" style={{ color: "#5A5A5A" }}>
            Todos os roteiros gerados, organizados por análise.
          </p>
        </div>

        {/* ── Conteúdo ────────────────────────────────────────────── */}
        {groups.length === 0 ? (
          /* Empty state */
          <div
            className="rounded-2xl p-12 flex flex-col items-center text-center"
            style={{ border: "1px dashed rgba(255,255,255,0.08)" }}
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
              Nenhum roteiro ainda
            </p>
            <p
              className="font-dm-sans text-xs mb-5 max-w-xs"
              style={{ color: "#5A5A5A" }}
            >
              Faça sua primeira análise para gerar roteiros personalizados.
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
              Fazer primeira análise
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Contador */}
            <div className="flex items-center justify-between mb-2">
              <span
                className="font-dm-sans text-xs"
                style={{ color: "#5A5A5A" }}
              >
                {groups.length} {groups.length === 1 ? "análise" : "análises"} ·{" "}
                {groups.reduce((acc, g) => acc + g.scripts.length, 0)} roteiros
              </span>
            </div>

            {groups.map((group, index) => (
              <AnalysisGroupCard
                key={group.id}
                group={group}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
