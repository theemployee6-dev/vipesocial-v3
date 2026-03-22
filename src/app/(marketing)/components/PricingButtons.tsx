"use client";

import { useStripe } from "@/shared/hooks/useStripe";

export function StarterButton() {
  const { startCheckout, loading } = useStripe();

  return (
    <button
      onClick={() => startCheckout("starter")}
      disabled={loading}
      className="w-full text-center py-3 rounded-xl border border-white/0.1 text-sm font-medium font-dm-sans text-zinc-300 hover:border-white/0.2 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Aguarde..." : "Começar grátis"}
    </button>
  );
}

export function ProButton() {
  const { startCheckout, loading } = useStripe();

  return (
    <button
      onClick={() => startCheckout("pro")}
      disabled={loading}
      className="w-full text-center py-3 rounded-xl text-sm font-bold font-dm-sans text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: "linear-gradient(135deg, #7c5cfc 0%, #5a3de0 100%)",
        boxShadow: "0 0 24px rgba(124,92,252,0.3)",
      }}
    >
      {loading ? "Aguarde..." : "Assinar plano anual →"}
    </button>
  );
}
