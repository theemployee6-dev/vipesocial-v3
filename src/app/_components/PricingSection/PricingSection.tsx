import {
  StarterButton,
  ProButton,
} from "../../(marketing)/_components/PricingButtons";

export default function PricingSection() {
  return (
    <section id="precos" className="px-6 py-24 sm:py-32 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-[#5A5A5A] uppercase tracking-widest mb-4">
            Preços
          </p>
          <h2 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight mb-4 text-white">
            Simples e transparente
          </h2>
          <p className="font-dm-sans text-sm text-[#E6BCBD]">
            Sem surpresas. Cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plano Starter */}
          <div className="rounded-2xl bg-[#1C1B1B] p-7 flex flex-col">
            <div className="mb-6">
              <h3 className="font-syne text-base font-bold text-white mb-1">
                Starter
              </h3>
              <p className="font-dm-sans text-xs text-[#E6BCBD]">
                Para começar a entender o que funciona
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="font-syne text-4xl font-extrabold text-white">
                  R$50
                </span>
                <span className="font-dm-sans text-sm text-[#5A5A5A] mb-1.5">
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
                  <div className="w-4 h-4 rounded-full bg-[#201F1F] flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
                  </div>
                  <span className="font-dm-sans text-sm text-white">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <StarterButton />
          </div>

          {/* Plano Pro */}
          <div className="relative rounded-2xl bg-[#201F1F] p-7 flex flex-col overflow-hidden">
            {/* Top glow line com nova cor */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(254,44,85,0.6), transparent)",
              }}
            />

            {/* Badge popular */}
            <div className="absolute top-5 right-5">
              <span className="font-dm-sans text-[10px] font-medium text-[#FE2C55] bg-[rgba(254,44,85,0.1)] rounded-full px-2.5 py-1">
                Mais popular
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-syne text-base font-bold text-white mb-1">
                Pro
              </h3>
              <p className="font-dm-sans text-xs text-[#E6BCBD]">
                Para criadores sérios em crescimento
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="font-syne text-4xl font-extrabold text-white">
                  R$29,90
                </span>
                <span className="font-dm-sans text-sm text-[#5A5A5A] mb-1.5">
                  /mês
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-dm-sans text-xs text-[#5A5A5A] line-through">
                  R$50/mês
                </span>
                <span className="font-dm-sans text-xs text-[#22c55e] font-medium">
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
                  <div className="w-4 h-4 rounded-full bg-[rgba(254,44,85,0.2)] flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
                  </div>
                  <span className="font-dm-sans text-sm text-white">
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
