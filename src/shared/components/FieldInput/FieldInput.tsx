// import { clsx } from "clsx";
// import { InputHTMLAttributes } from "react";
// import { UseFormRegisterReturn } from "react-hook-form";

// interface FieldInputProps extends Omit<
//   InputHTMLAttributes<HTMLInputElement>,
//   "type" | "placeholder" | "disabled"
// > {
//   label: string;
//   placeholder: string;
//   type: "text" | "email" | "password" | "number" | "textarea";
//   disabled?: boolean;
//   error?: string; // mensagem de erro (se houver)
//   registration?: UseFormRegisterReturn; // props do react-hook-form
// }

// export default function FieldInput({
//   label,
//   placeholder,
//   type = "text",
//   disabled = false,
//   error,
//   registration,
//   ...rest
// }: FieldInputProps) {
//   const isPasswordType = type === "password";

//   return (
//     <div className="flex flex-col gap-1">
//       <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium tracking-[0.5px]">
//         {label}
//       </label>

//       <input
//         type={type}
//         placeholder={placeholder}
//         className={clsx(
//           "w-full bg-white/3 rounded-xl px-4 py-3.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors duration-200 placeholder:text-[#252535]",
//           error
//             ? "border border-red-500/70 focus:border-red-600"
//             : "border border-white/7 focus:border-[rgba(124,92,252,0.4)]",
//         )}
//         disabled={disabled}
//         {...rest} // outras props arbitrárias
//         {...registration} // props do react-hook-form (onChange, onBlur, ref, name)
//       />

//       {/* Mensagem de erro (em vermelho) */}
//       {error && (
//         <p className="text-xs text-red-400 font-dm-sans mt-1">{error}</p>
//       )}

//       {/* Dica de senha (só aparece se não houver erro e for password) */}
//       {isPasswordType && !error && (
//         <p className="text-[10px] text-[#2a2a3a] font-dm-sans mt-1.5">
//           Mínimo 8 caracteres com letras e números
//         </p>
//       )}
//     </div>
//   );
// }

import { clsx } from "clsx";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

// Definimos uma união dos atributos possíveis para input e textarea
type InputAttributes = InputHTMLAttributes<HTMLInputElement>;
type TextareaAttributes = TextareaHTMLAttributes<HTMLTextAreaElement>;

interface FieldInputProps extends Omit<
  InputAttributes & TextareaAttributes,
  "type" | "placeholder" | "disabled"
> {
  label: string;
  placeholder: string;
  type: "text" | "email" | "password" | "number" | "textarea";
  disabled?: boolean;
  error?: string;
  registration?: UseFormRegisterReturn;
  // Aceitamos props restantes que podem ser tanto de input quanto de textarea
  // Mas omitimos as que já declaramos explicitamente para evitar conflito
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
  const isTextarea = type === "textarea";

  // Classes base compartilhadas entre input e textarea
  const baseClassName = clsx(
    "w-full bg-white/3 rounded-xl px-4 py-3.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors duration-200 placeholder:text-[#252535]",
    error
      ? "border border-red-500/70 focus:border-red-600"
      : "border border-white/7 focus:border-[rgba(124,92,252,0.4)]",
  );

  return (
    <div className="flex flex-col gap-1">
      <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium tracking-[0.5px]">
        {label}
      </label>

      {isTextarea ? (
        <textarea
          placeholder={placeholder}
          className={clsx(baseClassName, "resize-y min-h-[100]")} // altura mínima e redimensionamento vertical
          disabled={disabled}
          {...rest}
          {...registration}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={baseClassName}
          disabled={disabled}
          {...rest}
          {...registration}
        />
      )}

      {/* Mensagem de erro */}
      {error && (
        <p className="text-xs text-red-400 font-dm-sans mt-1">{error}</p>
      )}

      {/* Dica de senha (apenas para password) */}
      {isPasswordType && !error && (
        <p className="text-[10px] text-[#2a2a3a] font-dm-sans mt-1.5">
          Mínimo 8 caracteres com letras e números
        </p>
      )}
    </div>
  );
}
