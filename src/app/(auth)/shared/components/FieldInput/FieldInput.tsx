import { clsx } from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";

interface FieldInputProps {
  label: string;
  placeholder: string;
  type: "text" | "email" | "password";
  disabled?: boolean;
  error?: string; // mensagem de erro (se houver)
  registration?: UseFormRegisterReturn; // props do react-hook-form
}

export default function FieldInput({
  label,
  placeholder,
  type = "text",
  disabled = false,
  error,
  registration,
  ...rest
}: FieldInputProps) {
  const isPasswordType = type === "password";

  return (
    <div className="flex flex-col gap-1">
      <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium tracking-[0.5px]">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className={clsx(
          "w-full bg-white/3 rounded-xl px-4 py-3.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors duration-200 placeholder:text-[#252535]",
          error
            ? "border border-red-500/70 focus:border-red-600"
            : "border border-white/7 focus:border-[rgba(124,92,252,0.4)]",
        )}
        disabled={disabled}
        {...rest} // outras props arbitrárias
        {...registration} // props do react-hook-form (onChange, onBlur, ref, name)
      />

      {/* Mensagem de erro (em vermelho) */}
      {error && (
        <p className="text-xs text-red-400 font-dm-sans mt-1">{error}</p>
      )}

      {/* Dica de senha (só aparece se não houver erro e for password) */}
      {isPasswordType && !error && (
        <p className="text-[10px] text-[#2a2a3a] font-dm-sans mt-1.5">
          Mínimo 8 caracteres com letras e números
        </p>
      )}
    </div>
  );
}
