import Link from "next/link";

interface BackLinkProps {
  href: string; // ou UrlObject, se precisar de objetos complexos
}

const BackLinkComponent = ({ href }: BackLinkProps) => {
  return (
    <>
      {/* Back link */}
      <Link
        href={href}
        className="absolute top-10 left-4 sm:top-12 sm:left-8 flex items-center gap-1.5 text-xs sm:text-sm text-[#3a3a50] hover:text-[#6a6a90] transition-colors font-dm-sans no-underline"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Início
      </Link>
    </>
  );
};

export default BackLinkComponent;
