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
      className={`bg-[#121212] rounded-xl p-8 md:p-10 shadow-2xl border border-white/5 relative overflow-hidden ${className}`}
    >
      {showCornerGlow && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#fe2c55]/10 blur-xl to-transparent pointer-events-none" />
      )}
      {children}
    </div>
  );
}
