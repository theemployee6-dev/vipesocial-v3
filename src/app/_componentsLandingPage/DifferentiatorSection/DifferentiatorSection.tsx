import Link from "next/link";

const differentiators = [
  { icon: "📱", text: "Instruções para o celular que você já tem" },
  { icon: "💡", text: "Luz natural da janela como setup profissional" },
  { icon: "👕", text: "Roupa do seu guarda-roupa, nunca compra nova" },
  { icon: "🗣️", text: "Fala exata no seu vocabulário natural" },
  { icon: "📍", text: "Referências culturais da sua cidade e realidade" },
];

export default function DifferentiatorSection() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl bg-[#1C1B1B] overflow-hidden">
          <div className="p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-[#FE2C55] uppercase tracking-widest mb-4">
                O diferencial
              </p>
              <h2 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight mb-5">
                Roteiros feitos para
                <br />
                <span className="text-[#FE2C55]">a sua realidade</span>
              </h2>
              <p className="font-dm-sans text-[#E6BCBD] text-[clamp(11px,3vw,14px)] leading-relaxed mb-6">
                Não adianta um roteiro perfeito se você não consegue executar. A
                vipeSocial sabe que você grava no quarto, com o celular que tem,
                com a roupa que já possui. Nossos roteiros respeitam isso.
              </p>
              <Link
                href="/cadastro"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#FE2C55] hover:text-white transition-colors font-dm-sans"
              >
                Começar agora →
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {differentiators.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#201F1F]"
                >
                  <span className="text-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="font-dm-sans text-sm text-white">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
