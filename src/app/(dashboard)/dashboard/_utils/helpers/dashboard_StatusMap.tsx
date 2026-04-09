import { Clock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export const STATUS_MAP: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Aguardando",
    color: "text-gray-500",
    icon: <Clock size={12} />,
  },
  processing_prompt1: {
    label: "Analisando vídeo",
    color: "text-rose-500",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  awaiting_niche_confirmation: {
    label: "Confirmar nicho",
    color: "text-amber-500",
    icon: <AlertCircle size={12} />,
  },
  processing_prompt2: {
    label: "Destilando emoções",
    color: "text-rose-500",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  processing_prompt3: {
    label: "Adaptando perfil",
    color: "text-rose-500",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  processing_prompt4: {
    label: "Gerando roteiros",
    color: "text-rose-500",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  completed: {
    label: "Concluída",
    color: "text-emerald-500",
    icon: <CheckCircle2 size={12} />,
  },
  failed: {
    label: "Falhou",
    color: "text-red-300",
    icon: <AlertCircle size={12} />,
  },
};
