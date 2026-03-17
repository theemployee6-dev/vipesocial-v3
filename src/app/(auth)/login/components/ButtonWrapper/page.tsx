import React from "react";

const ButtonWrapper = () => {
  return (
    <>
      {/* Button wrapper */}
      <div className="relative mb-5">
        <button
          type="submit"
          className="relative w-full rounded-xl py-3.5 text-sm font-bold text-white overflow-hidden bg-linear-to-br from-[#7c5cfc] via-[#6040e0] to-[#5030d0] tracking-[0.3px]"
        >
          <span
            className="absolute bottom-0 left-1/4 right-1/4 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            }}
          />
          Entrar
        </button>
      </div>
    </>
  );
};

export default ButtonWrapper;
