import React from "react";

const PillComponent = () => {
  return (
    <>
      {/* Pill */}
      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 bg-[rgba(124,92,252,0.08)] border border-[rgba(124,92,252,0.15)]">
        <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc]" />
        <span className="text-[10px] sm:text-xs text-[#6a50c0] font-dm-sans">
          IA para criadores TikTok
        </span>
      </div>
    </>
  );
};

export default PillComponent;
