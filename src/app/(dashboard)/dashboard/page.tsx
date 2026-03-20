"use client";

import { useEffect, useState, useMemo } from "react";
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
} from "lucide-react";
import clsx from "clsx";
import LogoComponent from "@/shared/components/Logo/page";

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Aguardando",
    color: "text-[#4a4a6a]",
    icon: <Clock size={12} />,
  },
  processing_prompt1: {
    label: "Analisando vídeo",
    color: "text-[#7c5cfc]",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  awaiting_niche_confirmation: {
    label: "Confirmar nicho",
    color: "text-amber-400",
    icon: <AlertCircle size={12} />,
  },
  processing_prompt2: {
    label: "Destilando emoções",
    color: "text-[#7c5cfc]",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  processing_prompt3: {
    label: "Adaptando perfil",
    color: "text-[#7c5cfc]",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  processing_prompt4: {
    label: "Gerando roteiros",
    color: "text-[#7c5cfc]",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  completed: {
    label: "Concluída",
    color: "text-emerald-400",
    icon: <CheckCircle2 size={12} />,
  },
  failed: {
    label: "Falhou",
    color: "text-red-400",
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

// ─── Sub-componentes ──────────────────────────────────────────────────────────

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
      className={clsx(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-dm-sans transition-all",
        active
          ? "bg-[rgba(124,92,252,0.12)] text-[#a78bfa] font-medium"
          : "text-[#3a3a55] hover:text-[#8888aa] hover:bg-white/3",
      )}
    >
      <span
        className={clsx(
          "shrink-0",
          active ? "text-[#7c5cfc]" : "text-[#3a3a55]",
        )}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0c0c16] p-5 flex flex-col gap-3">
      <div className="w-9 h-9 rounded-xl bg-[rgba(124,92,252,0.08)] border border-[rgba(124,92,252,0.12)] flex items-center justify-center text-[#7c5cfc]">
        {icon}
      </div>
      <div>
        <p className="font-syne text-2xl font-bold text-[#e8e8f8]">{value}</p>
        <p className="font-dm-sans text-xs text-[#3a3a55] mt-0.5">{label}</p>
        {sub && (
          <p className="font-dm-sans text-[10px] text-[#252535] mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}

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

  return (
    <div className="group flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border border-white/5 bg-[#0c0c16] hover:border-white/8 hover:bg-[#0e0e1a] transition-all">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Status dot */}
        <div
          className={clsx(
            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
            isCompleted && "bg-emerald-500/10 text-emerald-400",
            isProcessing && "bg-[rgba(124,92,252,0.08)] text-[#7c5cfc]",
            awaitingNiche && "bg-amber-500/10 text-amber-400",
            analysis.status === "failed" && "bg-red-500/10 text-red-400",
            analysis.status === "pending" && "bg-white/4 text-[#3a3a55]",
          )}
        >
          {status.icon}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="font-dm-sans text-sm text-[#c8c8e8] truncate">
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
            <span className="text-[#252535] text-[10px]">·</span>
            <span className="text-[10px] text-[#252535] font-dm-sans">
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
            className="flex items-center gap-1 text-xs font-dm-sans text-[#7c5cfc] hover:text-[#a78bfa] transition-colors"
          >
            Ver roteiros
            <ChevronRight size={12} />
          </button>
        )}
        {(isProcessing || awaitingNiche) && (
          <button
            onClick={onContinue}
            className="flex items-center gap-1 text-xs font-dm-sans text-[#4a4a6a] hover:text-[#8888aa] transition-colors"
          >
            Acompanhar
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar (movido para fora do componente principal) ──────────────────────

interface SidebarProps {
  mobile?: boolean;
  profile: Profile | null;
  onLogout: () => void;
}

function Sidebar({ mobile = false, profile, onLogout }: SidebarProps) {
  return (
    <aside
      className={clsx(
        "flex flex-col h-full bg-[#080810] border-r border-white/5",
        mobile ? "w-64 px-3 py-6" : "w-56 px-3 py-6 hidden lg:flex",
      )}
    >
      {/* Logo */}
      <div className="w-[66%] px-2 mb-8">
        {/* <span className="font-syne text-base font-extrabold text-[#e8e8f8]">
          vipe<span className="text-[#7c5cfc]">Social</span>
        </span> */}
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
        <NavItem icon={<User size={16} />} label="Perfil" onClick={() => {}} />
      </nav>

      {/* User */}
      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-7 h-7 rounded-lg bg-[rgba(124,92,252,0.15)] border border-[rgba(124,92,252,0.2)] flex items-center justify-center shrink-0">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={28}
                height={28}
                className="rounded-lg object-cover"
              />
            ) : (
              <span className="text-[10px] font-bold text-[#7c5cfc] font-syne">
                {getInitials(profile?.full_name || null)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-dm-sans text-xs text-[#c8c8e8] truncate">
              {profile?.full_name || "Usuário"}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="text-[#3a3a55] hover:text-[#6a6a80] transition-colors"
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

      const [{ data: prof }, { data: analyses }, { count: scriptsCount }] =
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
      if (analyses) {
        setAnalyses(analyses);
        setStats({
          total: analyses.length,
          completed: analyses.filter((a) => a.status === "completed").length,
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
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#7c5cfc]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#080810] overflow-hidden">
      {/* Sidebar desktop */}
      <Sidebar profile={profile} onLogout={logout} />

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
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
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#5a5a78] hover:text-[#8888aa]"
          >
            <Menu size={20} />
          </button>
          <span className="w-[25%] sm:w-[12%] md:w-[15%] lg:w-[15%] xl:w-[10%] font-syne text-sm font-extrabold text-[#e8e8f8]">
            {/* vipe<span className="text-[#7c5cfc]">Social</span> */}
            <LogoComponent />
          </span>
          <button
            onClick={() => router.push("/nova-analise")}
            className="w-8 h-8 rounded-xl bg-[#7c5cfc] flex items-center justify-center text-white"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <h1 className="font-syne text-2xl font-bold text-[#e8e8f8] mb-1">
                  Bom dia, {firstName}
                </h1>
                <p className="font-dm-sans text-sm text-[#3a3a55]">
                  Aqui está um resumo da sua atividade.
                </p>
              </div>

              {/* CTA desktop */}
              <button
                onClick={() => router.push("/nova-analise")}
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7c5cfc] hover:bg-[#6a4de0] text-white text-sm font-bold font-dm-sans transition-colors shrink-0"
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

            {/* Análise ativa */}
            {activeAnalysis && (
              <div
                className="rounded-2xl border border-[rgba(124,92,252,0.2)] bg-[rgba(124,92,252,0.04)] p-5 mb-8 cursor-pointer hover:border-[rgba(124,92,252,0.35)] transition-colors"
                onClick={() => router.push(`/analise/${activeAnalysis.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-pulse" />
                    <span className="font-dm-sans text-xs text-[#7c5cfc] font-medium">
                      Análise em andamento
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-[#7c5cfc]" />
                </div>
                <p className="font-syne text-sm font-semibold text-[#e8e8f8] mb-1">
                  {STATUS_MAP[activeAnalysis.status]?.label || "Processando"}
                </p>
                <p className="font-dm-sans text-xs text-[#3a3a55]">
                  Iniciada em {formatDate(activeAnalysis.created_at)} · clique
                  para acompanhar
                </p>
              </div>
            )}

            {/* Histórico */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-syne text-sm font-semibold text-[#e8e8f8]">
                  Análises recentes
                </h2>
                {analyses.length > 0 && (
                  <span className="font-dm-sans text-xs text-[#3a3a55]">
                    {analyses.length} total
                  </span>
                )}
              </div>

              {analyses.length === 0 ? (
                /* Empty state */
                <div className="rounded-2xl border border-dashed border-white/8 p-12 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[rgba(124,92,252,0.08)] border border-[rgba(124,92,252,0.12)] flex items-center justify-center text-[#7c5cfc] mb-4">
                    <Sparkles size={20} />
                  </div>
                  <p className="font-syne text-sm font-semibold text-[#e8e8f8] mb-1">
                    Nenhuma análise ainda
                  </p>
                  <p className="font-dm-sans text-xs text-[#3a3a55] mb-5 max-w-xs">
                    Sobe um vídeo que viralizou e descubra o DNA emocional que
                    fez ele bombar.
                  </p>
                  <button
                    onClick={() => router.push("/nova-analise")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7c5cfc] text-white text-xs font-bold font-dm-sans hover:bg-[#6a4de0] transition-colors"
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
                      onContinue={() => router.push(`/analise/${analysis.id}`)}
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
