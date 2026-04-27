import { LayoutDashboard, BarChart2, FileText, Star, User } from "lucide-react";

export const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  { href: "/analises", label: "Análises", icon: <BarChart2 size={16} /> },
  { href: "/roteiros", label: "Roteiros", icon: <FileText size={16} /> },
  { href: "/planos", label: "Planos", icon: <Star size={16} /> },
  { href: "/perfil", label: "Perfil", icon: <User size={16} /> },
] as const;
