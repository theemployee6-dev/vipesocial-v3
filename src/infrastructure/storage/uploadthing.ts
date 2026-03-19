import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createServerSupabaseClient } from "@/infrastructure/supabase/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Rota de upload de vídeo viral para análise.
  // Só aceita vídeos de até 512MB.
  // Só usuários autenticados podem fazer upload.
  videoUploader: f({
    video: {
      maxFileSize: "512MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Verifica se o usuário está autenticado antes
      // de permitir qualquer upload.
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Não autorizado");
      }

      // O que retornar aqui fica disponível no onUploadComplete
      // como metadata. Passamos o userId para salvar no banco.
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Esse callback roda no servidor após o upload terminar.
      // Por enquanto só logamos — a lógica de salvar no banco
      // vai acontecer no fluxo de análise.
      console.log("Upload completo para usuário:", metadata.userId);
      console.log("URL do arquivo:", file.url);

      // Retornamos a URL e o userId para o cliente
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
        size: file.size,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
