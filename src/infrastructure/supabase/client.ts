import { createBrowserClient } from "@supabase/ssr";

// Essa função cria o cliente do Supabase para uso no navegador.
// O padrão singleton garante que apenas uma instância existe
// durante toda a sessão do usuário no browser.

export function createClientSupabaseClient() {
  return createBrowserClient(
    // Essas duas variáveis têm NEXT_PUBLIC_ porque o browser
    // precisa conhecê-las para fazer as requisições ao Supabase.
    // Nunca coloque a SERVICE_ROLE_KEY aqui — ela nunca pode
    // chegar ao navegador do usuário.

    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
