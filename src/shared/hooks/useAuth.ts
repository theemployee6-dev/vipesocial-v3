"use client";

import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const supabase = createClientSupabaseClient();
  const router = useRouter();

  async function login(data: { email: string; password: string }) {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Email ou senha incorretos." };
      }
      if (error.message.includes("Email not confirmed")) {
        return { error: "Confirme seu email antes de entrar." };
      }
      return { error: "Erro ao entrar. Tente novamente." };
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function loginComGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // redirectTo:
        //   "https://uninterpretively-objurgative-nerissa.ngrok-free.dev/auth/callback",
      },
    });

    if (error) {
      return { error: "Erro ao conectar com Google. Tente novamente." };
    }
  }

  async function cadastrar(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return { error: "Esse email já está cadastrado." };
      }
      if (error.message.includes("password")) {
        return { error: "Senha muito fraca. Use letras e números." };
      }
      return { error: "Erro ao criar conta. Tente novamente." };
    }

    // Cadastro bem sucedido — redireciona para o dashboard
    router.push("/dashboard");
    router.refresh();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return { loginComGoogle, cadastrar, login, logout };
}
