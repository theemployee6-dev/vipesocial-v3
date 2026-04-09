// app/dashboard/layout.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import { useAuth } from "@/shared/hooks/useAuth";
import { SidebarComponent } from "./_components/Sidebar/Sidebar";
import { Profile } from "./utils/types/dashboardTypes";
import { Loader2 } from "lucide-react";
import LogoComponent from "@/shared/components/LogoComponent/LogoComponent";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const supabase = useMemo(() => createClientSupabaseClient(), []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url")
        .eq("id", user.id)
        .single();

      setProfile(prof);
      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#131313" }}
      >
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "#FE2C55" }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#131313" }}
    >
      {/* Sidebar desktop (sempre visível em lg) */}
      <div className="hidden lg:block">
        <SidebarComponent profile={profile} onLogout={logout} />
      </div>

      {/* Sidebar mobile (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay escuro */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar com prop mobile */}
          <div className="absolute left-0 top-0 h-full">
            <SidebarComponent mobile profile={profile} onLogout={logout} />
          </div>
        </div>
      )}

      {/* Área principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar mobile com botão hambúrguer e logo */}
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

          <div className="w-[25%] sm:w-[12%]">
            <LogoComponent />
          </div>

          {/* Placeholder para equilibrar o layout (opcional) */}
          <div className="w-5" />
        </div>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
