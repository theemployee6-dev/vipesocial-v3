// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from "sonner";
// import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
// import { VideoUploader } from "@/shared/components/VideoUploader/VideoUploader";

// // Schema de validação das métricas
// const metricasSchema = z.object({
//   views: z
//     .number({ error: "Digite o número de views" })
//     .min(0, "Views não pode ser negativo"),
//   likes: z
//     .number({ error: "Digite o número de likes" })
//     .min(0, "Likes não pode ser negativo"),
//   comments: z
//     .number({ error: "Digite o número de comentários" })
//     .min(0, "Comentários não pode ser negativo"),
//   shares: z
//     .number({ error: "Digite o número de compartilhamentos" })
//     .min(0, "Compartilhamentos não pode ser negativo"),
//   saves: z
//     .number({ error: "Digite o número de salvamentos" })
//     .min(0, "Salvamentos não pode ser negativo"),
// });

// type MetricasFormData = z.infer<typeof metricasSchema>;

// export default function NovaAnalisePage() {
//   const router = useRouter();
//   const supabase = createClientSupabaseClient();

//   // Estado do vídeo uploadado
//   const [videoData, setVideoData] = useState<{
//     url: string;
//     name: string;
//     size: number;
//   } | null>(null);

//   const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<MetricasFormData>({
//     resolver: zodResolver(metricasSchema),
//     defaultValues: {
//       views: 0,
//       likes: 0,
//       comments: 0,
//       shares: 0,
//       saves: 0,
//     },
//   });

//   async function onSubmit(metricas: MetricasFormData) {
//     if (!videoData) {
//       toast.error("Envie o vídeo antes de continuar.");
//       return;
//     }

//     setIsStartingAnalysis(true);

//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         toast.error("Sessão expirada. Faça login novamente.");
//         router.push("/login");
//         return;
//       }

//       // Salva o vídeo no banco
//       const { data: videoRecord, error: videoError } = await supabase
//         .from("videos")
//         .insert({
//           user_id: user.id,
//           storage_path: videoData.url,
//           storage_bucket: "uploadthing",
//           original_filename: videoData.name,
//           file_size_bytes: videoData.size,
//           upload_status: "completed",
//           processing_status: "pending",
//           is_viral_reference: true,
//         })
//         .select()
//         .single();

//       if (videoError) {
//         console.error("Erro ao salvar vídeo:", videoError);
//         toast.error("Erro ao salvar vídeo. Tente novamente.");
//         return;
//       }

//       // Salva as métricas do vídeo
//       const { error: metricasError } = await supabase
//         .from("video_metrics")
//         .insert({
//           video_id: videoRecord.id,
//           views: metricas.views,
//           likes: metricas.likes,
//           comments: metricas.comments,
//           shares: metricas.shares,
//           saves: metricas.saves,
//           source: "manual_input",
//         });

//       if (metricasError) {
//         console.error("Erro ao salvar métricas:", metricasError);
//         toast.error("Erro ao salvar métricas. Tente novamente.");
//         return;
//       }

//       // Cria o registro da análise no banco
//       const { data: analysisRecord, error: analysisError } = await supabase
//         .from("analyses")
//         .insert({
//           user_id: user.id,
//           video_id: videoRecord.id,
//           analysis_type: "viral_video",
//           status: "pending",
//           current_step: 0,
//         })
//         .select()
//         .single();

//       if (analysisError) {
//         console.error("Erro ao criar análise:", analysisError);
//         toast.error("Erro ao iniciar análise. Tente novamente.");
//         return;
//       }

//       toast.success("Análise iniciada! Processando seu vídeo...");

//       // Redireciona para a página de processamento
//       router.push(`/analise/${analysisRecord.id}`);
//     } catch {
//       toast.error("Algo deu errado. Tente novamente.");
//     } finally {
//       setIsStartingAnalysis(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#080810] px-4 py-8 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.push("/dashboard")}
//             className="flex items-center gap-1.5 text-xs text-[#3a3a50] hover:text-[#6a6a90] transition-colors font-dm-sans mb-6"
//           >
//             <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//               <path
//                 d="M10 3L5 8L10 13"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             Voltar
//           </button>

