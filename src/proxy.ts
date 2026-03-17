import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/infrastructure/supabase/middleware";

export async function proxy(request: NextRequest) {
  // Primeiro atualizamos a sessão e descobrimos se há usuário logado.
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Rotas que qualquer pessoa pode acessar sem estar logada.
  const publicRoutes = ["/", "/pricing", "/sobre"];

  // Rotas que só fazem sentido para quem NÃO está logado.
  // Se um usuário logado tentar acessar, mandamos para o dashboard.
  const authRoutes = ["/login", "/cadastro", "/confirmar-email"];

  // Se o usuário não está logado e tenta acessar rota protegida,
  // mandamos para o login guardando a URL que ele queria acessar
  // para redirecionar de volta depois que fizer login.
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  if (!user && !isAuthRoute && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se o usuário está logado e tenta acessar rota de auth,
  // mandamos para o dashboard dele.
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Em todos os outros casos deixamos passar com a sessão atualizada.
  return supabaseResponse;
}

// O matcher define em quais rotas o middleware roda.
// Excluímos arquivos estáticos e imagens para não processar
// requisições desnecessárias e manter o middleware rápido.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
