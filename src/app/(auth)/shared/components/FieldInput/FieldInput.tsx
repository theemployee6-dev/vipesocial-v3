interface FieldInputProps {
  label: string;
  placeholder: string;
  type: "text" | "email" | "password";
  disabled?: boolean;
}

export default function FieldInput({
  label,
  placeholder,
  type = "text",
  disabled = false,
  ...rest
}: FieldInputProps) {
  const isPasswordType = type === "password";
  return (
    <>
      <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 tracking-[0.5px]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-white/3 border border-white/7 rounded-xl px-4 py-3.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors duration-200 placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
        disabled={disabled}
        {...rest}
      />
      {isPasswordType && (
        <>
          {/* Dica de senha forte */}
          <p className="text-[10px] text-[#2a2a3a] font-dm-sans mt-1.5">
            Mínimo 8 caracteres com letras e números
          </p>
        </>
      )}
    </>
  );
}
