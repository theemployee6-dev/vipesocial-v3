import Link from "next/link";

interface TermFooterProps {
  className?: string;
}

export default function TermFooter({ className = "" }: TermFooterProps) {
  return (
    <div
      className={`flex justify-center gap-4 text-[#6b6b6b] text-[11px] ${className}`}
    >
      <Link href="/termos" className="hover:text-[#fe2c55] transition-colors">
        Termos de Serviço
      </Link>
      <Link
        href="/privacidade"
        className="hover:text-[#fe2c55] transition-colors"
      >
        Política de Privacidade
      </Link>
      <Link href="/suporte" className="hover:text-[#fe2c55] transition-colors">
        Suporte
      </Link>
    </div>
  );
}
