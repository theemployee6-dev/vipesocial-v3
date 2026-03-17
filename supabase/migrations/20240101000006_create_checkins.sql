-- =============================================================
-- MIGRATION 007: Tabelas de Check-in e Aprendizado
-- O check-in é o retorno do criador após 7 dias com
-- os resultados reais dos vídeos postados.
-- Fecha o ciclo de aprendizado da vipeSocial.
-- =============================================================

create table public.check_ins (
  id uuid default gen_random_uuid() primary key,

  -- Dono do check-in.
  user_id uuid references public.profiles(id)
    on delete cascade not null,

  -- Análise à qual esse check-in pertence.
  analysis_id uuid references public.analyses(id)
    on delete cascade not null,

  -- Data do check-in.
  check_in_date date default current_date not null,

  -- Quais roteiros foram gravados e seus dados.
  -- Formato: [{"script_id": "uuid", "script_number": 1,
  --            "was_recorded": true}]
  scripts_recorded jsonb default '[]'::jsonb,

  -- Quais roteiros foram postados com métricas reais.
  -- Formato: [{"script_id": "uuid", "script_number": 1,
  --            "views": 15000, "likes": 800,
  --            "comments": 45, "shares": 120,
  --            "saves": 67, "tiktok_url": "https://..."}]
  scripts_posted jsonb default '[]'::jsonb,

  -- Texto livre do criador sobre o que aconteceu.
  -- "Eu não consegui fazer o tom sério, acabei ficando
  --  mais engraçado e o vídeo bombou mesmo assim"
  -- Esse campo é ouro — revela desvios positivos que
  -- nenhum dado estruturado captura.
  creator_free_text text,

  -- Se o check-in foi completado ou apenas iniciado.
  was_completed boolean default false not null,

  -- Quando o lembrete de check-in foi enviado por email.
  reminder_sent_at timestamptz,

  -- Quando o segundo lembrete foi enviado.
  -- Enviamos dois lembretes: no 7º e no 10º dia.
  second_reminder_sent_at timestamptz,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- Apenas um check-in por análise.
  unique(analysis_id)
);

-- Ativa RLS.
alter table public.check_ins enable row level security;

-- Políticas de segurança.
create policy "Usuário vê apenas os próprios check-ins"
  on public.check_ins
  for select
  using (auth.uid() = user_id);

create policy "Usuário insere apenas os próprios check-ins"
  on public.check_ins
  for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza apenas os próprios check-ins"
  on public.check_ins
  for update
  using (auth.uid() = user_id);

-- Trigger de updated_at.
create trigger check_ins_updated_at
  before update on public.check_ins
  for each row
  execute function update_updated_at();

-- Índices para queries frequentes.

-- Buscar check-ins pendentes — análises que completaram
-- 7 dias sem check-in. Usado pelo job de lembretes.
create index check_ins_pending_idx
  on public.check_ins(user_id, was_completed)
  where was_completed = false;

-- Buscar check-ins de um usuário ordenados por data.
create index check_ins_user_id_created_at_idx
  on public.check_ins(user_id, created_at desc);

-- =============================================================
-- OUTPUT DO PROMPT 5
-- Análise de aprendizado gerada após o check-in.
-- Compara o comportamento previsto com o resultado real.
-- =============================================================

create table public.prompt5_outputs (
  id uuid default gen_random_uuid() primary key,

  -- Referência ao check-in que gerou essa análise.
  check_in_id uuid references public.check_ins(id)
    on delete cascade not null unique,

  -- Denormalizado para facilitar queries.
  user_id uuid references public.profiles(id)
    on delete cascade not null,

  analysis_id uuid references public.analyses(id)
    on delete cascade not null,

  -- Comparação entre o previsto pelo sistema e o real.
  -- Formato: {"predicted_trigger": "salvar",
  --           "real_trigger": "compartilhar",
  --           "explanation": "O criador usou humor..."}
  predicted_vs_real_comparison jsonb default '{}'::jsonb,

  -- Padrões emocionais confirmados pelos dados reais.
  -- O que o sistema previu e os dados confirmaram.
  confirmed_emotional_patterns jsonb default '[]'::jsonb,

  -- Desvios positivos do criador.
  -- O que ele fez diferente do roteiro e funcionou melhor.
  -- Ex: {"deviation": "usou humor no lugar de seriedade",
  --      "impact": "dobrou o número de compartilhamentos"}
  creator_positive_deviations jsonb default '[]'::jsonb,

  -- Desvios negativos do criador.
  -- O que ele fez diferente e piorou o resultado.
  creator_negative_deviations jsonb default '[]'::jsonb,

  -- O que muda no creator_profile com base nessa análise.
  -- Aplicado automaticamente ao profile após geração.
  profile_recalibration jsonb default '{}'::jsonb,

  -- Recomendações para o próximo ciclo de análise.
  next_cycle_recommendations jsonb default '[]'::jsonb,

  raw_gemini_response jsonb,
  tokens_used integer default 0,

  created_at timestamptz default now() not null
);

