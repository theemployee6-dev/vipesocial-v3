// import clsx from "clsx";

// interface MainButtonProps {
//   title: string;
//   onClick?: () => void;
//   disabled?: boolean;
// }

// const MainButton = ({ title, onClick, disabled }: MainButtonProps) => {
//   return (
//     <>
//       {/* Main Button */}
//       <div className="relative mb-5">
//         <button
//           type="submit"
//           className={clsx(
//             "relative w-full rounded-xl py-3.5 text-sm font-bold text-white overflow-hidden tracking-[0.3px]",
//             disabled
//               ? "bg-gray-500 transition-all duration-500"
//               : "bg-linear-to-br from-[#7c5cfc] via-[#6040e0] to-[#5030d0]",
//           )}
//           onClick={onClick}
//           disabled={disabled}
//         >
//           <span
//             className="absolute bottom-0 left-1/4 right-1/4 h-px pointer-events-none"
//             style={{
//               background:
//                 "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
//             }}
//           />
//           {title}
//         </button>
//       </div>
//     </>
//   );
// };

// export default MainButton;

interface MainButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function MainButton({
  title,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: MainButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-linear-to-b from-white/10 to-transparent bg-[#fe2c55] text-white font-bold py-3.5 rounded-6 transition-all hover:brightness-110 active:scale-98 shadow-lg shadow-[#fe2c55]/10 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {title}
    </button>
  );
}
