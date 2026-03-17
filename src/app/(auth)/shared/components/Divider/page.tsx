import React from "react";

const DividerComponent = () => {
  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-[#252535] tracking-[1px] font-dm-sans">
          OU
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>
    </>
  );
};

export default DividerComponent;
