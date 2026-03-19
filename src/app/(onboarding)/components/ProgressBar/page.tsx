import React from "react";

const ProgressBar = ({ progressPercent }: { progressPercent: number }) => {
  return (
    <div className="w-full h-1 bg-white/5 rounded-full mb-8">
      <div
        className="h-1 rounded-full transition-all duration-500"
        style={{
          width: `${progressPercent}%`,
          background: "linear-gradient(90deg, #7c5cfc, #5a3de0)",
        }}
      />
    </div>
  );
};

export default ProgressBar;
