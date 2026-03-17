import React from "react";

const GlowsEffectComponent = () => {
  return (
    <>
      {/* Glows */}
      <div
        className="absolute w-[300] h-[300] sm:w-[400] sm:h-[400] md:w-[500] md:h-[500] rounded-full top-[-60] sm:top-[-80] left-1/2 translate-x-[-20%] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,252,0.18) 0%, rgba(124,92,252,0.06) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute w-[200] h-[200] sm:w-[250] sm:h-[250] md:w-[300] md:h-[300] rounded-full bottom-5 right-[10%] sm:right-[15%] md:right-[20%] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,140,40,0.12) 0%, rgba(200,140,40,0.04) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute w-[180] h-[180] sm:w-[200] sm:h-[200] md:w-[250] md:h-[250] rounded-full bottom-[40] sm:bottom-[50] md:bottom-[60] left-[8%] sm:left-[10%] md:left-[15%] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(80,120,255,0.10) 0%, transparent 70%)",
        }}
      />
    </>
  );
};

export default GlowsEffectComponent;
