import Link from "next/link";
import TopGlowLineComponent from "@/shared/components/TopGlowLine/page";
import LogoComponent from "@/shared/components/Logo/page";
import HeaderComponent from "@/shared/components/Header/page";

export default function ConfirmarEmailPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#080810] px-4">
      <div
        className="relative z-10 w-full max-w-md rounded-2xl px-8 py-10 border border-white/6 text-center"
        style={{
          background:
            "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 60%, #0a0a14 100%)",
        }}
      >
        {/* Top glow line */}
        <TopGlowLineComponent />

        {/* Ícone */}
        <div className="w-16 h-16 rounded-full bg-[rgba(124,92,252,0.1)] border border-[rgba(124,92,252,0.2)] flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              stroke="#7c5cfc"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Logo */}
        <section className="flex items-center justify-center">
          <LogoComponent />
        </section>

        {/* Heading */}
        <section>
          <HeaderComponent
            title=" Confirme seu email"
            subTitle="Enviamos um link de confirmação para o seu email. Clique no link para
          ativar sua conta e começar a viralizar."
          />
        </section>

        {/* Dica */}
        <div className="w-full rounded-xl px-4 py-3 bg-[rgba(124,92,252,0.06)] border border-[rgba(124,92,252,0.12)] mb-6">
          <p className="text-xs text-[#5a5a78] font-dm-sans">
            Não recebeu o email? Verifique a pasta de spam ou aguarde alguns
            minutos.
          </p>
        </div>

        {/* Link para login */}
        <Link
          href="/login"
          className="text-sm text-[#7c5cfc] font-medium font-dm-sans no-underline hover:opacity-80"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
