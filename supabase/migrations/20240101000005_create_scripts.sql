-- =============================================================
-- MIGRATION 006: Tabela de Scripts
-- Normaliza cada roteiro individual gerado pelo Prompt 4.
-- Permite rastrear execução e performance de cada roteiro
-- separadamente ao longo do tempo.
-- =============================================================

create table public.scripts (
  id uuid default gen_random_uuid() primary key,

  -- Referência à análise que gerou esse roteiro.
  analysis_id uuid references public.analyses(id)
    on delete cascade not null,

  -- Dono do roteiro — denormalizado para facilitar queries
  -- sem precisar fazer join com analyses toda vez.
  user_id uuid references public.profiles(id)
    on delete cascade not null,

  -- Número do roteiro dentro da análise. De 1 a 5.
  script_number integer not null
    check (script_number >= 1 and script_number <= 5),

  -- Título interno para o criador se organizar.
  -- Ex: "A Batalha Contra a Maresia"
  title text not null,

  -- Conceito central em uma frase.
  -- Ex: "A batalha contra a maresia para salvar o único
  -- celular que tenho para trabalhar."
  central_concept text,

  -- Emoção principal que o roteiro vai ativar.
  activated_emotion text,

  -- Nicho alvo desse roteiro específico.
  target_niche text,

  -- Duração alvo em segundos. Entre 60 e 90.
  target_duration_seconds integer
    check (target_duration_seconds >= 30
      and target_duration_seconds <= 180),

  -- Melhor horário para postar no formato "HH:MM".
  -- Ex: "18:30"
  best_posting_time text,

  -- Por que aquele horário foi recomendado.
  posting_time_justification text,

  -- Legenda sugerida para o TikTok.
  -- Máximo 150 caracteres conforme o Prompt 4 define.
  suggested_caption text
    check (char_length(suggested_caption) <= 150),

  -- Array de hashtags sugeridas.
  -- Ex: ["vidadecriador", "maresia", "periferia"]
  hashtags jsonb default '[]'::jsonb,

  -- Todas as seções do roteiro em JSONB.
  -- Separadas para facilitar renderização seletiva
  -- de cada seção na interface.

  -- Instruções de cenário completas.
  scenario jsonb default '{}'::jsonb,

  -- Setup de gravação detalhado.
  recording_setup jsonb default '{}'::jsonb,

  -- Vestimenta recomendada.
  wardrobe jsonb default '{}'::jsonb,

  -- Roteiro cronológico segundo a segundo.
  -- Contém os 5 intervalos: 0-3s, 4-15s, 16-35s, 36-55s, 56-75s
  -- Cada intervalo tem: fala_exata, tom_de_voz,
  -- intensidade_emocional, expressao_facial,
  -- movimento_corporal, direcao_do_olhar, objetivo
  script_timeline jsonb default '{}'::jsonb,

  -- Instruções de edição para CapCut ou editor nativo.
  editing_instructions jsonb default '{}'::jsonb,

  -- Elementos estratégicos: ponto de tensão, quebra de
  -- expectativa, loop de retenção, CTA invisível.
  strategic_elements jsonb default '{}'::jsonb,

  -- Os 3 erros fatais específicos desse roteiro.
  fatal_errors jsonb default '[]'::jsonb,

  -- Status de execução usando enum da migration 001.
  -- Atualizado pelo criador conforme ele avança.
  execution_status execution_status default 'not_started' not null,

  -- Quando o criador postou esse roteiro no TikTok.
  posted_at timestamptz,

  -- Referência ao vídeo resultado se o criador
  -- subiu o vídeo gravado na plataforma para análise.
  posted_video_id uuid references public.videos(id)
    on delete set null,

  -- Soft delete.
  deleted_at timestamptz,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- Garante que não existem dois roteiros com o mesmo número
  -- dentro da mesma análise.
  unique(analysis_id, script_number)
);

-- Ativa RLS.
alter table public.scripts enable row level security;

-- Políticas de segurança.
create policy "Usuário vê apenas os próprios roteiros"
  on public.scripts
  for select
  using (auth.uid() = user_id);

create policy "Usuário atualiza apenas os próprios roteiros"
  on public.scripts
  for update
  using (auth.uid() = user_id);

-- Sistema insere roteiros — usuário não insere diretamente.
create policy "Service role insere roteiros"
  on public.scripts
  for insert
  with check (auth.role() = 'service_role');

-- Trigger de updated_at.
create trigger scripts_updated_at
  before update on public.scripts
  for each row
  execute function update_updated_at();

-- Índices para queries frequentes.

-- Buscar todos os roteiros de um usuário ordenados por data.
create index scripts_user_id_created_at_idx
  on public.scripts(user_id, created_at desc)
  where deleted_at is null;

-- Buscar roteiros de uma análise específica.
create index scripts_analysis_id_idx
  on public.scripts(analysis_id)
  where deleted_at is null;

-- Buscar roteiros por status de execução.
-- Ex: quais roteiros estão gravados mas não postados ainda.
create index scripts_execution_status_idx
  on public.scripts(user_id, execution_status)
  where deleted_at is null;

-- Buscar roteiros postados para cruzar com métricas.
create index scripts_posted_at_idx
  on public.scripts(user_id, posted_at desc)
  where deleted_at is null and posted_at is not null;