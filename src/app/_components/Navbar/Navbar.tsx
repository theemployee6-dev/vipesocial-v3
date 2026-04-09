import LogoComponent from "@/shared/components/LogoComponent/LogoComponent";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-2 border-b border-white/5"
      style={{
        background: "#131313",
        backdropFilter: "blur(16px)",
      }}
    >
      <LogoComponent className="max-w-[clamp(110px,15vw,200px)] md:max-w-[clamp(130px,12vw,280px)] lg:max-w-[clamp(140px,10vw,350px)] mb-5" />

      <div className="hidden sm:flex items-center gap-6">
        <a
          href="#como-funciona"
          className="text-[clamp(11px,3vw,14px)] text-[#E6BCBD] hover:text-white transition-colors font-dm-sans"
        >
          Como funciona
        </a>
        <a
          href="#precos"
          className="text-[clamp(11px,3vw,14px)] text-[#E6BCBD] hover:text-white transition-colors font-dm-sans"
        >
          Preços
        </a>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-[clamp(11px,3vw,14px)] text-[#E6BCBD] hover:text-white transition-colors font-dm-sans"
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className="text-[clamp(11px,3vw,14px)] font-medium font-dm-sans px-4 py-2 rounded-lg bg-[#FE2C55] hover:bg-[#e03c4a] text-white transition-colors"
        >
          Começar grátis
        </Link>
      </div>
    </nav>
  );
}
