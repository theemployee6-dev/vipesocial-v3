import Link from "next/link";
import React from "react";

const FooterComponent = () => {
  return (
    <>
      {/* Footer */}
      <p className="text-sm text-[#3a3a52] text-center font-dm-sans">
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          className="text-[#7c5cfc] font-medium no-underline"
        >
          Criar conta grátis
        </Link>
      </p>
    </>
  );
};

export default FooterComponent;
