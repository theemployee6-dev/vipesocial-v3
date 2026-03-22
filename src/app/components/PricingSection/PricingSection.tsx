import {
  StarterButton,
  ProButton,
} from "../../(marketing)/components/PricingButtons";

export default function PricingSection() {
  return (
    <section id="precos" className="px-6 py-24 sm:py-32 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-zinc-600 uppercase tracking-widest mb-4">
            Preços
          </p>
          <h2 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight mb-4">
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
              background: "linear-gradient(145deg, #0f0f1a 0%, #0a0a12 100%)",
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

            <StarterButton />
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

            <ProButton />
          </div>
        </div>
      </div>
    </section>
  );
}
