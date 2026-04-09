const Loading = () => {
  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#FE2C55"
            strokeWidth="2"
            strokeDasharray="32"
            strokeDashoffset="12"
          />
        </svg>
        <p className="font-dm-sans text-sm text-[#E6BCBD]">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;
