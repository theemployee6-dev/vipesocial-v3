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
              <h2 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight mb-5">
                Roteiros feitos para
                <br />
                <span className="text-violet-400">a sua realidade</span>
              </h2>
              <p className="font-dm-sans text-zinc-400 text-[clamp(11px,3vw,14px)] leading-relaxed mb-6">
                Não adianta um roteiro perfeito se você não consegue executar. A
                vipeSocial sabe que você grava no quarto, com o celular que tem,
                com a roupa que já possui. Nossos roteiros respeitam isso.
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
  );
}
