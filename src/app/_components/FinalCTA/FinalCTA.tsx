import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative rounded-3xl bg-[#1C1B1B] px-8 py-16 overflow-hidden">
          {/* Top glow line com nova cor */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(254,44,85,0.5), rgba(254,44,85,0.2), transparent)",
            }}
          />
          {/* Glow decorativo central */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(254,44,85,0.1) 0%, transparent 70%)",
            }}
          />

          <h2 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-extrabold tracking-tight mb-4 relative text-white">
            Descubra agora por que
            <br />
            seu vídeo viralizou
          </h2>
          <p className="font-dm-sans text-[#E6BCBD] text-sm mb-8 relative">
            Comece grátis. Sem cartão de crédito.
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-syne font-bold text-white text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] relative bg-[#FE2C55] hover:bg-[#e03c4a] shadow-lg shadow-[#FE2C55]/20"
          >
            Começar agora — é grátis →
          </Link>
        </div>
      </div>
    </section>
  );
}
