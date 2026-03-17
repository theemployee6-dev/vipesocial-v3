import React from "react";

const GlowLineComponent = () => {
  return (
    <>
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(124,92,252,0.6), rgba(200,140,40,0.4), transparent)",
        }}
      />
    </>
  );
};

export default GlowLineComponent;
