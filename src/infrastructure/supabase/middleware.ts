import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Essa função recebe a requisição que chegou no servidor
// e retorna uma resposta com a sessão atualizada se necessário.
// É chamada pelo middleware.ts da raiz do projeto a cada requisição.

export async function updateSession(request: NextRequest) {
  // Começamos com uma resposta que simplesmente deixa
  // a requisição continuar normalmente.

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      cookies: {
        // Aqui lemos todos os cookies da requisição que chegou.
        getAll() {
          return request.cookies.getAll();
        },
        // Aqui escrevemos cookies tanto na requisição quanto
        // na resposta. Isso é o que permite renovar o token
        // de sessão quando ele está próximo de expirar.
        // Sem isso, o usuário seria deslogado a cada hora
        // mesmo estando ativo na plataforma.
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  // IMPORTANTE: essa linha precisa existir aqui.
  // getUser() valida o token com o servidor do Supabase
  // e aciona a renovação do token se necessário.
  // Sem essa chamada, o setAll acima nunca seria chamado
  // e a sessão nunca seria renovada.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Retornamos a resposta com os cookies atualizados.
  // O middleware.ts da raiz vai usar essa resposta
  // para decidir se redireciona ou deixa passar.

  return { supabaseResponse, user };
}
