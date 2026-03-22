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
} from "lucide-react";
import clsx from "clsx";
import LogoComponent from "@/shared/components/Logo/page";
import { getGreeting } from "@/shared/utils/time";
import { toast } from "sonner";

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

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Assinatura ativada com sucesso! Bem-vindo ao plano.");
      // Remove o parâmetro da URL sem recarregar a página
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams]);

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
                  {getGreeting()}, {firstName}
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

// //design clean
// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
// import { useAuth } from "@/shared/hooks/useAuth";
// import clsx from "clsx";

// // ─── Tipos ────────────────────────────────────────────────────────────────────

// interface Analysis {
//   id: string;
//   status: string;
//   confirmed_niche: string | null;
//   created_at: string;
// }

// interface Profile {
//   full_name: string | null;
//   avatar_url: string | null;
// }

// interface Stats {
//   total: number;
//   completed: number;
//   scripts: number;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const STATUS: Record<string, { dot: string; label: string }> = {
//   pending: { dot: "bg-zinc-600", label: "Aguardando" },
//   processing_prompt1: {
//     dot: "bg-violet-500 animate-pulse",
//     label: "Analisando",
//   },
//   awaiting_niche_confirmation: {
//     dot: "bg-amber-400",
//     label: "Confirmar nicho",
//   },
//   processing_prompt2: { dot: "bg-violet-500 animate-pulse", label: "Emoções" },
//   processing_prompt3: {
//     dot: "bg-violet-500 animate-pulse",
//     label: "Adaptando",
//   },
//   processing_prompt4: { dot: "bg-violet-500 animate-pulse", label: "Roteiros" },
//   completed: { dot: "bg-emerald-400", label: "Concluída" },
//   failed: { dot: "bg-red-500", label: "Falhou" },
// };

// function fmt(d: string) {
//   return new Date(d).toLocaleDateString("pt-BR", {
//     day: "2-digit",
//     month: "short",
//   });
// }

// function initials(name: string | null) {
//   if (!name) return "?";
//   const parts = name.trim().split(" ");
//   if (parts.length === 0) return "?";
//   const first = parts[0][0] || "";
//   const second = parts[1]?.[0] || "";
//   return (first + second).toUpperCase();
// }

// // ─── Componente principal ─────────────────────────────────────────────────────

// export default function DashboardPage() {
//   const router = useRouter();
//   const { logout } = useAuth();
//   const supabase = useMemo(() => createClientSupabaseClient(), []);

