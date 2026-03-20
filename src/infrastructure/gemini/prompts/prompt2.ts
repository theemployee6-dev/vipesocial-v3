import { getGeminiModel } from "../GeminiClient";
import { z } from "zod";
import type { Prompt1Output } from "./prompt1";

const prompt2OutputSchema = z.object({
  cadeia_emocional: z.object({
    emocao_de_entrada: z.string(),
    emocao_de_desenvolvimento: z.string(),
    emocao_de_saida: z.string(),
  }),
  emocao_central: z.object({
    nome: z.string(),
    justificativa: z.string(),
  }),
  gatilho_de_acao: z.string(),
  formula_emocional: z.string(),
  alerta_de_replicacao: z.string(),
});

export type Prompt2Output = z.infer<typeof prompt2OutputSchema>;

interface RunPrompt2Params {
  prompt1Output: Prompt1Output;
  nichoConfirmado: string;
}

export async function runPrompt2({
  prompt1Output,
  nichoConfirmado,
}: RunPrompt2Params): Promise<{
  output: Prompt2Output;
  tokensUsed: number;
}> {
  const model = getGeminiModel();

  const prompt = `
Você é um especialista em psicologia de conteúdo viral.
Você recebeu a análise estrutural e emocional de um vídeo que viralizou no TikTok.
Sua única função agora é destilar tudo isso em uma única verdade emocional central.

ANÁLISE DO PROMPT 1:
${JSON.stringify(prompt1Output, null, 2)}

NICHO CONFIRMADO: ${nichoConfirmado}

ETAPA 1 — MAPEAMENTO EMOCIONAL COMPLETO:
Identifique a emoção de entrada, de desenvolvimento e de saída.

ETAPA 2 — IDENTIFICAÇÃO DA EMOÇÃO CENTRAL:
Escolha apenas uma entre: conquista inesperada, revolta justificada, identificação profunda, surpresa genuína, aspiração acessível, medo de estar perdendo algo, vergonha transformada em orgulho, pertencimento, curiosidade irresistível.

ETAPA 3 — GATILHO DE AÇÃO:
Escolha entre: mandou para alguém específico porque se identificou, comentou para concordar ou discordar publicamente, salvou para rever depois, assistiu de novo imediatamente, foi ao perfil do criador para ver mais conteúdo, sentiu vontade de criar um vídeo parecido.

ETAPA 4 — FÓRMULA EMOCIONAL:
Formato exato: "O vídeo viralizou porque ativou [EMOÇÃO CENTRAL] através de [MECANISMO ESTRUTURAL] gerando no espectador a vontade de [GATILHO DE AÇÃO]."

ETAPA 5 — ALERTA DE REPLICAÇÃO:
Um único risco principal que alguém que tentar replicar esse padrão provavelmente vai cometer.

IMPORTANTE: Responda APENAS com JSON válido no formato abaixo:
{
  "cadeia_emocional": {
    "emocao_de_entrada": "texto",
    "emocao_de_desenvolvimento": "texto",
    "emocao_de_saida": "texto"
  },
  "emocao_central": {
    "nome": "texto",
    "justificativa": "texto"
  },
  "gatilho_de_acao": "texto",
  "formula_emocional": "texto",
  "alerta_de_replicacao": "texto"
}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

  const parsed = JSON.parse(text);
  const validated = prompt2OutputSchema.parse(parsed);

  return { output: validated, tokensUsed };
}
