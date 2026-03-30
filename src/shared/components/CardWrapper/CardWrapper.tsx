interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
  showCornerGlow?: boolean;
}

export default function CardWrapper({
  children,
  className = "",
  showCornerGlow = true,
}: CardWrapperProps) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-[#121212] rounded-xl
        border border-white/5 shadow-2xl
        p-6 sm:p-8 md:p-10 lg:p-12
        ${className}
      `}
    >
      {showCornerGlow && (
        <div
          className="
            absolute top-0 right-0
            w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32
            bg-linear-to-br from-[#fe2c55]/10 to-transparent
            blur-xl pointer-events-none
          "
        />
      )}
      {children}
    </div>
  );
}