//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [analyses, setAnalyses] = useState<Analysis[]>([]);
//   const [stats, setStats] = useState<Stats>({
//     total: 0,
//     completed: 0,
//     scripts: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [nav, setNav] = useState<"dashboard" | "analyses" | "scripts">(
//     "dashboard",
//   );
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     async function load() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       const [{ data: prof }, { data: ans }, { count: sc }] = await Promise.all([
//         supabase
//           .from("profiles")
//           .select("full_name, avatar_url")
//           .eq("id", user.id)
//           .single(),
//         supabase
//           .from("analyses")
//           .select("id, status, confirmed_niche, created_at")
//           .eq("user_id", user.id)
//           .is("deleted_at", null)
//           .order("created_at", { ascending: false })
//           .limit(30),
//         supabase
//           .from("scripts")
//           .select("*", { count: "exact", head: true })
//           .eq("user_id", user.id),
//       ]);

//       if (prof) setProfile(prof);
//       if (ans) {
//         setAnalyses(ans);
//         setStats({
//           total: ans.length,
//           completed: ans.filter((a) => a.status === "completed").length,
//           scripts: sc || 0,
//         });
//       }
//       setLoading(false);
//     }
//     load();
//   }, [supabase]);

//   const firstName = profile?.full_name?.split(" ")[0] ?? "Criador";
//   const activeAnal = analyses.find(
//     (a) => !["completed", "failed"].includes(a.status),
//   );

//   // ─── Loading ──────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="h-screen bg-[#09090f] flex items-center justify-center">
//         <div className="w-5 h-5 border border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // ─── Layout ───────────────────────────────────────────────────────────────
//   return (
//     <div className="h-screen bg-[#09090f] flex overflow-hidden font-dm-sans">
//       {/* ── Sidebar (desktop) ─────────────────────────────────────────────── */}
//       <aside
//         className={clsx(
//           "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-52 shrink-0 bg-[#09090f] border-r border-white/5",
//           sidebarOpen ? "translate-x-0" : "-translate-x-full",
//         )}
//       >
//         <div className="flex flex-col h-full py-5 px-3">
//           {/* Logo */}
//           <div className="px-2 mb-8 mt-1">
//             <span className="font-syne text-[15px] font-extrabold tracking-tight text-white">
//               vipe<span className="text-violet-400">Social</span>
//             </span>
//           </div>

//           {/* Nav */}
//           <nav className="flex flex-col gap-0.5">
//             {(
//               [
//                 ["dashboard", "Dashboard"],
//                 ["analyses", "Análises"],
//                 ["scripts", "Roteiros"],
//               ] as const
//             ).map(([id, label]) => (
//               <button
//                 key={id}
//                 onClick={() => {
//                   setNav(id);
//                   setSidebarOpen(false);
//                 }}
//                 className={clsx(
//                   "text-left text-[13px] px-2.5 py-2 rounded-lg transition-colors",
//                   nav === id
//                     ? "bg-white/5 text-white font-medium"
//                     : "text-zinc-500 hover:text-zinc-300",
//                 )}
//               >
//                 {label}
//               </button>
//             ))}
//           </nav>

//           <div className="flex-1" />

//           {/* User */}
//           <div className="px-2 pb-1 flex items-center gap-2.5">
//             <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
//               {profile?.avatar_url ? (
//                 <Image
//                   src={profile.avatar_url}
//                   alt="Avatar"
//                   width={32} // defina a largura desejada
//                   height={32} // defina a altura desejada
//                   className="rounded-full object-cover"
//                 />
//               ) : (
//                 <span className="text-[9px] font-bold text-violet-400">
//                   {initials(profile?.full_name ?? null)}
//                 </span>
//               )}
//             </div>
//             <span className="text-[12px] text-zinc-400 truncate flex-1">
//               {profile?.full_name ?? "Usuário"}
//             </span>
//             <button
//               onClick={logout}
//               className="text-zinc-600 hover:text-zinc-400 transition-colors text-[11px]"
//               title="Sair"
//             >
//               ↗
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Overlay mobile para sidebar */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-black/50 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* ── Main ────────────────────────────────────────────────────────── */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* Topbar */}
//         <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/5 shrink-0">
//           <div className="flex items-center gap-6">
//             {/* Botão menu mobile */}
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden text-zinc-400 hover:text-white transition-colors"
//             >
//               <span className="text-xl">☰</span>
//             </button>
//             {/* Mobile logo */}
//             <span className="lg:hidden font-syne text-[15px] font-extrabold text-white">
//               vipe<span className="text-violet-400">Social</span>
//             </span>
//             {/* Desktop breadcrumb */}
//             <span className="hidden lg:block text-[13px] text-zinc-500">
//               {nav === "dashboard" && "Dashboard"}
//               {nav === "analyses" && "Análises"}
//               {nav === "scripts" && "Roteiros"}
//             </span>
//           </div>

//           <button
//             onClick={() => router.push("/nova-analise")}
//             className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 transition-colors text-white text-[13px] font-medium px-3.5 py-1.5 rounded-lg"
//           >
//             <span className="text-base leading-none">+</span>
//             Nova análise
//           </button>
//         </header>

//         {/* Content */}
//         <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
//           <div className="max-w-[820] mx-auto">
//             {/* Dashboard view */}
//             {nav === "dashboard" && (
//               <>
//                 {/* Greeting */}
//                 <div className="mb-10">
//                   <h1 className="font-syne text-[26px] font-bold text-white tracking-tight mb-1">
//                     Olá, {firstName}
//                   </h1>
//                   <p className="text-[13px] text-zinc-500">
//                     {stats.total === 0
//                       ? "Comece sua primeira análise para descobrir o DNA do seu vídeo viral."
//                       : `${stats.completed} de ${stats.total} análises concluídas · ${stats.scripts} roteiros gerados`}
//                   </p>
//                 </div>

//                 {/* Análise ativa */}
//                 {activeAnal && (
//                   <div
//                     onClick={() => router.push(`/analise/${activeAnal.id}`)}
//                     className="mb-8 p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 cursor-pointer hover:border-violet-500/30 hover:bg-violet-500/10 transition-all"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2.5">
//                         <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
//                         <span className="text-[12px] text-violet-400 font-medium uppercase tracking-wider">
//                           Em andamento
//                         </span>
//                       </div>
//                       <span className="text-[12px] text-zinc-600">
//                         {fmt(activeAnal.created_at)}
//                       </span>
//                     </div>
//                     <div className="mt-2 flex items-center justify-between">
//                       <p className="text-[14px] text-white font-medium">
//                         {STATUS[activeAnal.status]?.label ?? "Processando"} ·{" "}
//                         {activeAnal.confirmed_niche ?? "identificando nicho"}
//                       </p>
//                       <span className="text-[12px] text-violet-400">
//                         Acompanhar →
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Stats row */}
//                 <div className="grid grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden mb-8">
//                   {[
//                     { label: "Análises", value: stats.total },
//                     { label: "Concluídas", value: stats.completed },
//                     { label: "Roteiros", value: stats.scripts },
//                   ].map(({ label, value }) => (
//                     <div key={label} className="bg-[#09090f] px-5 py-5">
//                       <p className="font-syne text-[28px] font-bold text-white leading-none mb-1.5">
//                         {value}
//                       </p>
//                       <p className="text-[12px] text-zinc-500">{label}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Análises recentes */}
//                 <div>
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-[12px] text-zinc-500 uppercase tracking-wider font-medium">
//                       Análises recentes
//                     </span>
//                     {analyses.length > 0 && (
//                       <span className="text-[12px] text-zinc-600">
//                         {analyses.length} total
//                       </span>
//                     )}
//                   </div>

