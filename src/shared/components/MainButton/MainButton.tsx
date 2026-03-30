interface MainButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function MainButton({
  title,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: MainButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-linear-to-b from-white/10 to-transparent bg-[#fe2c55] text-white font-bold py-3.5 rounded-6 transition-all hover:brightness-110 active:scale-98 shadow-lg shadow-[#fe2c55]/10 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {title}
    </button>
  );
}
