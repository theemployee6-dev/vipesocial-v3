import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa o cliente do Gemini com a chave de API.
// Esse cliente é reutilizado em todos os prompts.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Modelo que vamos usar.
// gemini-1.5-pro aceita vídeo diretamente como input.
export function getGeminiModel() {
  return genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
      // Temperatura 0.7 — criativo mas consistente.
      // Valores mais altos geram outputs mais variados
      // mas menos previsíveis para análise estruturada.
      temperature: 0.7,
      // Força o output em JSON para facilitar o parsing.
      responseMimeType: "application/json",
    },
  });
}

// Função auxiliar para buscar um vídeo por URL
// e converter para o formato que o Gemini aceita.
export async function fetchVideoAsBase64(url: string): Promise<{
  inlineData: {
    data: string;
    mimeType: string;
  };
}> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  // Detecta o tipo do arquivo pela URL
  const mimeType = url.includes(".mp4")
    ? "video/mp4"
    : url.includes(".mov")
      ? "video/quicktime"
      : "video/mp4";

  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
}
