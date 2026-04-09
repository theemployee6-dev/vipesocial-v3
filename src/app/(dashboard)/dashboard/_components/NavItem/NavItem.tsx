export default function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-2.5 text-sm font-dm-sans transition-all text-left"
      style={{
        paddingLeft: active ? "16px" : "18px",
        paddingRight: "12px",
        borderRadius: "8px",
        fontWeight: active ? 600 : 400,
        color: active ? "#FFFFFF" : "#5A5A5A",
        background: active ? "rgba(254,44,85,0.07)" : "transparent",
        borderLeft: active ? "2px solid #FE2C55" : "2px solid transparent",
        cursor: "pointer",
      }}
    >
      <span style={{ color: active ? "#FE2C55" : "#5A5A5A", flexShrink: 0 }}>
        {icon}
      </span>
      {label}
    </button>
  );
}
