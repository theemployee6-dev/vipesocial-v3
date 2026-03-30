import clsx from "clsx";

interface MainButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function MainButton({
  title,
  onClick,
  disabled = false,
  type = "submit", // <--- alterado de "button" para "submit"
}: MainButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full rounded-6 py-3.5 text-sm font-bold text-white transition-all",
        disabled
          ? "bg-[#fe2c55]/50 cursor-not-allowed opacity-60"
          : "bg-linear-to-b from-white/10 to-transparent bg-[#fe2c55] hover:brightness-110 active:scale-98 shadow-lg shadow-[#fe2c55]/10",
      )}
    >
      {title}
    </button>
  );
}