//                   {analyses.length === 0 ? (
//                     <div className="py-16 flex flex-col items-center text-center">
//                       <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center mb-4">
//                         <span className="text-zinc-600 text-lg">↑</span>
//                       </div>
//                       <p className="text-[14px] text-zinc-400 font-medium mb-1">
//                         Nenhuma análise ainda
//                       </p>
//                       <p className="text-[12px] text-zinc-600 mb-5 max-w-64">
//                         Suba um vídeo que viralizou e descubra por que ele
//                         funcionou.
//                       </p>
//                       <button
//                         onClick={() => router.push("/nova-analise")}
//                         className="text-[13px] text-violet-400 hover:text-violet-300 transition-colors"
//                       >
//                         Fazer primeira análise →
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="border border-white/5 rounded-xl overflow-hidden">
//                       {analyses.map((a, i) => {
//                         const s = STATUS[a.status] ?? STATUS.pending;
//                         const done = a.status === "completed";
//                         const active = !done && a.status !== "failed";

//                         return (
//                           <div
//                             key={a.id}
//                             className={clsx(
//                               "flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors",
//                               "hover:bg-white/5",
//                               i !== analyses.length - 1 &&
//                                 "border-b border-white/5",
//                             )}
//                             onClick={() =>
//                               done
//                                 ? router.push(`/analise/${a.id}/roteiros`)
//                                 : router.push(`/analise/${a.id}`)
//                             }
//                           >
//                             <div
//                               className={clsx(
//                                 "w-1.5 h-1.5 rounded-full shrink-0",
//                                 s.dot,
//                               )}
//                             />
//                             <span className="text-[13px] text-zinc-300 flex-1 min-w-0 truncate">
//                               {a.confirmed_niche ?? (
//                                 <span className="text-zinc-600 italic">
//                                   sem nicho
//                                 </span>
//                               )}
//                             </span>
//                             <span
//                               className={clsx(
//                                 "text-[11px] shrink-0 hidden sm:block",
//                                 done
//                                   ? "text-emerald-500"
//                                   : active
//                                     ? "text-violet-400"
//                                     : "text-zinc-600",
//                               )}
//                             >
//                               {s.label}
//                             </span>
//                             <span className="text-[11px] text-zinc-600 shrink-0 w-14 text-right">
//                               {fmt(a.created_at)}
//                             </span>
//                             <span className="text-[11px] text-zinc-700 shrink-0 ml-1">
//                               →
//                             </span>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* Analyses view (lista completa) */}
//             {nav === "analyses" && (
//               <>
//                 <div className="mb-6">
//                   <h1 className="font-syne text-[26px] font-bold text-white tracking-tight mb-1">
//                     Análises
//                   </h1>
//                   <p className="text-[13px] text-zinc-500">
//                     Todas as análises que você já realizou.
//                   </p>
//                 </div>

