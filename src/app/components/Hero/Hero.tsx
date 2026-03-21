import Link from "next/link";

const scriptCards = [
  {
    title: "A Crise dos 40: Do Escritório à Liberdade",
    emotion: "Curiosidade irresistível",
    time: "19:00",
  },
  {
    title: "O que ninguém te conta sobre empreender",
    emotion: "Identificação profunda",
    time: "12:00",
  },
  {
    title: "Transformando R$50 em cenário de milhões",
    emotion: "Aspiração acessível",
    time: "21:00",
  },
  {
    title: "A batalha que você não vê por trás da câmera",
    emotion: "Revolta justificada",
    time: "18:30",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center overflow-hidden">
      {/* Glow central dramático */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800] h-[600] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,92,252,0.20) 0%, rgba(124,92,252,0.06) 40%, transparent 70%)",
        }}
      />
      {/* Glow dourado */}
      <div
        className="absolute bottom-0 right-1/4 w-[400] h-[300] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,140,40,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Pill badge */}
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border border-violet-500/20 bg-violet-500/5">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        <span className="text-[clamp(10px,2.5vw,13px)] text-violet-300 font-dm-sans tracking-wide">
          IA para criadores TikTok brasileiros
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,4vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-extrabold tracking-tight leading-[1.05] max-w-6xl mb-6">
        Seu próximo vídeo viral{" "}
        <span
          className="relative inline-block"
          style={{
            background:
              "linear-gradient(135deg, #a78bfa 0%, #7c5cfc 50%, #5a3de0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          já está dentro de você
        </span>
      </h1>

      {/* Subheadline */}
      <p className="font-dm-sans text-[clamp(14px,4vw,20px)] text-zinc-400 max-w-3xl mb-10 leading-relaxed">
        A vipeSocial analisa o vídeo que bombou e cria 5 roteiros personalizados
        para a sua realidade. Sem copiar. Sem fingir. Do jeito que só você faz.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/cadastro"
          className="px-8 py-4 rounded-xl font-syne font-bold text-white text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #7c5cfc 0%, #5a3de0 100%)",
            boxShadow: "0 0 32px rgba(124,92,252,0.35)",
          }}
        >
          Começar grátis →
        </Link>
        <a
          href="#como-funciona"
          className="px-8 py-4 rounded-xl font-dm-sans text-sm text-zinc-400 border border-white/10 hover:border-white/20 hover:text-zinc-200 transition-all"
        >
          Ver como funciona
        </a>
      </div>

      {/* Social proof */}
      <div className="flex flex-wrap justify-center gap-6 mt-12">
        {[
          "5 roteiros por análise",
          "Personalizado para sua realidade",
          "Resultado em minutos",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-violet-500" />
            <span className="text-[clamp(10px,2.5vw,14px)] text-zinc-600 font-dm-sans">
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Product preview mockup */}
      <div className="relative mt-20 w-full max-w-6xl mx-auto">
        <div
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 100%)",
            boxShadow:
              "0 0 80px rgba(124,92,252,0.12), 0 40px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Fake browser bar */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            <div className="flex-1 mx-4 rounded-md bg-white/10 h-5 max-w-xs" />
          </div>

          {/* Fake UI content */}
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-2 bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[clamp(8px,2vw,11px)] text-emerald-400 font-dm-sans">
                    5 roteiros prontos
                  </span>
                </div>
                <h3 className="font-syne text-[clamp(16px,5vw,24px)] font-bold text-white">
                  Seus roteiros virais
                </h3>
                <p className="font-dm-sans text-xs text-zinc-500 mt-0.5">
                  Baseados no DNA emocional do seu vídeo
                </p>
              </div>
            </div>

            {/* Fake script cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scriptCards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 mb-2 bg-violet-500/10 border border-violet-500/15">
                    <span className="text-[clamp(8px,2vw,10px)] text-violet-400 font-dm-sans">
                      {card.emotion}
                    </span>
                  </div>
                  <p className="font-syne text-[clamp(12px,3vw,15px)] font-semibold text-zinc-200 leading-snug mb-2">
                    {card.title}
                  </p>
                  <p className="text-[clamp(9px,2vw,12px)] text-zinc-600 font-dm-sans">
                    Postar às {card.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Glow under mockup */}
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(124,92,252,0.15) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </div>
    </section>
  );
}
