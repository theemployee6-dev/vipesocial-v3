import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=Código de autenticação ausente`,
    );
  }

  try {
    // Criamos a resposta primeiro para poder
    // escrever cookies nela depois.
    const response = NextResponse.redirect(`${origin}${next}`);

    // Esse cliente usa o padrão request/response
    // igual ao middleware — consegue ler E escrever cookies.
    // É diferente do createServerSupabaseClient que usa
    // next/headers e é somente leitura.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Escrevemos os cookies na resposta.
            // Isso salva a sessão do usuário no navegador
            // após o Google autenticar com sucesso.
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Erro ao trocar código por sessão:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=Erro ao autenticar com Google`,
      );
    }

    // Retorna a resposta com os cookies da sessão gravados.
    return response;
  } catch (error) {
    console.error("Erro inesperado no callback:", error);
    return NextResponse.redirect(`${origin}/login?error=Erro inesperado`);
  }
}
