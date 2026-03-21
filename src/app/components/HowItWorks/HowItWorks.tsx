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

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="px-6 py-24 sm:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-zinc-600 uppercase tracking-widest mb-4">
            Como funciona
          </p>
          <h2 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight">
            Três passos para o próximo viral
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-white/10 p-6"
              style={{
                background: "linear-gradient(145deg, #0f0f1a 0%, #0a0a12 100%)",
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
  );
}
