import LogoComponent from "@/shared/components/Logo/page";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-2 border-b border-white/5"
      style={{
        background: "rgba(7,7,14,0.85)",
        backdropFilter: "blur(16px)",
      }}
    >
      <LogoComponent className="max-w-[clamp(110px,15vw,200px)] md:max-w-[clamp(130px,12vw,280px)] lg:max-w-[clamp(140px,10vw,350px)] mb-5" />

      <div className="hidden sm:flex items-center gap-6">
        <a
          href="#como-funciona"
          className="text-[clamp(11px,3vw,14px)] text-zinc-500 hover:text-zinc-300 transition-colors font-dm-sans"
        >
          Como funciona
        </a>
        <a
          href="#precos"
          className="text-[clamp(11px,3vw,14px)] text-zinc-500 hover:text-zinc-300 transition-colors font-dm-sans"
        >
          Preços
        </a>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-[clamp(11px,3vw,14px)] text-zinc-400 hover:text-white transition-colors font-dm-sans"
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className="text-[clamp(11px,3vw,14px)] font-medium font-dm-sans px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
        >
          Começar grátis
        </Link>
      </div>
    </nav>
  );
}
