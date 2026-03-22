import { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxButtonProps {
  title: string;
  registration?: UseFormRegisterReturn;
}
const CheckboxButton = ({ title, registration }: CheckboxButtonProps) => {
  return (
    <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/7 bg-white/2 cursor-pointer">
      <input
        type="checkbox"
        {...registration}
        className="accent-[#7c5cfc] w-4 h-4"
      />
      <span className="text-sm text-[#c8c8e8] font-dm-sans">{title}</span>
    </label>
  );
};

export default CheckboxButton;
