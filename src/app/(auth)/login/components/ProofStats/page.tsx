import React from "react";

const ProofStatsComponent = () => {
  return (
    <>
      {/* Proof stats — empilha em mobile, horizontal em telas maiores */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-8 z-10 relative">
        <div className="flex items-center gap-1.5 text-xs text-[#2a2a3a] font-dm-sans">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] opacity-50" />
          +2.400 criadores ativos
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#2a2a3a] font-dm-sans">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] opacity-50" />5
          roteiros por análise
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#2a2a3a] font-dm-sans">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] opacity-50" />
          98% de satisfação
        </div>
      </div>
    </>
  );
};

export default ProofStatsComponent;
