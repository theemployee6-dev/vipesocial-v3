"use client";

import Link from "next/link";
import { useState } from "react";

interface RememberAndForgotComponentProps {
  /** Callback opcional quando o estado do checkbox muda */
  onRememberChange?: (checked: boolean) => void;
  /** Href para o link "Esqueceu a senha?" */
  forgotHref?: string;
  /** Label do link (padrão: "Esqueceu a senha?") */
  forgotLabel?: string;
  /** Label do checkbox (padrão: "Lembrar de mim") */
  rememberLabel?: string;
}

export default function RememberAndForgotComponent({
  onRememberChange,
  forgotHref = "/recuperar-senha",
  forgotLabel = "Esqueceu a senha?",
  rememberLabel = "Lembrar de mim",
}: RememberAndForgotComponentProps) {
  const [remember, setRemember] = useState(false);

  const handleChange = (checked: boolean) => {
    setRemember(checked);
    onRememberChange?.(checked);
  };

  return (
    <div className="flex items-center justify-between">
      {/* Checkbox nativo com estilo TikTok */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember"
          checked={remember}
          onChange={(e) => handleChange(e.target.checked)}
          className="w-4 h-4 rounded-4 bg-[#1f1f1f] accent-[#fe2c55] border-none cursor-pointer"
        />
        <label
          htmlFor="remember"
          className="text-[#e6bcbd] text-sm cursor-pointer select-none"
        >
          {rememberLabel}
        </label>
      </div>

      {/* Link de recuperação de senha */}
      <Link
        href={forgotHref}
        className="text-[#fe2c55] text-[11px] font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
      >
        {forgotLabel}
      </Link>
    </div>
  );
}
