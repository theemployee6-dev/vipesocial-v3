export interface Analysis {
  id: string;
  status: string;
  confirmed_niche: string | null;
  created_at: string;
  processing_completed_at: string | null;
}

export interface Profile {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

export interface Stats {
  total: number;
  completed: number;
  scripts: number;
}
