"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import { toast } from "sonner";

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  async function startCheckout(plan: "starter" | "pro") {
    setLoading(true);

    try {
      // Verifica se está logado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Não logado — manda para cadastro
        router.push("/cadastro");
        return;
      }

      // Logado — inicia checkout
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao iniciar pagamento");
        return;
      }

      // Redireciona para o checkout do Stripe
      window.location.href = data.url;
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function openPortal() {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao abrir portal");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return { startCheckout, openPortal, loading };
}
