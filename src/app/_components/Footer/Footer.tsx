import LogoComponent from "@/shared/components/LogoComponent/LogoComponent";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#131313] px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <LogoComponent className="max-w-[clamp(110px,15vw,200px)] md:max-w-[clamp(130px,12vw,280px)] lg:max-w-[clamp(140px,10vw,350px)] mb-5" />

        <div className="flex items-center gap-5">
          <Link
            href="/termos"
            className="font-dm-sans text-[clamp(10px,2.5vw,12px)] text-[#5A5A5A] hover:text-white transition-colors"
          >
            Termos de uso
          </Link>
          <Link
            href="/privacidade"
            className="font-dm-sans text-[clamp(10px,2.5vw,12px)] text-[#5A5A5A] hover:text-white transition-colors"
          >
            Privacidade
          </Link>
        </div>

        <p className="font-dm-sans text-[clamp(10px,2.5vw,12px)] text-[#5A5A5A]">
          © 2026 vipeSocial
        </p>
      </div>
    </footer>
  );
}
