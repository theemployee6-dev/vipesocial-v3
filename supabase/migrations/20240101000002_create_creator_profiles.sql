-- =============================================================
-- MIGRATION 003: Tabela de Creator Profiles
-- Guarda o Perfil Base do criador inferido pela IA.
-- Só existe após o onboarding ser completado.
-- É a tabela que torna a vipeSocial personalizada —
-- sem ela todos os criadores receberiam análises genéricas.
-- =============================================================

create table public.creator_profiles (
  id uuid default gen_random_uuid() primary key,

  -- Referência ao profile do usuário.
  -- Um criador tem exatamente um creator_profile.
  -- Se o profile for deletado, o creator_profile também é.
  user_id uuid references public.profiles(id)
    on delete cascade not null unique,

  -- Realidade socioeconômica inferida pela IA durante onboarding.
  -- Usa o enum criado na migration 001.
  -- Null enquanto o onboarding não for completado.
  socioeconomic_reality socioeconomic_reality,

  -- Nível de confiança da inferência socioeconômica.
  -- Valor entre 0 e 1. Ex: 0.85 significa 85% de confiança.
  -- Usado internamente para decidir se pede confirmação ao usuário.
  socioeconomic_confidence numeric(3,2)
    check (socioeconomic_confidence >= 0 and socioeconomic_confidence <= 1),

  -- Dados geográficos do criador.
  age integer check (age >= 13 and age <= 100),
  city text,
  state text,

  -- Região inferida automaticamente da cidade.
  -- norte, nordeste, centro-oeste, sudeste, sul
  region text,

  -- Arquétipos de identidade identificados pela IA.
  -- Ex: 'aspiracional', 'humorista', 'educador', 'confessional'
  identity_archetype_primary text,
  identity_archetype_secondary text,

  -- Estágio atual do canal usando enum da migration 001.
  channel_stage channel_stage default 'beginner' not null,

  -- Quantas horas por semana o criador tem para produzir conteúdo.
  -- Afeta as recomendações de frequência de postagem.
  weekly_production_hours integer
    check (weekly_production_hours >= 0 and weekly_production_hours <= 168),

  -- Celular que o criador usa para gravar.
  -- Afeta as instruções de setup nos roteiros.
  -- Ex: 'iPhone SE', 'Samsung A54', 'Motorola G82'
  recording_device text,

  -- Se o criador tem um espaço dedicado para gravar.
  -- False = grava no quarto, cozinha, rua.
  -- Afeta as instruções de cenário nos roteiros.
  has_dedicated_space boolean default false,

  -- Array JSON de referências culturais mapeadas.
  -- Ex: ["funk", "pagode", "Netflix", "TikTok"]
  -- Afeta o vocabulário e referências nos roteiros gerados.
  cultural_references jsonb default '[]'::jsonb,

  -- O que o criador disse que nunca postaria.
  -- Usado para garantir que os roteiros respeitam esses limites.
  -- Ex: ["conteúdo político", "vida amorosa", "família"]
  identity_limits jsonb default '[]'::jsonb,

  -- Nicho principal confirmado pelo criador.
  primary_niche text,

  -- Nichos adjacentes com potencial identificados pela IA.
  -- Ex: ["motivação", "empreendedorismo"]
  secondary_niches jsonb default '[]'::jsonb,

  -- Todas as respostas brutas da sessão de onboarding.
  -- Guardamos o raw para poder reprocessar com prompts
  -- mais avançados no futuro sem precisar refazer o onboarding.
  raw_session_data jsonb default '{}'::jsonb,

  -- Soft delete.
  deleted_at timestamptz,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Ativa RLS.
alter table public.creator_profiles enable row level security;

-- Políticas de segurança.
-- Mesmo padrão do profiles — usuário só acessa o próprio dado.
create policy "Usuário vê apenas o próprio creator profile"
  on public.creator_profiles
  for select
  using (auth.uid() = user_id);

create policy "Usuário atualiza apenas o próprio creator profile"
  on public.creator_profiles
  for update
  using (auth.uid() = user_id);

create policy "Usuário insere apenas o próprio creator profile"
  on public.creator_profiles
  for insert
  with check (auth.uid() = user_id);

-- Trigger de updated_at.
create trigger creator_profiles_updated_at
  before update on public.creator_profiles
  for each row
  execute function update_updated_at();

-- Índice para buscar por user_id rapidamente.
-- Essa vai ser a query mais comum — buscar o perfil
-- do usuário logado para personalizar a análise.
create index creator_profiles_user_id_idx
  on public.creator_profiles(user_id)
  where deleted_at is null;

-- Índice para buscar por nicho.
-- Útil futuramente para analytics internos da plataforma.
create index creator_profiles_primary_niche_idx
  on public.creator_profiles(primary_niche)
  where deleted_at is null;