//           <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 bg-[rgba(124,92,252,0.08)] border border-[rgba(124,92,252,0.15)]">
//             <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc]" />
//             <span className="text-[10px] text-[#6a50c0] font-dm-sans">
//               Nova análise
//             </span>
//           </div>

//           <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#e8e8f8] mb-2">
//             Qual vídeo viralizou?
//           </h1>
//           <p className="font-dm-sans text-sm text-[#3a3a55]">
//             Sobe o vídeo que bombou e as métricas do TikTok. A IA vai descobrir
//             por que funcionou e criar 5 roteiros novos para você.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
//           {/* Seção 1 — Upload do vídeo */}
//           <div
//             className="rounded-2xl p-6 border border-white/6"
//             style={{
//               background:
//                 "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 60%, #0a0a14 100%)",
//             }}
//           >
//             <h2 className="font-syne text-base font-semibold text-[#e8e8f8] mb-1">
//               1. Sobe o vídeo
//             </h2>
//             <p className="font-dm-sans text-xs text-[#3a3a55] mb-4">
//               O mesmo vídeo que você postou no TikTok.
//             </p>

//             <VideoUploader
//               onUploadComplete={(data) => setVideoData(data)}
//               onUploadError={() => setVideoData(null)}
//             />
//           </div>

//           {/* Seção 2 — Métricas */}
//           <div
//             className="rounded-2xl p-6 border border-white/6"
//             style={{
//               background:
//                 "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 60%, #0a0a14 100%)",
//             }}
//           >
//             <h2 className="font-syne text-base font-semibold text-[#e8e8f8] mb-1">
//               2. Métricas do TikTok
//             </h2>
//             <p className="font-dm-sans text-xs text-[#3a3a55] mb-4">
//               Abre o vídeo no TikTok, clica nos três pontos e vê as métricas.
//             </p>

//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//               {/* Views */}
//               <div>
//                 <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5">
//                   👁 Visualizações
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   {...register("views", { valueAsNumber: true })}
//                   className="w-full bg-white/3 border border-white/7 rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
//                 />
//                 {errors.views && (
//                   <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
//                     {errors.views.message}
//                   </p>
//                 )}
//               </div>

//               {/* Likes */}
//               <div>
//                 <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5">
//                   ❤️ Curtidas
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   {...register("likes", { valueAsNumber: true })}
//                   className="w-full bg-white/3 border border-white/7 rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
//                 />
//                 {errors.likes && (
//                   <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
//                     {errors.likes.message}
//                   </p>
//                 )}
//               </div>

//               {/* Comments */}
//               <div>
//                 <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5">
//                   💬 Comentários
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   {...register("comments", { valueAsNumber: true })}
//                   className="w-full bg-white/3 border border-white/7 rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
//                 />
//                 {errors.comments && (
//                   <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
//                     {errors.comments.message}
//                   </p>
//                 )}
//               </div>

//               {/* Shares */}
//               <div>
//                 <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5">
//                   🔁 Compartilhamentos
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   {...register("shares", { valueAsNumber: true })}
//                   className="w-full bg-white/3 border border-white/7 rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
//                 />
//                 {errors.shares && (
//                   <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
//                     {errors.shares.message}
//                   </p>
//                 )}
//               </div>

//               {/* Saves */}
//               <div>
//                 <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5">
//                   🔖 Salvamentos
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   {...register("saves", { valueAsNumber: true })}
//                   className="w-full bg-white/3 border border-white/7 rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
//                 />
//                 {errors.saves && (
//                   <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
//                     {errors.saves.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Botão de submit */}
//           <button
//             type="submit"
//             disabled={!videoData || isStartingAnalysis}
//             className="relative w-full rounded-xl py-4 text-sm font-bold text-white bg-linear-to-br from-[#7c5cfc] via-[#6040e0] to-[#5030d0] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
//           >
//             {isStartingAnalysis ? "Iniciando análise..." : "Analisar vídeo →"}
//           </button>

