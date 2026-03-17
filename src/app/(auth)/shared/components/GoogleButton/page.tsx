import React from "react";
import { GoogleIcon } from "./components/GoogleIcon";

const GoogleButtonComponent = ({ title }: { title: string }) => {
  return (
    <>
      {/* Google button */}
      <button
        type="button"
        className="w-full bg-white/3 border border-white/7 rounded-xl py-3 text-sm text-[#5a5a78] flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 mb-6 sm:mb-7 font-dm-sans"
      >
        <GoogleIcon />
        {title}
      </button>
    </>
  );
};

export default GoogleButtonComponent;
