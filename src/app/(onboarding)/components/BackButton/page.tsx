interface BackButtonProps {
  title: string;
  onClick: () => void;
}

const BackButton = ({ title, onClick }: BackButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-1/3 rounded-xl py-3.5 text-sm font-bold text-[#5a5a78] bg-white/3 border border-white/7"
    >
      {title}
    </button>
  );
};

export default BackButton;
