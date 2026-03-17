-- =============================================================
-- MIGRATION 008: Tabelas de Negócio
-- Controla assinaturas, uso e logs de custo.
-- Toda decisão de acesso a funcionalidades passa por aqui.
-- =============================================================

create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,

  -- Dono da assinatura.
  user_id uuid references public.profiles(id)
    on delete cascade not null unique,

  -- ID do cliente no Stripe.
  -- Criado automaticamente quando o usuário faz checkout.
  -- Null até o primeiro checkout ser iniciado.
  stripe_customer_id text unique,

  -- ID da assinatura no Stripe.
  -- Null enquanto estiver no trial gratuito.
  stripe_subscription_id text unique,

  -- Plano atual usando enum da migration 001.
  plan subscription_plan default 'starter' not null,

  -- Status atual usando enum da migration 001.
  status subscription_status default 'trialing' not null,

  -- Período atual da assinatura.
  -- Atualizado pelo webhook do Stripe a cada renovação.
  current_period_start timestamptz,
  current_period_end timestamptz,

  -- Se a assinatura vai cancelar no fim do período atual.
  -- True quando o usuário pede cancelamento mas ainda
  -- tem acesso até o fim do período pago.
  cancel_at_period_end boolean default false not null,

  -- Limite de análises do plano atual.
  -- starter: 2 análises por mês
  -- growth: 10 análises por mês
  -- scale: análises ilimitadas (999999)
  analyses_limit integer default 2 not null,

  -- Quantas análises foram usadas no período atual.
  -- Resetado automaticamente a cada renovação pelo webhook.
  analyses_used_this_period integer default 0 not null,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Ativa RLS.
alter table public.subscriptions enable row level security;

-- Usuário vê apenas a própria assinatura.
create policy "Usuário vê apenas a própria assinatura"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- Usuário não atualiza assinatura diretamente.
-- Apenas o webhook do Stripe via service_role atualiza.
create policy "Service role gerencia assinaturas"
  on public.subscriptions
  for all
  using (auth.role() = 'service_role');

-- Trigger de updated_at.
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function update_updated_at();

-- Índice para buscar assinatura pelo stripe_customer_id.
-- Query mais comum no webhook do Stripe.
create index subscriptions_stripe_customer_id_idx
  on public.subscriptions(stripe_customer_id);

-- Índice para buscar pelo stripe_subscription_id.
create index subscriptions_stripe_subscription_id_idx
  on public.subscriptions(stripe_subscription_id);

-- =============================================================
-- FUNÇÃO DE CRIAÇÃO AUTOMÁTICA DE ASSINATURA
-- Quando um profile é criado, cria automaticamente
-- uma assinatura no plano starter em período de trial.
-- Todo usuário novo tem acesso imediato sem precisar
-- inserir cartão de crédito.
-- =============================================================

