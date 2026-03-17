-- =============================================================
-- MIGRATION 001: Extensões e Configurações Base
-- Essa migration precisa rodar antes de qualquer outra.
-- Ela ativa funcionalidades do PostgreSQL que as tabelas
-- seguintes vão depender.
-- =============================================================

-- O uuid-ossp permite gerar IDs únicos no formato UUID.
-- Todo registro no banco da vipeSocial usa UUID como
-- chave primária em vez de números sequenciais.
-- Por quê UUID? Porque números sequenciais expõem informação
-- sobre quantos registros existem no banco, e são previsíveis.
-- Um usuário mal intencionado que sabe que seu ID é 1547
-- pode tentar acessar o ID 1548. Com UUID isso é impossível.


-- O pgcrypto fornece funções criptográficas.
-- Vamos usar para gerar tokens seguros em algumas operações.
create extension if not exists "pgcrypto";

-- Cria um tipo enum para a realidade socioeconômica do criador.
-- Enums são listas fechadas de valores possíveis.
-- O banco rejeita automaticamente qualquer valor fora dessa lista.
-- Isso é mais seguro e eficiente do que usar texto livre.
create type socioeconomic_reality as enum (
  'poor',        -- pobre
  'middle_class', -- classe média
  'wealthy'      -- rico
);

-- Enum para o estágio do canal do criador.
create type channel_stage as enum (
  'beginner',      -- iniciante, menos de 1000 seguidores
  'developing',    -- em desenvolvimento, 1k a 10k
  'growing',       -- crescendo, 10k a 100k
  'consolidated'   -- consolidado, acima de 100k
);

-- Enum para o status de uma análise.
-- Cada valor representa uma etapa do pipeline de processamento.
create type analysis_status as enum (
  'pending',                      -- aguardando início
  'processing_prompt1',           -- Prompt 1 rodando
  'awaiting_niche_confirmation',  -- esperando usuário confirmar nicho
  'processing_prompt2',           -- Prompt 2 rodando
  'processing_prompt3',           -- Prompt 3 rodando
  'processing_prompt4',           -- Prompt 4 rodando
  'completed',                    -- análise completa
  'failed'                        -- falhou em alguma etapa
);

-- Enum para o tipo de análise.
create type analysis_type as enum (
  'viral_video',       -- análise do vídeo que viralizou
  'failed_video',      -- análise do vídeo que não performou
  'reference_video',   -- análise de vídeo de referência externo
  'build_from_zero'    -- construir do zero sem vídeo viral próprio
);

-- Enum para o status de execução de um roteiro.
create type execution_status as enum (
  'not_started', -- roteiro gerado mas não gravado ainda
  'recorded',    -- gravado mas não postado
  'posted',      -- postado no TikTok
  'abandoned'    -- descartado pelo criador
);

-- Enum para o plano de assinatura.
create type subscription_plan as enum (
  'starter', -- plano inicial
  'growth',  -- plano intermediário
  'scale'    -- plano avançado
);

-- Enum para o status da assinatura.
create type subscription_status as enum (
  'active',      -- ativa
  'canceled',    -- cancelada
  'past_due',    -- pagamento atrasado
  'trialing',    -- em período de teste
  'paused'       -- pausada
);

-- Função utilitária que atualiza automaticamente o campo
-- updated_at sempre que um registro é modificado.
-- Em vez de lembrar de atualizar esse campo em cada query,
-- criamos um trigger que faz isso automaticamente.
create or replace function update_updated_at()
returns trigger as $$
begin
  -- NEW é o registro com os novos valores sendo salvos.
  -- Atualizamos o updated_at para o momento exato da alteração.
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;