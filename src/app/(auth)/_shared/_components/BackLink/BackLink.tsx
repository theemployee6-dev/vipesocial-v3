import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  href: string;
  className?: string;
}

export default function BackLink({ href, className = "" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-[#e6bcbd] hover:text-white text-sm transition-colors ${className}`}
    >
      <ArrowLeft size={16} />
      Voltar
    </Link>
  );
}
