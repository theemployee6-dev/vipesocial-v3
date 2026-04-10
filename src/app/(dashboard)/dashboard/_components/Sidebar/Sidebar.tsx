import clsx from "clsx";
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  Star,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getInitials } from "../../_utils/getInitials/getInitials";
import NavItem from "../NavItem/NavItem";
import { SidebarProps } from "./utils/types/SidebarTypes";
import Image from "next/image";
import LogoComponent from "@/shared/components/LogoComponent/LogoComponent";

export function SidebarComponent({
  mobile = false,
  profile,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    { href: "/analises", label: "Análises", icon: <BarChart2 size={16} /> },
    { href: "/roteiros", label: "Roteiros", icon: <FileText size={16} /> },
    { href: "/planos", label: "Planos", icon: <Star size={16} /> },
    { href: "/perfil", label: "Perfil", icon: <User size={16} /> },
  ];

  return (
    <aside
      className={clsx(
        "flex flex-col h-full",
        mobile ? "w-64 px-3 py-6" : "w-56 px-3 py-6 hidden lg:flex",
      )}
      style={{
        background: "#0E0E0E",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* logo */}
      <div className="flex items-center justify-center mb-4">
        <LogoComponent />
      </div>
      {/* bottom line */}
      <div className="w-full border-b border-gray-800 mb-3" />
      <nav>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label}>
              <NavItem icon={item.icon} label={item.label} active={isActive} />
            </Link>
          );
        })}
      </nav>
      {/* Perfil do usuário + logout (inalterado) */}
      <button
        onClick={onLogout}
        className="w-full text-left transition-all"
        style={{
          marginTop: "auto",
          paddingTop: "0.625rem",
          paddingBottom: "0.625rem",
          paddingLeft: "12px",
          paddingRight: "12px",
          borderRadius: "8px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(254,44,85,0.12)";
          e.currentTarget.style.borderLeft = "2px solid #FE2C55";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderLeft = "2px solid transparent";
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
            style={{
              background: "rgba(254,44,85,0.12)",
              border: "1px solid rgba(254,44,85,0.18)",
            }}
          >
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={28}
                height={28}
                className="rounded-lg object-cover"
              />
            ) : (
              <span
                className="text-[10px] font-bold font-syne"
                style={{ color: "#FE2C55" }}
              >
                {getInitials(profile?.full_name || null)}
              </span>
            )}
          </div>

          <div className="flex-1 flex items-center justify-between min-w-0">
            <span
              className="font-dm-sans text-xs truncate"
              style={{ color: "#E6BCBD" }}
            >
              {profile?.full_name || "Usuário"}
            </span>
            <LogOut size={14} style={{ color: "#5A5A5A" }} />
          </div>
        </div>
      </button>
    </aside>
  );
}