-- Ativa RLS.
alter table public.prompt5_outputs enable row level security;

create policy "Usuário vê prompt5 outputs dos próprios check-ins"
  on public.prompt5_outputs
  for select
  using (auth.uid() = user_id);

create policy "Service role insere prompt5 outputs"
  on public.prompt5_outputs
  for insert
  with check (auth.role() = 'service_role');

-- =============================================================
-- TABELA DE EVOLUÇÃO DO CRIADOR
-- Mapa de evolução gerado após 5 ciclos completos.
-- É a memória longa da vipeSocial para cada criador.
-- =============================================================

create table public.creator_evolution (
  id uuid default gen_random_uuid() primary key,

  user_id uuid references public.profiles(id)
    on delete cascade not null,

  -- Número do ciclo. Começa em 1, incrementa a cada
  -- conjunto de análise + check-in completo.
  cycle_number integer not null
    check (cycle_number >= 1),

  -- DNA emocional confirmado por dados reais acumulados.
  -- Não o que foi previsto — o que os dados provaram.
  confirmed_emotional_dna jsonb default '{}'::jsonb,

  -- Forças não óbvias identificadas nos desvios positivos.
  -- Coisas que o criador faz naturalmente e performam
  -- acima do previsto sem ele saber que está fazendo.
  non_obvious_strengths jsonb default '[]'::jsonb,

  -- Padrões de sabotagem recorrentes.
  -- Comportamentos que aparecem repetidamente nos fracassos.
  recurring_saboteurs jsonb default '[]'::jsonb,

  -- Nicho adjacente com maior potencial identificado
  -- com base no histórico real de performance.
  adjacent_niche_potential text,

  -- Próximo investimento recomendado em equipamento
  -- com base nas limitações técnicas identificadas.
  -- Ex: "microfone lapela — áudio é o maior limitador atual"
  recommended_next_investment text,

  -- Totais acumulados até esse ciclo.
  total_videos_analyzed integer default 0,
  total_videos_posted integer default 0,

  -- Score médio de performance dos vídeos postados.
  -- Calculado com base nas métricas normalizadas.
  average_performance_score numeric(5,2),

  -- Flag que sinaliza quando o sistema detecta
  -- possível crise de identidade do criador.
  -- Ativado quando watch time cai consistentemente
  -- apesar de manter frequência de postagem.
  identity_crisis_flag boolean default false,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- Um registro por ciclo por usuário.
  unique(user_id, cycle_number)
);

-- Ativa RLS.
alter table public.creator_evolution enable row level security;

create policy "Usuário vê apenas a própria evolução"
  on public.creator_evolution
  for select
  using (auth.uid() = user_id);

create policy "Service role gerencia creator evolution"
  on public.creator_evolution
  for all
  using (auth.role() = 'service_role');

-- Trigger de updated_at.
create trigger creator_evolution_updated_at
  before update on public.creator_evolution
  for each row
  execute function update_updated_at();

-- Índice para buscar evolução de um usuário ordenada por ciclo.
create index creator_evolution_user_id_cycle_idx
  on public.creator_evolution(user_id, cycle_number desc);

-- Índice para encontrar criadores com identity_crisis_flag ativo.
-- Útil para futuras notificações proativas da plataforma.
create index creator_evolution_identity_crisis_idx
  on public.creator_evolution(identity_crisis_flag)
  where identity_crisis_flag = true;