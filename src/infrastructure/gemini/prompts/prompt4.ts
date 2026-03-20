import { getGeminiModel } from "../GeminiClient";
import { z } from "zod";
import type { Prompt1Output } from "./prompt1";
import type { Prompt2Output } from "./prompt2";
import type { Prompt3Output } from "./prompt3";

const intervalSchema = z.object({
  fala_exata: z.string(),
  tom_de_voz: z.string(),
  intensidade_emocional: z.string(),
  expressao_facial: z.string(),
  movimento_corporal: z.string(),
  direcao_do_olhar: z.string(),
  objetivo_desse_momento: z.string(),
});

const roteirSchema = z.object({
  numero: z.number(),
  cabecalho: z.object({
    titulo: z.string(),
    objetivo_emocional: z.string(),
    duracao_alvo: z.string(),
    melhor_horario_para_postar: z.object({
      horario: z.string(),
      justificativa: z.string(),
    }),
    sugestao_de_legenda: z.string(),
    hashtags: z.array(z.string()),
  }),
  cenario: z.object({
    onde_gravar: z.string(),
    horario_de_gravacao: z.string(),
    tipo_de_luz: z.string(),
    o_que_deve_aparecer_no_fundo: z.string(),
    o_que_nao_deve_aparecer_no_fundo: z.string(),
  }),
  setup_de_gravacao: z.object({
    orientacao: z.string(),
    altura_do_celular: z.string(),
    distancia_do_rosto: z.string(),
    posicao_do_corpo: z.string(),
    onde_apoiar_o_celular: z.string(),
    como_segurar_se_for_na_mao: z.string(),
  }),
  vestimenta: z.object({
    peca: z.string(),
    cor: z.string(),
    tecido: z.string(),
    caimento: z.string(),
    aparencia_realista: z.string(),
  }),
  roteiro_cronologico: z.object({
    "0_a_3s": intervalSchema,
    "4_a_15s": intervalSchema,
    "16_a_35s": intervalSchema,
    "36_a_55s": intervalSchema,
    "56_a_75s": intervalSchema,
  }),
  edicao: z.object({
    onde_cortar: z.string(),
    onde_acelerar: z.string(),
    onde_inserir_legenda: z.string(),
    onde_usar_silencio: z.string(),
    musica_de_fundo: z.string(),
    onde_fazer_corte_seco: z.string(),
  }),
  elementos_estrategicos: z.object({
    ponto_de_maior_tensao: z.string(),
    quebra_de_expectativa: z.string(),
    loop_de_retencao: z.string(),
    cta_invisivel: z.string(),
  }),
  erros_fatais: z.array(z.string()),
});

const prompt4OutputSchema = z.object({
  roteiros: z.array(roteirSchema),
});

export type Prompt4Output = z.infer<typeof prompt4OutputSchema>;

interface RunPrompt4Params {
  prompt1Output: Prompt1Output;
  prompt2Output: Prompt2Output;
  prompt3Output: Prompt3Output;
  nichoConfirmado: string;
  perfilCriador: {
    realidade_socioeconomica: string;
    idade: number;
    cidade: string;
  };
}

