// src/shared/components/FieldInput/FieldInput.tsx
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { clsx } from "clsx";

// Tipos suportados
type InputType = "text" | "email" | "password" | "number" | "textarea";

// Props do componente
interface FieldInputProps {
  label?: string;
  type?: InputType;
  placeholder?: string;
  registration?: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  underlineClassName?: string;
  showPasswordHint?: boolean;
  containerClassName?: string;
  // Aceita qualquer prop extra de input ou textarea, exceto 'type' e 'children'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function FieldInput({
  label,
  type = "text",
  placeholder,
  registration,
  error,
  disabled = false,
  className = "",
  labelClassName = "",
  underlineClassName = "",
  showPasswordHint = true,
  containerClassName = "",
  ...rest
}: FieldInputProps) {
  const isPassword = type === "password";
  const isTextarea = type === "textarea";

  const inputClassName = clsx(
    "w-full bg-[#1f1f1f] border-none rounded-[4px] px-4 py-3.5 text-white text-sm placeholder:text-[#555] focus:outline-none transition-all",
    className,
    {
      "resize-y min-h-[100px]": isTextarea,
    },
  );

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label
          className={`block text-[#e6bcbd] text-[11px] uppercase tracking-wider font-medium ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="group relative">
        {isTextarea ? (
          <textarea
            placeholder={placeholder}
            disabled={disabled}
            className={inputClassName}
            {...registration}
            {...rest}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClassName}
            {...registration}
            {...rest}
          />
        )}
        <div
          className={clsx(
            "absolute bottom-0 left-0 h-2 w-0 bg-[#fe2c55] transition-all duration-300 group-focus-within:w-full shadow-[0_0_8px_rgba(254,44,85,0.4)]",
            underlineClassName,
          )}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {isPassword && showPasswordHint && !error && (
        <p className="text-[10px] text-[#6b6b6b] mt-1.5">
          Mínimo 8 caracteres com letras e números
        </p>
      )}
    </div>
  );
}
