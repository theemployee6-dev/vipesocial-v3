import LogoComponent from "@/shared/components/Logo/page";
import Link from "next/link";

export default function LandingPage() {
  // Dados dos passos, planos e diferenciais (para facilitar manutenção)
  const steps = [
    {
      number: "01",
      title: "Sobe o vídeo",
      description:
        "Envia o vídeo que bombou no TikTok e informa as métricas: views, curtidas, comentários, compartilhamentos.",
    },
    {
      number: "02",
      title: "IA analisa o DNA",
      description:
        "Nossa IA assiste o vídeo, analisa o hook, a estrutura emocional e descobre exatamente por que aquele vídeo funcionou.",
    },
    {
      number: "03",
      title: "Recebe 5 roteiros",
      description:
        "Você recebe 5 roteiros completos — com fala exata, cenário, setup, edição — feitos para a sua realidade.",
    },
  ];

  const differentiators = [
    { icon: "📱", text: "Instruções para o celular que você já tem" },
    { icon: "💡", text: "Luz natural da janela como setup profissional" },
    { icon: "👕", text: "Roupa do seu guarda-roupa, nunca compra nova" },
    { icon: "🗣️", text: "Fala exata no seu vocabulário natural" },
    { icon: "📍", text: "Referências culturais da sua cidade e realidade" },
  ];

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

  return (
    <div className="bg-[#07070e] text-[#e8e8f8] overflow-x-hidden">
      {/* ── NAVBAR ────────────────────────────────────────────────── */}
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

      {/* ── CONTEÚDO PRINCIPAL ──────────────────────────────────── */}
      <main>
        {/* ── HERO ──────────────────────────────────────────────────── */}
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
          <h1 className="font-syne text-[clamp(18px,7vw,70px)]  sm:text-[clamp(22px,4vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-extrabold tracking-tight leading-[1.05] max-w-6xl mb-6">
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
            A vipeSocial analisa o vídeo que bombou e cria 5 roteiros
            personalizados para a sua realidade. Sem copiar. Sem fingir. Do
            jeito que só você faz.
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

        {/* ── PROBLEMA ──────────────────────────────────────────────── */}
        <section className="px-6 py-24 sm:py-32 max-w-6xl mx-auto text-center">
          <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-zinc-600 uppercase tracking-widest mb-4">
            O problema
          </p>
          <h2 className="font-syne text-[clamp(18px,7vw,70px)]  sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight mb-6 leading-tight">
            Você grava 30 vídeos.
            <br />
            <span className="text-zinc-500">
              1 viraliza. E você não sabe por quê.
            </span>
          </h2>
          <p className="font-dm-sans text-zinc-400 text-[clamp(14px,2vw,20px)] max-w-3xl mx-auto leading-relaxed">
            Você sabe que tem potencial. Você vê outros criadores com a mesma
            realidade que a sua bombando todo dia. Mas quando você tenta
            repetir, não funciona. O problema não é você — é que ninguém te
            explicou o que realmente fez aquele vídeo viralizar.
          </p>
        </section>

        {/* ── COMO FUNCIONA ─────────────────────────────────────────── */}
        <section
          id="como-funciona"
          className="px-6 py-24 sm:py-32 scroll-mt-20"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-zinc-600 uppercase tracking-widest mb-4">
                Como funciona
              </p>
              <h2 className="font-syne text-[clamp(18px,7vw,70px)]  sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight">
                Três passos para o próximo viral
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-white/10 p-6"
                  style={{
                    background:
                      "linear-gradient(145deg, #0f0f1a 0%, #0a0a12 100%)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(124,92,252,0.4), transparent)",
                    }}
                  />
                  <span className="font-syne text-4xl font-extrabold text-white/10 block mb-4">
                    {step.number}
                  </span>
                  <h3 className="font-syne text-[clamp(16px,4vw,20px)] font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="font-dm-sans text-sm text-zinc-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DIFERENCIAL ───────────────────────────────────────────── */}
        <section className="px-6 py-24 sm:py-32">
          <div className="max-w-6xl mx-auto">
            <div
              className="rounded-3xl border border-violet-500/15 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,92,252,0.06) 0%, rgba(7,7,14,1) 60%)",
              }}
            >
              <div className="p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-violet-400 uppercase tracking-widest mb-4">
                    O diferencial
                  </p>
                  <h2 className="font-syne text-[clamp(18px,7vw,70px)]  sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight mb-5">
                    Roteiros feitos para
                    <br />
                    <span className="text-violet-400">a sua realidade</span>
                  </h2>
                  <p className="font-dm-sans text-zinc-400 text-[clamp(11px,3vw,14px)] leading-relaxed mb-6">
                    Não adianta um roteiro perfeito se você não consegue
                    executar. A vipeSocial sabe que você grava no quarto, com o
                    celular que tem, com a roupa que já possui. Nossos roteiros
                    respeitam isso.
                  </p>
                  <Link
                    href="/cadastro"
                    className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors font-dm-sans"
                  >
                    Começar agora →
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  {differentiators.map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5"
                    >
                      <span className="text-lg" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span className="font-dm-sans text-sm text-zinc-300">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PREÇOS ────────────────────────────────────────────────── */}
        <section id="precos" className="px-6 py-24 sm:py-32 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-zinc-600 uppercase tracking-widest mb-4">
                Preços
              </p>
              <h2 className="font-syne text-[clamp(18px,7vw,70px)]  sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight mb-4">
                Simples e transparente
              </h2>
              <p className="font-dm-sans text-zinc-500 text-sm">
                Sem surpresas. Cancele quando quiser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plano Starter */}
              <div
                className="rounded-2xl border border-white/10 p-7 flex flex-col"
                style={{
                  background:
                    "linear-gradient(145deg, #0f0f1a 0%, #0a0a12 100%)",
                }}
              >
                <div className="mb-6">
                  <h3 className="font-syne text-base font-bold text-white mb-1">
                    Starter
                  </h3>
                  <p className="font-dm-sans text-xs text-zinc-600">
                    Para começar a entender o que funciona
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="font-syne text-4xl font-extrabold text-white">
                      R$50
                    </span>
                    <span className="font-dm-sans text-sm text-zinc-500 mb-1.5">
                      /mês
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-8 flex-1">
                  {[
                    "3 análises por mês",
                    "5 roteiros por análise",
                    "Roteiros personalizados",
                    "Histórico de análises",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      </div>
                      <span className="font-dm-sans text-sm text-zinc-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/cadastro"
                  className="w-full text-center py-3 rounded-xl border border-white/20 text-sm font-medium font-dm-sans text-zinc-300 hover:border-white/30 hover:text-white transition-all"
                >
                  Começar
                </Link>
              </div>

              {/* Plano Pro */}
              <div
                className="relative rounded-2xl border border-violet-500/30 p-7 flex flex-col overflow-hidden"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(124,92,252,0.08) 0%, #0a0a12 60%)",
                }}
              >
                {/* Top glow line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(124,92,252,0.8), transparent)",
                  }}
                />

                {/* Badge popular */}
                <div className="absolute top-5 right-5">
                  <span className="font-dm-sans text-[10px] font-medium text-violet-300 bg-violet-500/15 border border-violet-500/25 rounded-full px-2.5 py-1">
                    Mais popular
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="font-syne text-base font-bold text-white mb-1">
                    Pro
                  </h3>
                  <p className="font-dm-sans text-xs text-zinc-500">
                    Para criadores sérios em crescimento
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="font-syne text-4xl font-extrabold text-white">
                      R$29,90
                    </span>
                    <span className="font-dm-sans text-sm text-zinc-500 mb-1.5">
                      /mês
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-dm-sans text-xs text-zinc-600 line-through">
                      R$50/mês
                    </span>
                    <span className="font-dm-sans text-xs text-emerald-400 font-medium">
                      Economize 40% · R$358,80/ano
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-8 flex-1">
                  {[
                    "Análises ilimitadas",
                    "5 roteiros por análise",
                    "Roteiros personalizados",
                    "Histórico completo",
                    "Check-in de aprendizado",
                    "Acesso antecipado a novidades",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      </div>
                      <span className="font-dm-sans text-sm text-zinc-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/cadastro"
                  className="w-full text-center py-3 rounded-xl text-sm font-bold font-dm-sans text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c5cfc 0%, #5a3de0 100%)",
                    boxShadow: "0 0 24px rgba(124,92,252,0.3)",
                  }}
                >
                  Assinar plano anual →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────── */}
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

              <h2 className="font-syne text-[clamp(18px,7vw,70px)]  sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-extrabold tracking-tight mb-4 relative">
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
                  background:
                    "linear-gradient(135deg, #7c5cfc 0%, #5a3de0 100%)",
                  boxShadow: "0 0 40px rgba(124,92,252,0.35)",
                }}
              >
                Começar agora — é grátis →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <LogoComponent className="max-w-[clamp(110px,15vw,200px)] md:max-w-[clamp(130px,12vw,280px)] lg:max-w-[clamp(140px,10vw,350px)] mb-5" />

          <div className="flex items-center gap-5">
            <Link
              href="/termos"
              className="font-dm-sans text-[clamp(10px,2.5vw,12px)] text-zinc-700 hover:text-zinc-500 transition-colors"
            >
              Termos de uso
            </Link>
            <Link
              href="/privacidade"
              className="font-dm-sans text-[clamp(10px,2.5vw,12px)] text-zinc-700 hover:text-zinc-500 transition-colors"
            >
              Privacidade
            </Link>
          </div>

          <p className="font-dm-sans text-[clamp(10px,2.5vw,12px)] text-zinc-700">
            © 2026 vipeSocial
          </p>
        </div>
      </footer>
    </div>
  );
}
