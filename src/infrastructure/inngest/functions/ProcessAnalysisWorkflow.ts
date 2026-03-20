import { inngest } from "../InngestClient";

import { createServiceSupabaseClient } from "@/infrastructure/supabase/server";
import { runPrompt1 } from "@/infrastructure/gemini/prompts/prompt1";
import { runPrompt2 } from "@/infrastructure/gemini/prompts/prompt2";
import { runPrompt3 } from "@/infrastructure/gemini/prompts/prompt3";
import { runPrompt4 } from "@/infrastructure/gemini/prompts/prompt4";

// Depois — versão v4 com 2 argumentos
export const processAnalysisWorkflow = inngest.createFunction(
  {
    id: "process-analysis-workflow",
    // No v4 o trigger fica dentro de triggers como array
    triggers: [{ event: "vipesocial/analysis.started" }],
    retries: 2,
  },
  async ({ event, step }) => {
    // Tipamos explicitamente o event.data porque o v4
    // não infere automaticamente o tipo dos dados do evento
    const { analysisId } = event.data as { analysisId: string };

    // Busca todos os dados necessários para o workflow
    const analysisData = await step.run("fetch-analysis-data", async () => {
      const supabase = createServiceSupabaseClient();

      // Busca a análise
      const { data: analysis, error: analysisError } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", analysisId)
        .single();

      if (analysisError || !analysis) {
        throw new Error(`Análise não encontrada: ${analysisId}`);
      }

      // Busca o vídeo
      const { data: video, error: videoError } = await supabase
        .from("videos")
        .select("*")
        .eq("id", analysis.video_id)
        .single();

      if (videoError || !video) {
        throw new Error(`Vídeo não encontrado para análise: ${analysisId}`);
      }

      // Busca as métricas do vídeo
      const { data: metricas, error: metricasError } = await supabase
        .from("video_metrics")
        .select("*")
        .eq("video_id", video.id)
        .single();

      if (metricasError || !metricas) {
        throw new Error(`Métricas não encontradas para vídeo: ${video.id}`);
      }

      // Busca o perfil do criador
      const { data: creatorProfile, error: profileError } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", analysis.user_id)
        .single();

      if (profileError || !creatorProfile) {
        throw new Error(
          `Perfil não encontrado para usuário: ${analysis.user_id}`,
        );
      }

      return { analysis, video, metricas, creatorProfile };
    });

    // ============================================================
    // PROMPT 1 — Análise estrutural e emocional do vídeo
    // ============================================================
    const prompt1Result = await step.run("run-prompt1", async () => {
      const supabase = createServiceSupabaseClient();

      // Atualiza status para processing_prompt1
      await supabase
        .from("analyses")
        .update({
          status: "processing_prompt1",
          current_step: 1,
          processing_started_at: new Date().toISOString(),
        })
        .eq("id", analysisId);

      // Executa o Prompt 1 com o vídeo e as métricas
      const { output, tokensUsed } = await runPrompt1({
        videoUrl: analysisData.video.storage_path,
        metricas: {
          views: analysisData.metricas.views,
          likes: analysisData.metricas.likes,
          comments: analysisData.metricas.comments,
          shares: analysisData.metricas.shares,
          saves: analysisData.metricas.saves,
        },
      });

      // Salva o output no banco
      await supabase.from("prompt1_outputs").insert({
        analysis_id: analysisId,
        dominant_metrics_signal: output.sinal_dominante_das_metricas,
        hook_type: output.hook.tipo,
        hook_intensity: output.hook.intensidade,
        hook_explanation: output.hook.explicacao,
        retention_micro_rewards: output.estrutura_de_retencao.micro_recompensas,
        retention_open_loop: output.estrutura_de_retencao.loop_aberto,
        retention_tension_point:
          output.estrutura_de_retencao.ponto_de_maior_tensao,
        retention_predictability_break:
          output.estrutura_de_retencao.quebra_de_previsibilidade,
        emotional_dna_dominant: output.dna_emocional_puro.emocao_dominante,
        emotional_dna_explanation: output.dna_emocional_puro.explicacao,
        inferred_niche: output.nicho_inferido,
        niche_confirmation_required: output.confirmacao_necessaria,
        raw_gemini_response: output,
        tokens_used: tokensUsed,
      });

      // Registra uso
      await supabase.from("usage_logs").insert({
        user_id: analysisData.analysis.user_id,
        analysis_id: analysisId,
        operation_type: "prompt1",
        total_tokens: tokensUsed,
        status: "success",
      });

      // Atualiza status para aguardar confirmação de nicho
      await supabase
        .from("analyses")
        .update({
          status: "awaiting_niche_confirmation",
          current_step: 2,
          confirmed_niche: output.nicho_inferido,
        })
        .eq("id", analysisId);

      return output;
    });

    // ============================================================
    // PAUSA — Aguarda o usuário confirmar o nicho
    // O workflow fica pausado aqui até receber o evento
    // vipesocial/niche.confirmed com o analysisId correto
    // ============================================================
    const nicheConfirmation = await step.waitForEvent(
      "wait-for-niche-confirmation",
      {
        event: "vipesocial/niche.confirmed",
        timeout: "24h",
        // Só retoma quando o evento for para essa análise específica
        if: `async.data.analysisId == "${analysisId}"`,
      },
    );

    // Se o timeout expirar sem confirmação, falha a análise
    if (!nicheConfirmation) {
      const supabase = createServiceSupabaseClient();
      await supabase
        .from("analyses")
        .update({
          status: "failed",
          error_message: "Timeout na confirmação de nicho. Tente novamente.",
        })
        .eq("id", analysisId);
      return;
    }

    const nichoConfirmado = (
      nicheConfirmation.data as {
        analysisId: string;
        confirmedNiche: string;
      }
    ).confirmedNiche;

    // ============================================================
    // PROMPT 2 — Destilação emocional
    // ============================================================
    const prompt2Result = await step.run("run-prompt2", async () => {
      const supabase = createServiceSupabaseClient();
      await supabase
        .from("analyses")
        .update({
          status: "processing_prompt2",
          current_step: 3,
        })
        .eq("id", analysisId);

      const { output, tokensUsed } = await runPrompt2({
        prompt1Output: prompt1Result,
        nichoConfirmado,
      });

      await supabase.from("prompt2_outputs").insert({
        analysis_id: analysisId,
        entry_emotion: output.cadeia_emocional.emocao_de_entrada,
        development_emotion: output.cadeia_emocional.emocao_de_desenvolvimento,
        exit_emotion: output.cadeia_emocional.emocao_de_saida,
        central_emotion_name: output.emocao_central.nome,
        central_emotion_justification: output.emocao_central.justificativa,
        action_trigger: output.gatilho_de_acao,
        emotional_formula: output.formula_emocional,
        replication_alert: output.alerta_de_replicacao,
        raw_gemini_response: output,
        tokens_used: tokensUsed,
      });

      await supabase.from("usage_logs").insert({
        user_id: analysisData.analysis.user_id,
        analysis_id: analysisId,
        operation_type: "prompt2",
        total_tokens: tokensUsed,
        status: "success",
      });

      return output;
    });

    // ============================================================
    // PROMPT 3 — Reconstrução cultural
    // ============================================================
    const prompt3Result = await step.run("run-prompt3", async () => {
      const supabase = createServiceSupabaseClient();
      await supabase
        .from("analyses")
        .update({
          status: "processing_prompt3",
          current_step: 4,
        })
        .eq("id", analysisId);

      const { output, tokensUsed } = await runPrompt3({
        prompt1Output: prompt1Result,
        prompt2Output: prompt2Result,
        nichoConfirmado,
        perfilCriador: {
          realidade_socioeconomica:
            analysisData.creatorProfile.socioeconomic_reality,
          idade: analysisData.creatorProfile.age,
          cidade: analysisData.creatorProfile.city,
        },
      });

      await supabase.from("prompt3_outputs").insert({
        analysis_id: analysisId,
        all_mapped_situations: output.situacoes_mapeadas,
        approved_situations: output.situacoes_aprovadas_apos_filtro,
        final_concepts: output.conceitos_finais,
        raw_gemini_response: output,
        tokens_used: tokensUsed,
      });

      await supabase.from("usage_logs").insert({
        user_id: analysisData.analysis.user_id,
        analysis_id: analysisId,
        operation_type: "prompt3",
        total_tokens: tokensUsed,
        status: "success",
      });

      return output;
    });

    // ============================================================
    // PROMPT 4 — Geração dos 5 roteiros
    // ============================================================
    await step.run("run-prompt4", async () => {
      const supabase = createServiceSupabaseClient();

      await supabase
        .from("analyses")
        .update({
          status: "processing_prompt4",
          current_step: 5,
        })
        .eq("id", analysisId);

      const { output, tokensUsed } = await runPrompt4({
        prompt1Output: prompt1Result,
        prompt2Output: prompt2Result,
        prompt3Output: prompt3Result,
        nichoConfirmado,
        perfilCriador: {
          realidade_socioeconomica:
            analysisData.creatorProfile.socioeconomic_reality,
          idade: analysisData.creatorProfile.age,
          cidade: analysisData.creatorProfile.city,
        },
      });

      await supabase.from("prompt4_outputs").insert({
        analysis_id: analysisId,
        scripts: output.roteiros,
        raw_gemini_response: output,
        tokens_used: tokensUsed,
      });

      // Salva cada roteiro individualmente na tabela scripts
      for (const roteiro of output.roteiros) {
        await supabase.from("scripts").insert({
          analysis_id: analysisId,
          user_id: analysisData.analysis.user_id,
          script_number: roteiro.numero,
          title: roteiro.cabecalho.titulo,
          central_concept: roteiro.cabecalho.objetivo_emocional,
          activated_emotion: prompt2Result.emocao_central.nome,
          target_niche: nichoConfirmado,
          best_posting_time:
            roteiro.cabecalho.melhor_horario_para_postar.horario,
          posting_time_justification:
            roteiro.cabecalho.melhor_horario_para_postar.justificativa,
          suggested_caption: roteiro.cabecalho.sugestao_de_legenda,
          hashtags: roteiro.cabecalho.hashtags,
          scenario: roteiro.cenario,
          recording_setup: roteiro.setup_de_gravacao,
          wardrobe: roteiro.vestimenta,
          script_timeline: roteiro.roteiro_cronologico,
          editing_instructions: roteiro.edicao,
          strategic_elements: roteiro.elementos_estrategicos,
          fatal_errors: roteiro.erros_fatais,
          execution_status: "not_started",
        });
      }

      await supabase.from("usage_logs").insert({
        user_id: analysisData.analysis.user_id,
        analysis_id: analysisId,
        operation_type: "prompt4",
        total_tokens: tokensUsed,
        status: "success",
      });

      // Marca análise como completa
      await supabase
        .from("analyses")
        .update({
          status: "completed",
          current_step: 5,
          processing_completed_at: new Date().toISOString(),
        })
        .eq("id", analysisId);
    });
  },
);
