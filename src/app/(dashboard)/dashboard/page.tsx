"use client";

import { useAuth } from "@/shared/hooks/useAuth";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center gap-4">
      <h1 className="text-white font-syne text-2xl">
        Bem-vindo à vipeSocial 🚀
      </h1>
      <button
        onClick={logout}
        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[#5a5a78] font-dm-sans hover:opacity-80 transition-opacity"
      >
        Sair da conta
      </button>
    </div>
  );
}
