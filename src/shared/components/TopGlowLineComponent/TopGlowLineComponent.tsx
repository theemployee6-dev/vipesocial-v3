const TopGlowLineComponent = () => {
  return (
    <>
      {/* Top glow line com nova cor de acento */}
      <div
        className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(254,44,85,0.6), rgba(254,44,85,0.2), transparent)",
        }}
      />
    </>
  );
};

export default TopGlowLineComponent;
