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
  const authRoutes = [
    "/login",
    "/cadastro",
    "/confirmar-email",
    "/recuperar-senha",
  ];

  // Adiciona as rotas de auth callback como públicas
  const authCallbackRoutes = ["/auth/callback"];

  // Rota de onboarding — usuário logado mas sem perfil completo
  const onboardingRoute = "/onboarding";

  // Se o usuário não está logado e tenta acessar rota protegida,
  // mandamos para o login guardando a URL que ele queria acessar
  // para redirecionar de volta depois que fizer login.
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isCallbackRoute = authCallbackRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isOnboardingRoute = pathname.startsWith(onboardingRoute);

  // Usuário não logado tentando acessar rota protegida
  if (!user && !isAuthRoute && !isPublicRoute && !isCallbackRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Usuário logado tentando acessar rota de auth
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Usuário logado mas onboarding não completo
  // tentando acessar qualquer rota que não seja onboarding,
  // auth, pública ou callback
  if (
    user &&
    !user.user_metadata?.onboarding_completed &&
    !isOnboardingRoute &&
    !isAuthRoute &&
    !isPublicRoute &&
    !isCallbackRoute
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Usuário logado com onboarding completo tentando acessar onboarding
  // redireciona para o dashboard
  if (user && user.user_metadata?.onboarding_completed && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

// O matcher define em quais rotas o middleware roda.
// Excluímos arquivos estáticos e imagens para não processar
// requisições desnecessárias e manter o middleware rápido.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/inngest|api/uploadthing|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
