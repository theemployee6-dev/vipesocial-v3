// Esse layout é compartilhado entre login e cadastro.
// Ele não adiciona nenhum visual próprio — apenas garante
// que as páginas de auth não herdam nenhum layout
// de outras partes da aplicação como o dashboard.
// É uma camada de isolamento limpo.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // min-h-svh usa a altura real da viewport no mobile
    // evitando o problema clássico de 100vh no iOS
    // onde a barra do navegador não é considerada.
    <main className="min-h-svh">{children}</main>
  );
}
