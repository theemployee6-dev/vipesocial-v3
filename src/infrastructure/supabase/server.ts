import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Essa função é async porque o cookies() do Next.js 15
// é uma Promise — você precisa aguardar antes de usar.
// Sempre que precisar do Supabase em Server Components
// ou Route Handlers, use essa função.

export async function createServerSupabaseClient() {
  // cookieStore é o acesso aos cookies da requisição atual.
  // Ele é somente leitura aqui — Server Components não podem
  // modificar cookies, apenas lê-los.

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // getAll lê todos os cookies da requisição atual.
        // O Supabase usa isso para encontrar o token de sessão
        // do usuário e validar se ele está autenticado.
        getAll() {
          return cookieStore.getAll();
        },
        // setAll existe aqui mas não faz nada no Server Component.
        // Server Components não podem escrever cookies.
        // A renovação do token acontece no middleware — não aqui.
        // Esse console.warn vai te alertar se algo tentar
        // escrever cookies onde não deveria.
        setAll() {
          console.warn(
            "Tentativa de escrever cookies em Server Component. " +
              "Use o middleware para renovação de sessão.",
          );
        },
      },
    },
  );
}

// Cliente administrativo que bypassa o RLS.
// Usa a SERVICE_ROLE_KEY que tem permissão total no banco.
// Usar APENAS em contextos server-side confiáveis
// como workflows do Inngest, nunca no frontend.
export function createServiceSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
