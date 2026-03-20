import { getGeminiModel, fetchVideoAsBase64 } from "../GeminiClient";
import { z } from "zod";

// Schema de validação do output do Prompt 1
const prompt1OutputSchema = z.object({
  sinal_dominante_das_metricas: z.string(),
  hook: z.object({
    tipo: z.string(),
    intensidade: z.string(),
    explicacao: z.string(),
  }),
  estrutura_de_retencao: z.object({
    micro_recompensas: z.string(),
    loop_aberto: z.string(),
    ponto_de_maior_tensao: z.string(),
    quebra_de_previsibilidade: z.string(),
  }),
  dna_emocional_puro: z.object({
    emocao_dominante: z.string(),
    explicacao: z.string(),
  }),
  nicho_inferido: z.string(),
  confirmacao_necessaria: z.boolean(),
});

export type Prompt1Output = z.infer<typeof prompt1OutputSchema>;

interface RunPrompt1Params {
  videoUrl: string;
  metricas: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
}

export async function runPrompt1({
  videoUrl,
  metricas,
}: RunPrompt1Params): Promise<{
  output: Prompt1Output;
  tokensUsed: number;
}> {
  const model = getGeminiModel();

  // Busca o vídeo e converte para base64
  const videoPart = await fetchVideoAsBase64(videoUrl);

  const prompt = `
Você é um analisador estrutural de conteúdo viral. Você recebeu um vídeo e suas métricas do TikTok.
Sua única função agora é extrair o padrão emocional e estrutural que explica por que esse conteúdo performou dessa forma.

MÉTRICAS DO VÍDEO:
- Views: ${metricas.views}
- Likes: ${metricas.likes}
- Comentários: ${metricas.comments}
- Compartilhamentos: ${metricas.shares}
- Salvamentos: ${metricas.saves}

ETAPA 1 — LEITURA DE MÉTRICAS:
Analise os números fornecidos e determine o sinal dominante.
- Shares muito altos indicam identificação profunda ou conteúdo que as pessoas querem mostrar para alguém específico.
- Comentários muito altos indicam que o vídeo gerou opinião, polêmica ou emoção que precisava ser verbalizada.
- Replay alto indica que o hook foi irresistível ou que o conteúdo tem algum elemento que as pessoas querem rever.
- Likes altos com shares baixos indicam aprovação passiva sem identificação profunda.

ETAPA 2 — ANÁLISE DO HOOK (0 a 3 segundos):
Assista apenas os primeiros 3 segundos e responda: o que acontece que impede o dedo de rolar a tela?
Classifique o tipo do hook entre: pergunta sem resposta imediata, afirmação que gera incredulidade, situação que quebra o esperado, elemento visual fora do comum, promessa explícita de recompensa, conflito imediato, silêncio ou ausência proposital.
Descreva a intensidade emocional do hook de 0 a 10.

ETAPA 3 — ESTRUTURA DE RETENÇÃO:
Analise como o vídeo sustenta a atenção do início ao fim.
Identifique micro recompensas, loop aberto, ponto de maior tensão e quebra de previsibilidade.

ETAPA 4 — DNA EMOCIONAL PURO:
Qual é a emoção que esse vídeo ativa no espectador?
Escolha entre: conquista inesperada, revolta justificada, identificação profunda, surpresa genuína, aspiração acessível, medo de estar perdendo algo, vergonha transformada em orgulho, pertencimento, curiosidade irresistível.

ETAPA 5 — INFERÊNCIA DE NICHO:
Os nichos possíveis são: humor, finanças e dinheiro, relacionamento e amor, motivação e superação, lifestyle e rotina, beleza e autocuidado, saúde e corpo, educação e conhecimento, fé e espiritualidade, empreendedorismo, tecnologia, cultura e identidade brasileira.

IMPORTANTE: Responda APENAS com JSON válido no formato abaixo, sem texto adicional:
{
  "sinal_dominante_das_metricas": "texto",
  "hook": {
    "tipo": "texto",
    "intensidade": "0-10",
    "explicacao": "texto"
  },
  "estrutura_de_retencao": {
    "micro_recompensas": "texto",
    "loop_aberto": "texto",
    "ponto_de_maior_tensao": "texto",
    "quebra_de_previsibilidade": "texto"
  },
  "dna_emocional_puro": {
    "emocao_dominante": "texto",
    "explicacao": "texto"
  },
  "nicho_inferido": "texto",
  "confirmacao_necessaria": true
}
`;

  const result = await model.generateContent([prompt, videoPart]);
  const response = result.response;
  const text = response.text();
  const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

  // Parse e valida o JSON retornado pelo Gemini
  const parsed = JSON.parse(text);
  const validated = prompt1OutputSchema.parse(parsed);

  return {
    output: validated,
    tokensUsed,
  };
}
