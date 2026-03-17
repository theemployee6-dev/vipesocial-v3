import Link from "next/link";
import React from "react";

const RememberAndForgotComponent = () => {
  return (
    <>
      {/* Row: remember + forgot */}
      <div className="flex items-center justify-between my-1.5 mb-4">
        <label className="flex items-center gap-1.5 text-xs text-[#3a3a52] cursor-pointer font-dm-sans">
          <div className="w-[15] h-[15] border border-[#252535] rounded bg-white/2 shrink-0" />
          Lembrar de mim
        </label>
        <Link
          href="/recuperar-senha"
          className="text-xs text-[#5a5a78] no-underline cursor-pointer hover:opacity-80 font-dm-sans"
        >
          Esqueci a senha
        </Link>
      </div>
    </>
  );
};

export default RememberAndForgotComponent;