create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.subscriptions (
    user_id,
    plan,
    status,
    analyses_limit,
    analyses_used_this_period
  ) values (
    new.id,
    'starter',
    'trialing',
    2,    -- 2 análises gratuitas para testar
    0
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que cria a assinatura quando o profile é criado.
-- Lembra que o profile é criado automaticamente quando
-- o usuário cria conta — então esse trigger garante que
-- todo usuário novo já tem uma assinatura de trial.
create trigger on_profile_created
  after insert on public.profiles
  for each row
  execute function public.handle_new_profile();

-- =============================================================
-- TABELA DE LOGS DE USO
-- Registra cada operação de IA com custo e latência.
-- Essencial para controle financeiro e debugging.
-- =============================================================

-- Tipo de operação realizada.
create type operation_type as enum (
  'prompt1',        -- execução do Prompt 1
  'prompt2',        -- execução do Prompt 2
  'prompt3',        -- execução do Prompt 3
  'prompt4',        -- execução do Prompt 4
  'prompt5',        -- execução do Prompt 5
  'prompt6',        -- execução do Prompt 6
  'transcription',  -- transcrição de áudio
  'frame_extraction' -- extração de frames
);

-- Status da operação.
create type operation_status as enum (
  'success',  -- operação completou com sucesso
  'failed',   -- operação falhou
  'retried'   -- falhou e foi tentada novamente
);

create table public.usage_logs (
  id uuid default gen_random_uuid() primary key,

  -- Dono da operação.
  user_id uuid references public.profiles(id)
    on delete cascade not null,

  -- Análise relacionada se houver.
  analysis_id uuid references public.analyses(id)
    on delete set null,

  -- Tipo de operação realizada.
  operation_type operation_type not null,

  -- Tokens consumidos nessa operação.
  -- Input são os tokens enviados ao Gemini.
  -- Output são os tokens recebidos do Gemini.
  tokens_input integer default 0,
  tokens_output integer default 0,
  total_tokens integer default 0,

  -- Custo estimado em USD dessa operação específica.
  -- Calculado com base no modelo e quantidade de tokens.
  estimated_cost_usd numeric(10,6) default 0,

  -- Qual modelo do Gemini foi usado.
  -- Ex: 'gemini-1.5-pro', 'gemini-2.0-flash'
  gemini_model_used text,

  -- Tempo de resposta em milissegundos.
  -- Usado para monitorar degradação de performance da API.
  latency_ms integer,

  -- Status da operação.
  status operation_status default 'success' not null,

  -- Mensagem de erro se falhou.
  error_message text,

  created_at timestamptz default now() not null
);

-- Ativa RLS.
alter table public.usage_logs enable row level security;

-- Usuário vê apenas os próprios logs.
create policy "Usuário vê apenas os próprios logs"
  on public.usage_logs
  for select
  using (auth.uid() = user_id);

-- Apenas service_role insere logs.
-- O sistema registra o uso, não o usuário.
create policy "Service role insere usage logs"
  on public.usage_logs
  for insert
  with check (auth.role() = 'service_role');

-- Índices para queries frequentes.

-- Buscar logs de um usuário em um período.
-- Query mais comum — calcular custo mensal.
create index usage_logs_user_id_created_at_idx
  on public.usage_logs(user_id, created_at desc);

-- Buscar logs de uma análise específica.
create index usage_logs_analysis_id_idx
  on public.usage_logs(analysis_id);

-- Buscar logs por tipo de operação.
-- Útil para análise de custo por tipo de operação.
create index usage_logs_operation_type_idx
  on public.usage_logs(operation_type, created_at desc);

-- =============================================================
-- TABELA DE WAITLIST
-- Captura interesse antes e durante o lançamento.
-- Separada do sistema de auth — não precisa de conta.
-- =============================================================

create table public.waitlist (
  id uuid default gen_random_uuid() primary key,

  email text not null unique,
  name text,

  -- Handle do TikTok para entender o perfil de quem se cadastrou.
  tiktok_handle text,

  -- Faixa de seguidores para segmentação.
  -- Ex: "0-1000", "1000-10000", "10000-100000", "100000+"
  follower_count_range text,

  -- Nicho principal para entender a demanda por nicho.
  primary_niche text,

  -- Como a pessoa conheceu a vipeSocial.
  -- Ex: "tiktok", "instagram", "indicacao", "google"
  referral_source text,

  -- Se já foi convidado a criar conta.
  invited_at timestamptz,

  created_at timestamptz default now() not null
);

-- Waitlist é pública para escrita — qualquer pessoa
-- pode se cadastrar sem estar autenticada.
-- Mas apenas service_role pode ler — dados internos.
alter table public.waitlist enable row level security;

create policy "Qualquer pessoa pode entrar na waitlist"
  on public.waitlist
  for insert
  with check (true);

create policy "Service role lê a waitlist"
  on public.waitlist
  for select
  using (auth.role() = 'service_role');

-- Índice no email para verificar duplicatas rapidamente.
create index waitlist_email_idx on public.waitlist(email);

-- Índice para buscar quem ainda não foi convidado.
create index waitlist_not_invited_idx
  on public.waitlist(invited_at)
  where invited_at is null;