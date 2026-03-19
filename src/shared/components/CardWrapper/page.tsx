import React from "react";

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-5 py-8 sm:px-7 sm:py-9 md:px-9 md:py-10 border border-white/6"
        style={{
          background:
            "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 60%, #0a0a14 100%)",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default CardWrapper;