export async function runPrompt4({
  prompt1Output,
  prompt2Output,
  prompt3Output,
  nichoConfirmado,
  perfilCriador,
}: RunPrompt4Params): Promise<{
  output: Prompt4Output;
  tokensUsed: number;
}> {
  const model = getGeminiModel();

  const prompt = `
Você é um diretor de conteúdo e roteirista especializado em TikTok brasileiro.
Você conhece profundamente a cultura jovem do Brasil e sabe exatamente como um jovem brasileiro age, fala e se comporta na frente da câmera.
Você recebeu 5 conceitos validados e seu trabalho é transformar cada um em um roteiro tão detalhado que o criador consiga gravar apenas lendo suas instruções.

CONCEITOS FINAIS:
${JSON.stringify(prompt3Output.conceitos_finais, null, 2)}

FÓRMULA EMOCIONAL: ${prompt2Output.formula_emocional}
EMOÇÃO CENTRAL: ${prompt2Output.emocao_central.nome}
HOOK DO VÍDEO ORIGINAL: ${JSON.stringify(prompt1Output.hook)}
ESTRUTURA DE RETENÇÃO: ${JSON.stringify(prompt1Output.estrutura_de_retencao)}
NICHO: ${nichoConfirmado}

PERFIL DO CRIADOR:
- Realidade: ${perfilCriador.realidade_socioeconomica}
- Idade: ${perfilCriador.idade}
- Cidade: ${perfilCriador.cidade}

Para cada um dos 5 conceitos, gere um roteiro completo seguindo EXATAMENTE essa estrutura.
Use linguagem jovem, coloquial e brasileira. Fale como um amigo que entende muito de TikTok.

IMPORTANTE: Responda APENAS com JSON válido:
{
  "roteiros": [
    {
      "numero": 1,
      "cabecalho": {
        "titulo": "texto",
        "objetivo_emocional": "texto",
        "duracao_alvo": "60 a 90 segundos",
        "melhor_horario_para_postar": {
          "horario": "texto",
          "justificativa": "texto"
        },
        "sugestao_de_legenda": "texto",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
      },
      "cenario": {
        "onde_gravar": "texto",
        "horario_de_gravacao": "texto",
        "tipo_de_luz": "texto",
        "o_que_deve_aparecer_no_fundo": "texto",
        "o_que_nao_deve_aparecer_no_fundo": "texto"
      },
      "setup_de_gravacao": {
        "orientacao": "vertical",
        "altura_do_celular": "texto",
        "distancia_do_rosto": "texto",
        "posicao_do_corpo": "texto",
        "onde_apoiar_o_celular": "texto",
        "como_segurar_se_for_na_mao": "texto"
      },
      "vestimenta": {
        "peca": "texto",
        "cor": "texto",
        "tecido": "texto",
        "caimento": "texto",
        "aparencia_realista": "texto"
      },
      "roteiro_cronologico": {
        "0_a_3s": {
          "fala_exata": "texto",
          "tom_de_voz": "texto",
          "intensidade_emocional": "0 a 10",
          "expressao_facial": "texto",
          "movimento_corporal": "texto",
          "direcao_do_olhar": "texto",
          "objetivo_desse_momento": "texto"
        },
        "4_a_15s": {
          "fala_exata": "texto",
          "tom_de_voz": "texto",
          "intensidade_emocional": "0 a 10",
          "expressao_facial": "texto",
          "movimento_corporal": "texto",
          "direcao_do_olhar": "texto",
          "objetivo_desse_momento": "texto"
        },
        "16_a_35s": {
          "fala_exata": "texto",
          "tom_de_voz": "texto",
          "intensidade_emocional": "0 a 10",
          "expressao_facial": "texto",
          "movimento_corporal": "texto",
          "direcao_do_olhar": "texto",
          "objetivo_desse_momento": "texto"
        },
        "36_a_55s": {
          "fala_exata": "texto",
          "tom_de_voz": "texto",
          "intensidade_emocional": "0 a 10",
          "expressao_facial": "texto",
          "movimento_corporal": "texto",
          "direcao_do_olhar": "texto",
          "objetivo_desse_momento": "texto"
        },
        "56_a_75s": {
          "fala_exata": "texto",
          "tom_de_voz": "texto",
          "intensidade_emocional": "0 a 10",
          "expressao_facial": "texto",
          "movimento_corporal": "texto",
          "direcao_do_olhar": "texto",
          "objetivo_desse_momento": "texto"
        }
      },
      "edicao": {
        "onde_cortar": "texto",
        "onde_acelerar": "texto",
        "onde_inserir_legenda": "texto",
        "onde_usar_silencio": "texto",
        "musica_de_fundo": "texto",
        "onde_fazer_corte_seco": "texto"
      },
      "elementos_estrategicos": {
        "ponto_de_maior_tensao": "texto",
        "quebra_de_expectativa": "texto",
        "loop_de_retencao": "texto",
        "cta_invisivel": "texto"
      },
      "erros_fatais": ["erro 1", "erro 2", "erro 3"]
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

  const parsed = JSON.parse(text);
  const validated = prompt4OutputSchema.parse(parsed);

  return { output: validated, tokensUsed };
}
