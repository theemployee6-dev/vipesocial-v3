"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  User,
  LogOut,
  Plus,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Menu,
  Star,
} from "lucide-react";
import clsx from "clsx";
import LogoComponent from "@/shared/components/LogoComponent/LogoComponent";
import { getGreeting } from "@/shared/utils/time";
import { toast } from "sonner";

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

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Analysis {
  id: string;
  status: string;
  confirmed_niche: string | null;
  created_at: string;
  processing_completed_at: string | null;
}

interface Profile {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface Stats {
  total: number;
  completed: number;
  scripts: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Aguardando",
    color: "text-[#5A5A5A]",
    icon: <Clock size={12} />,
  },
  processing_prompt1: {
    label: "Analisando vídeo",
    color: "text-[#FE2C55]",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  awaiting_niche_confirmation: {
    label: "Confirmar nicho",
    color: "text-amber-400",
    icon: <AlertCircle size={12} />,
  },
  processing_prompt2: {
    label: "Destilando emoções",
    color: "text-[#FE2C55]",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  processing_prompt3: {
    label: "Adaptando perfil",
    color: "text-[#FE2C55]",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  processing_prompt4: {
    label: "Gerando roteiros",
    color: "text-[#FE2C55]",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  completed: {
    label: "Concluída",
    color: "text-emerald-400",
    icon: <CheckCircle2 size={12} />,
  },
  failed: {
    label: "Falhou",
    color: "text-[#E6BCBD]",
    icon: <AlertCircle size={12} />,
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

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
        <p
          className="font-dm-sans text-xs mt-0.5"
          style={{ color: "#5A5A5A" }}
        >
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
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "#201F1F")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "#1C1B1B")
      }
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Status icon */}
        <div
          className={clsx(
            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
            isCompleted && "text-emerald-400",
            isProcessing && "text-[#FE2C55]",
            awaitingNiche && "text-amber-400",
            analysis.status === "failed" && "text-[#E6BCBD]",
            analysis.status === "pending" && "text-[#5A5A5A]",
          )}
          style={{
            background: isCompleted
              ? "rgba(52,211,153,0.08)"
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#FE2C55")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#E6BCBD")
            }
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#E6BCBD")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#5A5A5A")
            }
          >
            Acompanhar
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-2.5 text-sm font-dm-sans transition-all text-left"
      style={{
        paddingLeft: active ? "16px" : "18px",
        paddingRight: "12px",
        borderRadius: "8px",
        fontWeight: active ? 600 : 400,
        color: active ? "#FFFFFF" : "#5A5A5A",
        background: active ? "rgba(254,44,85,0.07)" : "transparent",
        borderLeft: active ? "2px solid #FE2C55" : "2px solid transparent",
        cursor: "pointer",
      }}
    >
      <span style={{ color: active ? "#FE2C55" : "#5A5A5A", flexShrink: 0 }}>
        {icon}
      </span>
      {label}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  mobile?: boolean;
  profile: Profile | null;
  onLogout: () => void;
}

function Sidebar({ mobile = false, profile, onLogout }: SidebarProps) {
  return (
    <aside
      className={clsx(
        "flex flex-col h-full",
        mobile ? "w-64 px-3 py-6" : "w-56 px-3 py-6 hidden lg:flex",
      )}
      style={{
        background: "#0E0E0E",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="w-[66%] px-2 mb-8">
        <LogoComponent />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        <NavItem
          icon={<LayoutDashboard size={16} />}
          label="Dashboard"
          active
        />
        <NavItem
          icon={<BarChart2 size={16} />}
          label="Análises"
          onClick={() => {}}
        />
        <NavItem
          icon={<FileText size={16} />}
          label="Roteiros"
          onClick={() => {}}
        />
        <NavItem
          icon={<Star size={16} />}
          label="Planos"
          onClick={() => {}}
        />
        <NavItem
          icon={<User size={16} />}
          label="Perfil"
          onClick={() => {}}
        />
      </nav>

      {/* User */}
      <div
        className="mt-auto pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
            style={{
              background: "rgba(254,44,85,0.12)",
              border: "1px solid rgba(254,44,85,0.18)",
            }}
          >
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={28}
                height={28}
                className="rounded-lg object-cover"
              />
            ) : (
              <span
                className="text-[10px] font-bold font-syne"
                style={{ color: "#FE2C55" }}
              >
                {getInitials(profile?.full_name || null)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-dm-sans text-xs truncate"
              style={{ color: "#E6BCBD" }}
            >
              {profile?.full_name || "Usuário"}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="transition-colors"
            style={{ color: "#5A5A5A" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#E6BCBD")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#5A5A5A")
            }
            title="Sair"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const supabase = useMemo(() => createClientSupabaseClient(), []);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    scripts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: prof }, { data: analysesData }, { count: scriptsCount }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, username, avatar_url")
            .eq("id", user.id)
            .single(),
          supabase
            .from("analyses")
            .select(
              "id, status, confirmed_niche, created_at, processing_completed_at",
            )
            .eq("user_id", user.id)
            .is("deleted_at", null)
            .order("created_at", { ascending: false })
            .limit(20),
          supabase
            .from("scripts")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
        ]);

      if (prof) setProfile(prof);
      if (analysesData) {
        setAnalyses(analysesData);
        setStats({
          total: analysesData.length,
          completed: analysesData.filter((a) => a.status === "completed").length,
          scripts: scriptsCount || 0,
        });
      }

      setLoading(false);
    }

    load();
  }, [supabase]);

  const firstName = profile?.full_name?.split(" ")[0] || "Criador";
  const activeAnalysis = analyses.find(
    (a) => a.status !== "completed" && a.status !== "failed",
  );

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#131313" }}
      >
        <Loader2 size={28} className="animate-spin" style={{ color: "#FE2C55" }} />
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#131313" }}
    >
      {/* Sidebar desktop */}
      <Sidebar profile={profile} onLogout={logout} />

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar mobile profile={profile} onLogout={logout} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar mobile */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ color: "#5A5A5A" }}
          >
            <Menu size={20} />
          </button>

          <span className="w-[25%] sm:w-[12%]">
            <LogoComponent />
          </span>

          <button
            onClick={() => router.push("/nova-analise")}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
            style={{ background: "#FE2C55" }}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

            {/* ── Header ────────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <h1
                  className="font-syne text-2xl font-bold mb-1"
                  style={{ color: "#FFFFFF" }}
                >
                  {getGreeting()}, {firstName}
                </h1>
                <p
                  className="font-dm-sans text-sm"
                  style={{ color: "#5A5A5A" }}
                >
                  Aqui está um resumo da sua atividade.
                </p>
              </div>

              {/* CTA desktop */}
              <button
                onClick={() => router.push("/nova-analise")}
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold font-dm-sans transition-all shrink-0"
                style={{ background: "#FE2C55" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#D9203F")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#FE2C55")
                }
              >
                <Plus size={16} />
                Nova análise
              </button>
            </div>

            {/* ── Stats ─────────────────────────────────────────────── */}
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
                <p
                  className="font-dm-sans text-xs"
                  style={{ color: "#5A5A5A" }}
                >
                  Iniciada em {formatDate(activeAnalysis.created_at)} · clique
                  para acompanhar
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
                  <span
                    className="font-dm-sans text-xs"
                    style={{ color: "#5A5A5A" }}
                  >
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
                    Sobe um vídeo que viralizou e descubra o DNA emocional que
                    fez ele bombar.
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
                      onView={() =>
                        router.push(`/analise/${analysis.id}/roteiros`)
                      }
                      onContinue={() =>
                        router.push(`/analise/${analysis.id}`)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
