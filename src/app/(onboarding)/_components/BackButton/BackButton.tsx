interface BackButtonProps {
  title: string;
  onClick: () => void;
}

const BackButton = ({ title, onClick }: BackButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-1/3 rounded-6 py-3.5 text-sm font-medium text-[#e6bcbd] bg-transparent border border-white/10 hover:bg-white/5 transition-all"
    >
      {title}
    </button>
  );
};

export default BackButton;
