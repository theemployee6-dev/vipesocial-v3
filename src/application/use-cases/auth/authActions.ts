"use server";
import { createServerSupabaseClient } from "@/infrastructure/supabase/server";
import { redirect } from "next/navigation";
import { cadastroSchema, loginSchema } from "@/shared/utils/validations";

// ============================================================
// CADASTRAR USUÁRIO
// Cria a conta no Supabase Auth e insere o perfil
// na tabela profiles via trigger automático do banco.
// ============================================================
export async function cadastrarUsuario(formData: {
  fullName: string;
  email: string;
  password: string;
}) {
  // Valida os dados no servidor também.
  // Nunca confie apenas na validação do frontend —
  // alguém pode chamar essa função diretamente via curl.

  const validacao = cadastroSchema.safeParse({
    ...formData,
    confirmPassword: formData.password,
  });

  if (!validacao.success) {
    return { error: validacao.error.message };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        // Esses dados vão para o auth.users.raw_user_meta_data
        // e o trigger que criamos nas migrations vai ler
        // esse campo para criar o registro em profiles.
        full_name: formData.fullName,
      },
    },
  });

  if (error) {
    // Traduzimos os erros do Supabase para português
    // para o usuário entender o que aconteceu.
    if (error.message.includes("already registered")) {
      return { error: "Esse email já está cadastrado." };
    }

    if (error.message.includes("password")) {
      return { error: "Senha muito fraca. Use letras e números." };
    }
    return { error: "Erro ao criar conta. Tente novamente." };
  }

  // Se o Supabase exigir confirmação de email,
  // data.user existe mas data.session é null.
  // Redirecionamos para uma página de confirmação.

  if (data.user && !data.session) {
    redirect("/confirmar-email");
  }

  // Se não exige confirmação, já redireciona para o dashboard.
  redirect("/dashboard");
}

// ============================================================
// LOGAR USUÁRIO
// Autentica com email e senha.
// ============================================================
export async function logarUsuario(formData: {
  email: string;
  password: string;
}) {
  const validacao = loginSchema.safeParse(formData);

  if (!validacao.success) {
    return { error: validacao.error.message };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    // Esse é o erro mais comum — email ou senha errados.
    // O Supabase retorna a mesma mensagem para os dois
    // por segurança — não queremos dizer qual dos dois
    // está errado para evitar enumeração de usuários.
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email ou senha incorretos." };
    }

    if (error.message.includes("Email not confirmed")) {
      return { error: "Confirme seu email antes de entrar." };
    }

    return { error: "Erro ao entrar. Tente novamente." };
  }

  redirect("/dashboard");
}

// ============================================================
// LOGAR COM GOOGLE
// Inicia o fluxo OAuth. O Supabase redireciona o usuário
// para a tela de login do Google e depois volta para
// a URL que definirmos em callback.
// ============================================================
export async function logarComGoogle() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Após o Google autenticar, redireciona para essa rota.
      // Vamos criar essa rota no próximo passo.
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: "Erro ao conectar com Google. Tente novamente." };
  }

  // O Supabase retorna a URL do Google para o usuário autorizar.
  // Redirecionamos o usuário para essa URL.
  if (data.url) {
    redirect(data.url);
  }
}
