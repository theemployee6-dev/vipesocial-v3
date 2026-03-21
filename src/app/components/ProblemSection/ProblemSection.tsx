export default function ProblemSection() {
  return (
    <section className="px-6 py-24 sm:py-32 max-w-6xl mx-auto text-center">
      <p className="font-dm-sans text-[clamp(9px,2.5vw,12px)] text-zinc-600 uppercase tracking-widest mb-4">
        O problema
      </p>
      <h2 className="font-syne text-[clamp(18px,7vw,70px)] sm:text-[clamp(22px,5vw,70px)] lg:text-[clamp(22px,4vw,70px)] font-bold tracking-tight mb-6 leading-tight">
        Você grava 30 vídeos.
        <br />
        <span className="text-zinc-500">
          1 viraliza. E você não sabe por quê.
        </span>
      </h2>
      <p className="font-dm-sans text-zinc-400 text-[clamp(14px,2vw,20px)] max-w-3xl mx-auto leading-relaxed">
        Você sabe que tem potencial. Você vê outros criadores com a mesma
        realidade que a sua bombando todo dia. Mas quando você tenta repetir,
        não funciona. O problema não é você — é que ninguém te explicou o que
        realmente fez aquele vídeo viralizar.
      </p>
    </section>
  );
}
