import React from "react";

const Label = ({ title }: { title: string }) => {
  return (
    <label className="block font-dm-sans text-xs text-[#e6bcbd] font-medium mb-2">
      {title}
    </label>
  );
};

export default Label;
