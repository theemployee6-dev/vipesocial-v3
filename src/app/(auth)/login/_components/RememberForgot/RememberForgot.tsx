"use client";

import Link from "next/link";
import { useState } from "react";

const RememberAndForgotComponent = () => {
  const [remember, setRemember] = useState(false);

  return (
    <div className="flex items-center justify-between my-1.5 mb-4">
      {/* Checkbox real com estado */}
      <label className="flex items-center gap-1.5 text-xs text-[#3a3a52] cursor-pointer font-dm-sans select-none">
        <div className="relative w-[15] h-[15] shrink-0">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="absolute opacity-0 w-full h-full cursor-pointer"
          />
          {/* Visual do checkbox */}
          <div
            className={`w-[15] h-[15] border rounded transition-colors ${
              remember
                ? "bg-[#7c5cfc] border-[#7c5cfc]"
                : "bg-white/2 border-[#252535]"
            }`}
          >
            {/* Checkmark aparece quando marcado */}
            {remember && (
              <svg
                className="absolute inset-0 m-auto"
                width="9"
                height="9"
                viewBox="0 0 10 8"
                fill="none"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
        Lembrar de mim
      </label>

      <Link
        href="/recuperar-senha"
        className="text-xs text-[#5a5a78] no-underline cursor-pointer hover:opacity-80 font-dm-sans"
      >
        Esqueci a senha
      </Link>
    </div>
  );
};

export default RememberAndForgotComponent;
