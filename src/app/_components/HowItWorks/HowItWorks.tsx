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
          <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-[#5A5A5A] uppercase tracking-widest mb-4">
            Como funciona
          </p>
          <h2 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight text-white">
            Três passos para o próximo viral
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl bg-[#1C1B1B] p-6"
            >
              <span className="font-syne text-4xl font-extrabold text-[#FE2C55]/20 block mb-4">
                {step.number}
              </span>
              <h3 className="font-syne text-[clamp(16px,4vw,20px)] font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="font-dm-sans text-sm text-[#E6BCBD] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
