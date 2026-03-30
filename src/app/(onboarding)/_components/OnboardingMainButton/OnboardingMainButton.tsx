import clsx from "clsx";

interface OnboardingMainButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

const OnboardingMainButton = ({
  title,
  onClick,
  disabled,
}: OnboardingMainButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={clsx(
        "flex-1 rounded-6 py-3.5 text-sm font-bold text-white transition-all",
        disabled
          ? "bg-[#fe2c55]/50 cursor-not-allowed opacity-60"
          : "bg-linear-to-b from-white/10 to-transparent bg-[#fe2c55] hover:brightness-110 active:scale-98 shadow-lg shadow-[#fe2c55]/10",
      )}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default OnboardingMainButton;
