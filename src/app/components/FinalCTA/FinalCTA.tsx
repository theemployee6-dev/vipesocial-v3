import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="relative rounded-3xl border border-violet-500/20 px-8 py-16 overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, rgba(124,92,252,0.07) 0%, #07070e 70%)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(124,92,252,0.5), rgba(200,140,40,0.3), transparent)",
            }}
          />
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(124,92,252,0.12) 0%, transparent 70%)",
            }}
          />

          <h2 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-extrabold tracking-tight mb-4 relative">
            Descubra agora por que
            <br />
            seu vídeo viralizou
          </h2>
          <p className="font-dm-sans text-zinc-400 text-sm mb-8 relative">
            Comece grátis. Sem cartão de crédito.
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-syne font-bold text-white text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] relative"
            style={{
              background: "linear-gradient(135deg, #7c5cfc 0%, #5a3de0 100%)",
              boxShadow: "0 0 40px rgba(124,92,252,0.35)",
            }}
          >
            Começar agora — é grátis →
          </Link>
        </div>
      </div>
    </section>
  );
}
