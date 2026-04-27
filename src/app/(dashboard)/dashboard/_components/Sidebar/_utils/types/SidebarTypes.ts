import { Profile } from "@/app/(dashboard)/dashboard/_utils/types/dashboardTypes";

export interface SidebarProps {
  mobile?: boolean;
  profile: Profile | null;
  onLogout: () => void;
}
