import clsx from "clsx";
import { GoogleIcon } from "./_components/GoogleIcon";
interface GoogleButtonProps {
  title: string;
  severError?: string | null;
  onClick?: () => void;
  disabled?: boolean;
}

const GoogleButtonComponent = ({
  title = "Entrar com o Google",
  onClick,
  severError,
  disabled,
}: GoogleButtonProps) => {
  return (
    <>
      {/* Google button */}
      <button
        type="button"
        className={clsx(
          "w-full bg-white/3 border border-white/7 rounded-xl py-3 text-sm text-[#5a5a78] flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 mb-6 sm:mb-7 font-dm-sans",
          severError
            ? "border border-red-500/70 focus:border-red-600"
            : "border border-white/7 focus:border-[rgba(124,92,252,0.4)]",
        )}
        onClick={onClick}
        disabled={disabled}
      >
        <GoogleIcon />
        {title}
      </button>
    </>
  );
};

export default GoogleButtonComponent;
