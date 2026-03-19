import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";

interface RadioButtonProps {
  title: string;
  value: string | number | readonly string[] | undefined;
  registration?: UseFormRegisterReturn;
  error?: boolean;
}
const RadioButton = ({
  title,
  value,
  registration,
  error,
}: RadioButtonProps) => {
  return (
    <>
      <label
        key={title}
        className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl border border-white/7 bg-white/2 cursor-pointer hover:border-[rgba(124,92,252,0.3)] transition-colors",
          error
            ? "border border-red-500/70 focus:border-red-600"
            : "border border-white/7 focus:border-[rgba(124,92,252,0.4)]",
        )}
      >
        <input
          type="radio"
          value={value}
          {...registration}
          className="accent-[#7c5cfc]"
        />
        <span className="text-sm text-[#c8c8e8] font-dm-sans">{title}</span>
      </label>
    </>
  );
};

export default RadioButton;