//                 {analyses.length === 0 ? (
//                   <div className="py-16 flex flex-col items-center text-center">
//                     <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center mb-4">
//                       <span className="text-zinc-600 text-lg">↑</span>
//                     </div>
//                     <p className="text-[14px] text-zinc-400 font-medium mb-1">
//                       Nenhuma análise ainda
//                     </p>
//                     <p className="text-[12px] text-zinc-600 mb-5 max-w-64">
//                       Suba um vídeo que viralizou e descubra por que ele
//                       funcionou.
//                     </p>
//                     <button
//                       onClick={() => router.push("/nova-analise")}
//                       className="text-[13px] text-violet-400 hover:text-violet-300 transition-colors"
//                     >
//                       Fazer primeira análise →
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="border border-white/5 rounded-xl overflow-hidden">
//                     {analyses.map((a, i) => {
//                       const s = STATUS[a.status] ?? STATUS.pending;
//                       const done = a.status === "completed";
//                       const active = !done && a.status !== "failed";

//                       return (
//                         <div
//                           key={a.id}
//                           className={clsx(
//                             "flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors",
//                             "hover:bg-white/5",
//                             i !== analyses.length - 1 &&
//                               "border-b border-white/5",
//                           )}
//                           onClick={() =>
//                             done
//                               ? router.push(`/analise/${a.id}/roteiros`)
//                               : router.push(`/analise/${a.id}`)
//                           }
//                         >
//                           <div
//                             className={clsx(
//                               "w-1.5 h-1.5 rounded-full shrink-0",
//                               s.dot,
//                             )}
//                           />
//                           <span className="text-[13px] text-zinc-300 flex-1 min-w-0 truncate">
//                             {a.confirmed_niche ?? (
//                               <span className="text-zinc-600 italic">
//                                 sem nicho
//                               </span>
//                             )}
//                           </span>
//                           <span
//                             className={clsx(
//                               "text-[11px] shrink-0 hidden sm:block",
//                               done
//                                 ? "text-emerald-500"
//                                 : active
//                                   ? "text-violet-400"
//                                   : "text-zinc-600",
//                             )}
//                           >
//                             {s.label}
//                           </span>
//                           <span className="text-[11px] text-zinc-600 shrink-0 w-14 text-right">
//                             {fmt(a.created_at)}
//                           </span>
//                           <span className="text-[11px] text-zinc-700 shrink-0 ml-1">
//                             →
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </>
//             )}

//             {/* Scripts view (placeholder) */}
//             {nav === "scripts" && (
//               <>
//                 <div className="mb-6">
//                   <h1 className="font-syne text-[26px] font-bold text-white tracking-tight mb-1">
//                     Roteiros
//                   </h1>
//                   <p className="text-[13px] text-zinc-500">
//                     Seus roteiros gerados pela IA.
//                   </p>
//                 </div>

//                 {stats.scripts === 0 ? (
//                   <div className="py-16 flex flex-col items-center text-center">
//                     <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center mb-4">
//                       <span className="text-zinc-600 text-lg">🎬</span>
//                     </div>
//                     <p className="text-[14px] text-zinc-400 font-medium mb-1">
//                       Nenhum roteiro ainda
//                     </p>
//                     <p className="text-[12px] text-zinc-600 mb-5 max-w-64">
//                       As análises concluídas geram roteiros automaticamente.
//                     </p>
//                     <button
//                       onClick={() => router.push("/nova-analise")}
//                       className="text-[13px] text-violet-400 hover:text-violet-300 transition-colors"
//                     >
//                       Fazer primeira análise →
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="border border-white/5 rounded-xl p-6 text-center">
//                     <p className="text-[14px] text-zinc-400">
//                       Lista de roteiros aparecerá aqui.
//                     </p>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
