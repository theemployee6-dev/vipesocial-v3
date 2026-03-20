import { getGeminiModel } from "../GeminiClient";
import { z } from "zod";
import type { Prompt1Output } from "./prompt1";
import type { Prompt2Output } from "./prompt2";

const conceitoSchema = z.object({
  numero: z.number(),
  conceito_central: z.string(),
  emocao_ativada: z.string(),
  motivo_de_identificacao: z.string(),
  elemento_de_surpresa: z.string(),
  potencial_de_serie: z.string(),
  validacao_aprovada: z.boolean(),
  alerta_de_execucao: z.string(),
});

const prompt3OutputSchema = z.object({
  situacoes_mapeadas: z.array(z.string()),
  situacoes_aprovadas_apos_filtro: z.array(z.string()),
  conceitos_finais: z.array(conceitoSchema),
});

export type Prompt3Output = z.infer<typeof prompt3OutputSchema>;

interface RunPrompt3Params {
  prompt1Output: Prompt1Output;
  prompt2Output: Prompt2Output;
  nichoConfirmado: string;
  perfilCriador: {
    realidade_socioeconomica: string;
    idade: number;
    cidade: string;
  };
}

export async function runPrompt3({
  prompt1Output,
  prompt2Output,
  nichoConfirmado,
  perfilCriador,
}: RunPrompt3Params): Promise<{
  output: Prompt3Output;
  tokensUsed: number;
}> {
  const model = getGeminiModel();

  const prompt = `
Você é um estrategista de conteúdo com profundo conhecimento da cultura jovem brasileira.
Você recebeu a fórmula emocional de um vídeo viral e o perfil real do criador que vai replicar esse padrão.
Sua função é reconstruir o conceito emocional dentro da realidade desse criador específico.

FÓRMULA EMOCIONAL: ${prompt2Output.formula_emocional}
EMOÇÃO CENTRAL: ${JSON.stringify(prompt2Output.emocao_central)}
CADEIA EMOCIONAL: ${JSON.stringify(prompt2Output.cadeia_emocional)}
GATILHO DE AÇÃO: ${prompt2Output.gatilho_de_acao}
ALERTA DE REPLICAÇÃO: ${prompt2Output.alerta_de_replicacao}
HOOK: ${JSON.stringify(prompt1Output.hook)}
ESTRUTURA DE RETENÇÃO: ${JSON.stringify(prompt1Output.estrutura_de_retencao)}
NICHO CONFIRMADO: ${nichoConfirmado}

PERFIL DO CRIADOR:
- Realidade socioeconômica: ${perfilCriador.realidade_socioeconomica}
- Idade: ${perfilCriador.idade}
- Cidade: ${perfilCriador.cidade}

ETAPA 1 — LEITURA DO PERFIL: Internalize o que esse perfil significa na prática.
ETAPA 2 — MAPEAMENTO DE EQUIVALÊNCIAS EMOCIONAIS: Mapeie pelo menos 7 situações reais da vida desse criador.
ETAPA 3 — FILTRO CULTURAL E REGIONAL: Aplique o filtro de cidade, idade e realidade.
ETAPA 4 — SELEÇÃO DOS 5 CONCEITOS: Selecione os 5 mais fortes.
ETAPA 5 — VALIDAÇÃO FINAL: Valide cada conceito.
ETAPA 6 — ALERTA DE EXECUÇÃO: Um alerta por conceito.

IMPORTANTE: Responda APENAS com JSON válido:
{
  "situacoes_mapeadas": ["situação 1", "situação 2"],
  "situacoes_aprovadas_apos_filtro": ["situação 1"],
  "conceitos_finais": [
    {
      "numero": 1,
      "conceito_central": "texto",
      "emocao_ativada": "texto",
      "motivo_de_identificacao": "texto",
      "elemento_de_surpresa": "texto",
      "potencial_de_serie": "texto",
      "validacao_aprovada": true,
      "alerta_de_execucao": "texto"
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

  const parsed = JSON.parse(text);
  const validated = prompt3OutputSchema.parse(parsed);

  return { output: validated, tokensUsed };
}
