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
      className={clsx(
        "flex-1 rounded-xl py-3.5 text-sm font-bold text-white bg-linear-to-br from-[#7c5cfc] via-[#6040e0] to-[#5030d0]",
        disabled
          ? "bg-gray-500 transition-all duration-500"
          : "bg-linear-to-br from-[#7c5cfc] via-[#6040e0] to-[#5030d0]",
      )}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default OnboardingMainButton;
