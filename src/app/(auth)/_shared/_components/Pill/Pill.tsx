interface PillProps {
  children: React.ReactNode;
  className?: string;
}

export default function Pill({ children, className = "" }: PillProps) {
  return (
    <div
      className={`inline-block bg-[#fe2c55]/10 text-[#fe2c55] text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide ${className}`}
    >
      {children}
    </div>
  );
}