//           {!videoData && (
//             <p className="text-center text-xs text-[#252535] font-dm-sans -mt-4">
//               Envie o vídeo para habilitar a análise
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClientSupabaseClient } from "@/infrastructure/supabase/client";
import { VideoUploader } from "@/shared/components/VideoUploader/VideoUploader";

// Schema de validação das métricas
const metricasSchema = z.object({
  views: z
    .number({ error: "Digite o número de views" })
    .min(0, "Views não pode ser negativo"),
  likes: z
    .number({ error: "Digite o número de likes" })
    .min(0, "Likes não pode ser negativo"),
  comments: z
    .number({ error: "Digite o número de comentários" })
    .min(0, "Comentários não pode ser negativo"),
  shares: z
    .number({ error: "Digite o número de compartilhamentos" })
    .min(0, "Compartilhamentos não pode ser negativo"),
  saves: z
    .number({ error: "Digite o número de salvamentos" })
    .min(0, "Salvamentos não pode ser negativo"),
});

type MetricasFormData = z.infer<typeof metricasSchema>;

export default function NovaAnalisePage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [videoData, setVideoData] = useState<{
    url: string;
    name: string;
    size: number;
  } | null>(null);

  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MetricasFormData>({
    resolver: zodResolver(metricasSchema),
    defaultValues: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
    },
  });

  async function onSubmit(metricas: MetricasFormData) {
    if (!videoData) {
      toast.error("Envie o vídeo antes de continuar.");
      return;
    }

    setIsStartingAnalysis(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Sessão expirada. Faça login novamente.");
        router.push("/login");
        return;
      }

      const { data: videoRecord, error: videoError } = await supabase
        .from("videos")
        .insert({
          user_id: user.id,
          storage_path: videoData.url,
          storage_bucket: "uploadthing",
          original_filename: videoData.name,
          file_size_bytes: videoData.size,
          upload_status: "completed",
          processing_status: "pending",
          is_viral_reference: true,
        })
        .select()
        .single();

      if (videoError) {
        console.error("Erro ao salvar vídeo:", videoError);
        toast.error("Erro ao salvar vídeo. Tente novamente.");
        return;
      }

      const { error: metricasError } = await supabase
        .from("video_metrics")
        .insert({
          video_id: videoRecord.id,
          views: metricas.views,
          likes: metricas.likes,
          comments: metricas.comments,
          shares: metricas.shares,
          saves: metricas.saves,
          source: "manual_input",
        });

      if (metricasError) {
        console.error("Erro ao salvar métricas:", metricasError);
        toast.error("Erro ao salvar métricas. Tente novamente.");
        return;
      }

      const { data: analysisRecord, error: analysisError } = await supabase
        .from("analyses")
        .insert({
          user_id: user.id,
          video_id: videoRecord.id,
          analysis_type: "viral_video",
          status: "pending",
          current_step: 0,
        })
        .select()
        .single();

      if (analysisError) {
        console.error("Erro ao criar análise:", analysisError);
        toast.error("Erro ao iniciar análise. Tente novamente.");
        return;
      }

      toast.success("Análise iniciada! Processando seu vídeo...");
      router.push(`/analise/${analysisRecord.id}`);
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setIsStartingAnalysis(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080810] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
      {/* Container principal com largura máxima responsiva */}
      <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-[#3a3a50] hover:text-[#6a6a90] transition-colors font-dm-sans mb-4 sm:mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Voltar
          </button>

          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 bg-[rgba(124,92,252,0.08)] border border-[rgba(124,92,252,0.15)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc]" />
            <span className="text-[10px] sm:text-xs text-[#6a50c0] font-dm-sans">
              Nova análise
            </span>
          </div>

          <h1 className="font-syne text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8f8] mb-2 leading-tight">
            Qual vídeo viralizou?
          </h1>
          <p className="font-dm-sans text-sm sm:text-base text-[#3a3a55] max-w-xl lg:max-w-2xl">
            Sobe o vídeo que bombou e as métricas do TikTok. A IA vai descobrir
            por que funcionou e criar 5 roteiros novos para você.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 sm:gap-8"
        >
          {/* Seção 1 — Upload do vídeo */}
          <div
            className="rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/6"
            style={{
              background:
                "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 60%, #0a0a14 100%)",
            }}
          >
            <h2 className="font-syne text-base sm:text-lg font-semibold text-[#e8e8f8] mb-1">
              1. Sobe o vídeo
            </h2>
            <p className="font-dm-sans text-xs sm:text-sm text-[#3a3a55] mb-4 sm:mb-5">
              O mesmo vídeo que você postou no TikTok.
            </p>

            <VideoUploader
              onUploadComplete={(data) => setVideoData(data)}
              onUploadError={() => setVideoData(null)}
            />
          </div>

          {/* Seção 2 — Métricas */}
          <div
            className="rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/6"
            style={{
              background:
                "linear-gradient(145deg, #0f0f1a 0%, #0c0c16 60%, #0a0a14 100%)",
            }}
          >
            <h2 className="font-syne text-base sm:text-lg font-semibold text-[#e8e8f8] mb-1">
              2. Métricas do TikTok
            </h2>
            <p className="font-dm-sans text-xs sm:text-sm text-[#3a3a55] mb-4 sm:mb-5">
              Abre o vídeo no TikTok, clica nos três pontos e vê as métricas.
            </p>

            {/* Grid responsivo: 1 col em telas muito pequenas, 2 col em sm, 3 col em md, 4 col em lg, 5 col em xl (ideal para 5 itens) */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Views */}
              <div>
                <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 truncate">
                  👁 Visualizações
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("views", { valueAsNumber: true })}
                  className="w-full bg-white/3 border border-white/7 rounded-lg sm:rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
                />
                {errors.views && (
                  <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
                    {errors.views.message}
                  </p>
                )}
              </div>

              {/* Likes */}
              <div>
                <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 truncate">
                  ❤️ Curtidas
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("likes", { valueAsNumber: true })}
                  className="w-full bg-white/3 border border-white/7 rounded-lg sm:rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
                />
                {errors.likes && (
                  <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
                    {errors.likes.message}
                  </p>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 truncate">
                  💬 Comentários
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("comments", { valueAsNumber: true })}
                  className="w-full bg-white/3 border border-white/7 rounded-lg sm:rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
                />
                {errors.comments && (
                  <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
                    {errors.comments.message}
                  </p>
                )}
              </div>

              {/* Shares */}
              <div>
                <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 truncate">
                  🔁 Compartilhamentos
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("shares", { valueAsNumber: true })}
                  className="w-full bg-white/3 border border-white/7 rounded-lg sm:rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
                />
                {errors.shares && (
                  <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
                    {errors.shares.message}
                  </p>
                )}
              </div>

              {/* Saves */}
              <div>
                <label className="block font-dm-sans text-xs text-[#5a5a78] font-medium mb-1.5 truncate">
                  🔖 Salvamentos
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("saves", { valueAsNumber: true })}
                  className="w-full bg-white/3 border border-white/7 rounded-lg sm:rounded-xl px-3 py-2.5 text-sm text-[#c8c8e8] font-dm-sans outline-none transition-colors placeholder:text-[#252535] focus:border-[rgba(124,92,252,0.4)]"
                />
                {errors.saves && (
                  <p className="text-[10px] text-red-400 mt-1 font-dm-sans">
                    {errors.saves.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={!videoData || isStartingAnalysis}
            className="relative w-full rounded-lg sm:rounded-xl py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white bg-linear-to-br from-[#7c5cfc] via-[#6040e0] to-[#5030d0] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {isStartingAnalysis ? "Iniciando análise..." : "Analisar vídeo →"}
          </button>

          {!videoData && (
            <p className="text-center text-xs text-[#252535] font-dm-sans -mt-4">
              Envie o vídeo para habilitar a análise
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
