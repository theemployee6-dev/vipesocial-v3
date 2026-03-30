import { GoogleIcon } from "./_components/GoogleIcon";

interface GoogleButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function GoogleButton({
  title,
  onClick,
  disabled = false,
  className = "",
}: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3.5 rounded-6 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      <GoogleIcon />
      {title}
    </button>
  );
}
