"use client";

import { useStripe } from "@/shared/hooks/useStripe";

export function StarterButton() {
  const { startCheckout, loading } = useStripe();

  return (
    <button
      onClick={() => startCheckout("starter")}
      disabled={loading}
      className="w-full text-center py-3 rounded-xl text-sm font-medium font-dm-sans text-white bg-[#201F1F] hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      className="w-full text-center py-3 rounded-xl text-sm font-bold font-dm-sans text-white bg-[#FE2C55] hover:bg-[#e03c4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Aguarde..." : "Assinar plano anual →"}
    </button>
  );
}
