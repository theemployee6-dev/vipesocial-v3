// components/Sidebar.tsx
import Image from "next/image";
import clsx from "clsx";
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  Star,
  User,
  LogOut,
} from "lucide-react";
import { Profile } from "../../utils/types/dashboardTypes";
import NavItem from "../NavItem/NavItem";
import LogoComponent from "@/shared/components/LogoComponent/LogoComponent";
import { getInitials } from "../../utils/getInitials/getInitials";

// ========== Tipos ==========

interface SidebarProps {
  mobile?: boolean;
  profile: Profile | null;
  onLogout: () => void;
}

// ========== Componente Principal ==========
export function SidebarComponent({
  mobile = false,
  profile,
  onLogout,
}: SidebarProps) {
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
      {/* Logo */}
      <div className="w-[66%] px-2 mb-8">
        <LogoComponent />
      </div>

      {/* Navegação */}
      <nav className="flex flex-col gap-0.5 flex-1">
        <NavItem
          icon={<LayoutDashboard size={16} />}
          label="Dashboard"
          active
        />
        <NavItem
          icon={<BarChart2 size={16} />}
          label="Análises"
          onClick={() => {}}
        />
        <NavItem
          icon={<FileText size={16} />}
          label="Roteiros"
          onClick={() => {}}
        />
        <NavItem icon={<Star size={16} />} label="Planos" onClick={() => {}} />
        <NavItem icon={<User size={16} />} label="Perfil" onClick={() => {}} />
      </nav>

      {/* Perfil do usuário + logout */}
      <div
        className="mt-auto pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5 px-2 py-2">
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
          <div className="flex-1 min-w-0">
            <p
              className="font-dm-sans text-xs truncate"
              style={{ color: "#E6BCBD" }}
            >
              {profile?.full_name || "Usuário"}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="transition-colors"
            style={{ color: "#5A5A5A" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E6BCBD")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#5A5A5A")}
            title="Sair"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
