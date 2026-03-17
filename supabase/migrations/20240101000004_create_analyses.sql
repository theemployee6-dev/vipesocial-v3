-- =============================================================
-- MIGRATION 005: Tabela de Analyses e Outputs dos Prompts
-- A tabela analyses é o registro central de cada análise.
-- As tabelas de output guardam os resultados de cada prompt.
-- =============================================================

create table public.analyses (
  id uuid default gen_random_uuid() primary key,

  -- Dono da análise.
  user_id uuid references public.profiles(id)
    on delete cascade not null,

  -- Vídeo sendo analisado.
  video_id uuid references public.videos(id)
    on delete cascade not null,

  -- Tipo da análise usando enum da migration 001.
  analysis_type analysis_type default 'viral_video' not null,

  -- Status atual do pipeline usando enum da migration 001.
  -- Atualizado pelo Inngest a cada etapa do processamento.
  -- O Supabase Realtime escuta mudanças nessa coluna
  -- para mostrar progresso em tempo real na tela do usuário.
  status analysis_status default 'pending' not null,

  -- Etapa atual numericamente para facilitar cálculo
  -- de progresso percentual na interface.
  -- 0 = pendente, 1 = prompt1, 2 = aguardando confirmação,
  -- 3 = prompt2, 4 = prompt3, 5 = prompt4, 6 = completo
  current_step integer default 0 not null
    check (current_step >= 0 and current_step <= 6),

  -- Nicho confirmado pelo usuário após o Prompt 1.
  -- Null até o usuário confirmar.
  confirmed_niche text,

  -- Quando o usuário confirmou o nicho.
  niche_confirmed_at timestamptz,

  -- Timestamps do processamento para métricas internas.
  processing_started_at timestamptz,
  processing_completed_at timestamptz,

  -- Total de tokens consumidos por toda a análise.
  -- Soma dos tokens de todos os prompts.
  -- Usado para calcular custo real por análise.
  total_tokens_used integer default 0,

  -- Custo estimado em USD de toda a análise.
  -- Calculado com base nos tokens e no modelo usado.
  estimated_cost_usd numeric(10,6) default 0,

  -- Mensagem de erro se o status for 'failed'.
  -- Guardamos o erro para debugging e para mostrar
  -- ao usuário o que aconteceu de forma amigável.
  error_message text,

  -- ID do evento no Inngest para rastreamento do workflow.
  -- Permite consultar o status diretamente no dashboard
  -- do Inngest se algo der errado.
  inngest_event_id text,

  -- Soft delete.
  deleted_at timestamptz,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Ativa RLS.
alter table public.analyses enable row level security;

-- Políticas de segurança.
create policy "Usuário vê apenas as próprias análises"
  on public.analyses
  for select
  using (auth.uid() = user_id);

create policy "Usuário insere apenas as próprias análises"
  on public.analyses
  for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza apenas as próprias análises"
  on public.analyses
  for update
  using (auth.uid() = user_id);

-- Trigger de updated_at.
create trigger analyses_updated_at
  before update on public.analyses
  for each row
  execute function update_updated_at();

-- Índices para queries frequentes.

-- Buscar análises de um usuário ordenadas por data.
-- Query mais comum — lista de análises no dashboard.
create index analyses_user_id_created_at_idx
  on public.analyses(user_id, created_at desc)
  where deleted_at is null;

-- Buscar análises por status.
-- Usado pelo Inngest para encontrar análises pendentes.
create index analyses_status_idx
  on public.analyses(status)
  where deleted_at is null and status != 'completed';

-- Buscar análises aguardando confirmação de nicho.
-- Query específica do fluxo de confirmação.
create index analyses_awaiting_confirmation_idx
  on public.analyses(user_id, status)
  where status = 'awaiting_niche_confirmation';

-- =============================================================
-- OUTPUT DO PROMPT 1
-- Análise estrutural e emocional do vídeo viral.
-- =============================================================

create table public.prompt1_outputs (
  id uuid default gen_random_uuid() primary key,

  -- Referência à análise pai.
  analysis_id uuid references public.analyses(id)
    on delete cascade not null unique,

  -- ETAPA 1: Sinal dominante das métricas.
  -- Ex: "Shares muito altos indicam identificação profunda"
  dominant_metrics_signal text,

  -- ETAPA 2: Análise do Hook.
  hook_type text,
  -- String no formato "X-10". Ex: "7-10"
  hook_intensity text,
  hook_explanation text,
  -- Análise do tom de voz, velocidade, pausas do hook.
  hook_prosodic_analysis text,
  -- Análise específica do primeiro frame antes do play.
  zero_frame_analysis text,

  -- ETAPA 3: Estrutura de Retenção.
  retention_micro_rewards text,
  retention_open_loop text,
  retention_tension_point text,
  retention_predictability_break text,

  -- ETAPA 4: DNA Emocional Puro.
  emotional_dna_dominant text,
  emotional_dna_explanation text,

  -- ETAPA 5: Nicho inferido pela IA.
  inferred_niche text,
  niche_confirmation_required boolean default true not null,

  -- Resposta bruta do Gemini para debugging.
  -- Se algo der errado na análise, podemos ver
  -- exatamente o que o Gemini retornou.
  raw_gemini_response jsonb,

  -- Controle de custo.
  tokens_used integer default 0,

  created_at timestamptz default now() not null
);

-- RLS para prompt1_outputs.
alter table public.prompt1_outputs enable row level security;

-- Para acessar o output, usuário precisa ser dono da análise.
create policy "Usuário vê outputs das próprias análises"
  on public.prompt1_outputs
  for select
  using (
    exists (
      select 1 from public.analyses
      where analyses.id = prompt1_outputs.analysis_id
      and analyses.user_id = auth.uid()
    )
  );

-- Sistema insere outputs — usuário não insere diretamente.
-- Apenas service_role pode inserir nessa tabela.
create policy "Service role insere prompt1 outputs"
  on public.prompt1_outputs
  for insert
  with check (auth.role() = 'service_role');

-- =============================================================
-- OUTPUT DO PROMPT 2
-- Destilação emocional — a fórmula emocional do vídeo.
-- =============================================================

create table public.prompt2_outputs (
  id uuid default gen_random_uuid() primary key,

  analysis_id uuid references public.analyses(id)
    on delete cascade not null unique,

  -- ETAPA 1: Cadeia emocional.
  entry_emotion text,
  development_emotion text,
  exit_emotion text,

  -- ETAPA 2: Emoção central.
  central_emotion_name text,
  central_emotion_justification text,

  -- ETAPA 3: Gatilho de ação.
  action_trigger text,
  -- O mecanismo psicológico por trás do gatilho.
  action_trigger_psychology text,
  -- Onde no vídeo a emoção foi ativada.
  action_trigger_timing text,

  -- ETAPA 4: Fórmula emocional completa.
  -- Ex: "O vídeo viralizou porque ativou [X] através de [Y]
  -- gerando no espectador a vontade de [Z]"
  emotional_formula text,

  -- ETAPA 5: Alerta de replicação.
  replication_alert text,

  raw_gemini_response jsonb,
  tokens_used integer default 0,

  created_at timestamptz default now() not null
);

alter table public.prompt2_outputs enable row level security;

create policy "Usuário vê prompt2 outputs das próprias análises"
  on public.prompt2_outputs
  for select
  using (
    exists (
      select 1 from public.analyses
      where analyses.id = prompt2_outputs.analysis_id
      and analyses.user_id = auth.uid()
    )
  );

create policy "Service role insere prompt2 outputs"
  on public.prompt2_outputs
  for insert
  with check (auth.role() = 'service_role');

-- =============================================================
-- OUTPUT DO PROMPT 3
-- Reconstrução cultural — 5 conceitos adaptados ao criador.
-- =============================================================

create table public.prompt3_outputs (
  id uuid default gen_random_uuid() primary key,

  analysis_id uuid references public.analyses(id)
    on delete cascade not null unique,

  -- ETAPA 2: Todas as situações mapeadas antes do filtro.
  -- Array JSON com todas as situações identificadas.
  all_mapped_situations jsonb default '[]'::jsonb,

  -- ETAPA 3: Situações aprovadas após filtro cultural.
  approved_situations jsonb default '[]'::jsonb,

  -- ETAPAS 4 e 5: Os 5 conceitos finais validados.
  -- Array JSON com estrutura completa de cada conceito.
  -- Inclui conceito_central, emocao_ativada, elemento_de_surpresa,
  -- potencial_de_serie, validacao_aprovada, alerta_de_execucao.
  final_concepts jsonb default '[]'::jsonb,

  raw_gemini_response jsonb,
  tokens_used integer default 0,

  created_at timestamptz default now() not null
);

alter table public.prompt3_outputs enable row level security;

create policy "Usuário vê prompt3 outputs das próprias análises"
  on public.prompt3_outputs
  for select
  using (
    exists (
      select 1 from public.analyses
      where analyses.id = prompt3_outputs.analysis_id
      and analyses.user_id = auth.uid()
    )
  );

create policy "Service role insere prompt3 outputs"
  on public.prompt3_outputs
  for insert
  with check (auth.role() = 'service_role');

-- =============================================================
-- OUTPUT DO PROMPT 4
-- Os 5 roteiros completos e executáveis.
-- =============================================================

create table public.prompt4_outputs (
  id uuid default gen_random_uuid() primary key,

  analysis_id uuid references public.analyses(id)
    on delete cascade not null unique,

  -- Array JSON com os 5 roteiros completos.
  -- Estrutura completa de cada roteiro incluindo
  -- cabeçalho, cenário, setup, vestimenta,
  -- roteiro cronológico, edição, elementos estratégicos
  -- e erros fatais.
  scripts jsonb default '[]'::jsonb,

  raw_gemini_response jsonb,
  tokens_used integer default 0,

  created_at timestamptz default now() not null
);

alter table public.prompt4_outputs enable row level security;

create policy "Usuário vê prompt4 outputs das próprias análises"
  on public.prompt4_outputs
  for select
  using (
    exists (
      select 1 from public.analyses
      where analyses.id = prompt4_outputs.analysis_id
      and analyses.user_id = auth.uid()
    )
  );

create policy "Service role insere prompt4 outputs"
  on public.prompt4_outputs
  for insert
  with check (auth.role() = 'service_role');

-- Índice para buscar outputs por analysis_id.
-- Query mais comum — buscar todos os outputs de uma análise.
create index prompt1_outputs_analysis_id_idx
  on public.prompt1_outputs(analysis_id);

create index prompt2_outputs_analysis_id_idx
  on public.prompt2_outputs(analysis_id);

create index prompt3_outputs_analysis_id_idx
  on public.prompt3_outputs(analysis_id);

create index prompt4_outputs_analysis_id_idx
  on public.prompt4_outputs(analysis_id);