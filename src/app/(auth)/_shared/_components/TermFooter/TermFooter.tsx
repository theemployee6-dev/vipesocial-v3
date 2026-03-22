import Link from "next/link";

const TermFooterComponent = () => {
  return (
    <>
      {/* Terms footer */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 text-[10px] sm:text-[11px] text-[#1e1e2e] font-dm-sans">
        <Link
          href="/termos"
          className="text-[#252535] no-underline hover:opacity-70"
        >
          Termos de uso
        </Link>
        <span style={{ color: "#151525" }}>|</span>
        <Link
          href="/privacidade"
          className="text-[#252535] no-underline hover:opacity-70"
        >
          Privacidade
        </Link>
      </div>
    </>
  );
};

export default TermFooterComponent;
