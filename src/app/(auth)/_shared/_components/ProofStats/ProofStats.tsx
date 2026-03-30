interface ProofStatsProps {
  className?: string;
}

export default function ProofStats({ className = "" }: ProofStatsProps) {
  return (
    <div className={`text-center text-[#6b6b6b] text-xs ${className}`}>
      🔥 +12.000 criadores já viralizaram com a vipeSocial
    </div>
  );
}
