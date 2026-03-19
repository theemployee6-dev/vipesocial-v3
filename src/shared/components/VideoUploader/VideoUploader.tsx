import { useUploadThing } from "@/shared/utils/uploadthing";
import clsx from "clsx";
import { totalmem } from "os";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface VideoUploaderProps {
  onUploadComplete: (data: { url: string; name: string; size: number }) => void;
  onUploadError?: (error: Error) => void;
}

export function VideoUploader({
  onUploadComplete,
  onUploadError,
}: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { startUpload } = useUploadThing("videoUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setUploadProgress(100);

      if (res && res[0]) {
        toast.success("Vídeo enviado com sucesso");
        onUploadComplete({
          url: res[0].ufsUrl,
          name: res[0].name,
          size: res[0].size,
        });
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      setUploadProgress(0);
      toast.error("Erro ao enviar vídeo. Tente novamente.");
      onUploadError?.(error);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const handleFile = useCallback(
    async (file: File) => {
      // Valida se é um vídeo
      if (!file.type.startsWith("video/")) {
        toast.error("Apenas arquivos de vídeo são aceitos.");
        return;
      }

      // Valida tamanho máximo de 512MB
      const maxSize = 512 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Vídeo muito grande. Máximo de 512MB");
        return;
      }

      setFileName(file.name);
      setIsUploading(true);
      setUploadProgress(0);

      await startUpload([file]);
    },
    [startUpload],
  );
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) handleFile(file);
    },
    [handleFile],
  );
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={clsx(
        "relative w-full rounded-2xl border-2 border-dashed transition-all duration-200",
        isDragging
          ? "border-[#7c5cfc] bg-[rgba(124, 92,252,0.08)]"
          : "border-white/10 bg-white/2 hover:border-white/20",
      )}
    >
      <input
        type="file"
        accept="video/*"
        onChange={handleInputChange}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {!isUploading && !fileName && (
          <>
            {/* Ícone de vídeo */}
            <div className="w-14 h-14 rounded-2xl bg-[rgba(124,92,252,0.1)] border border-[rgba(124, 92,252,0.2)] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                  stroke="#7c5cfc"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="font-syne text-base font-semibold text-[#e8e8f8] mb-1">
              Arraste seu vídeo aqui
            </p>

            <p className="font-dm-sans text-sm text-[#3a3a55] mb-4">
              ou clique para selecionar
            </p>

            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[rgba(124, 92, 252,0.08)] border border-[rgba(124,92,252,0.15)]">
              <span className="text-[10px] text-[#6a50c0] font-dm-sans">
                MP4, MOV ou AVI • Máximo 512MB
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
