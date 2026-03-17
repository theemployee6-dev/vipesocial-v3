-- =============================================================
-- MIGRATION 009: Triggers e Funções Automáticas
-- Conecta as tabelas com automações que garantem
-- consistência dos dados sem depender do código da aplicação.
-- Se o código falhar, o banco ainda mantém a integridade.
-- =============================================================

-- =============================================================
-- TRIGGER 1: CRIAÇÃO AUTOMÁTICA DE CHECK-IN
-- Quando uma análise muda para status 'completed',
-- cria automaticamente um check-in pendente para ela.
-- O criador vai receber lembrete em 7 dias.
-- =============================================================

create or replace function public.handle_analysis_completed()
returns trigger as $$
begin
  -- Só executa quando o status muda PARA 'completed'.
  -- OLD é o registro antes da atualização.
  -- NEW é o registro depois da atualização.
  -- Sem essa verificação, o trigger rodaria em qualquer
  -- atualização da análise, não só quando completa.
  if NEW.status = 'completed' and OLD.status != 'completed' then

    -- Cria o check-in pendente para essa análise.
    insert into public.check_ins (
      user_id,
      analysis_id,
      check_in_date,
      was_completed
    ) values (
      NEW.user_id,
      NEW.id,
      -- O check-in é agendado para 7 dias após a conclusão.
      (current_date + interval '7 days')::date,
      false
    );

    -- Incrementa o contador de análises usadas no período.
    -- Isso garante que o limite do plano é respeitado
    -- mesmo se o webhook do Stripe demorar.
    update public.subscriptions
    set analyses_used_this_period = analyses_used_this_period + 1,
        updated_at = now()
    where user_id = NEW.user_id;

  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger que dispara após cada UPDATE na tabela analyses.
create trigger on_analysis_completed
  after update on public.analyses
  for each row
  execute function public.handle_analysis_completed();

-- =============================================================
-- TRIGGER 2: RECALIBRAÇÃO DO CREATOR PROFILE
-- Quando um prompt5_output é inserido,
-- aplica automaticamente as recalibrações recomendadas
-- no creator_profile do criador.
-- =============================================================

create or replace function public.handle_learning_cycle_completed()
returns trigger as $$
declare
  recalibration jsonb;
  new_stage channel_stage;
begin
  recalibration := NEW.profile_recalibration;

  -- Só processa se há recalibrações para aplicar.
  if recalibration is not null and recalibration != '{}'::jsonb then

    -- Atualiza o creator_profile com os dados aprendidos.
    -- Cada campo só é atualizado se a recalibração
    -- trouxer um valor novo para ele.
    update public.creator_profiles
    set
      -- Atualiza nicho principal se a IA identificou mudança.
      primary_niche = coalesce(
        recalibration->>'primary_niche',
        primary_niche
      ),

      -- Atualiza nichos secundários se houver novos.
      secondary_niches = coalesce(
        recalibration->'secondary_niches',
        secondary_niches
      ),

      -- Atualiza referências culturais identificadas.
      cultural_references = coalesce(
        recalibration->'cultural_references',
        cultural_references
      ),

      -- Atualiza o estágio do canal se a IA identificou
      -- que o criador avançou para um novo estágio.
      channel_stage = coalesce(
        (recalibration->>'channel_stage')::channel_stage,
        channel_stage
      ),

      updated_at = now()

    where user_id = NEW.user_id;

  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger que dispara após inserção de prompt5_output.
create trigger on_learning_cycle_completed
  after insert on public.prompt5_outputs
  for each row
  execute function public.handle_learning_cycle_completed();

-- =============================================================
-- TRIGGER 3: DETECÇÃO DE CRISE DE IDENTIDADE
-- Monitora a evolução do criador e sinaliza quando
-- o padrão de performance sugere perda de autenticidade.
-- Ativado quando o watch time médio cai por 3 ciclos
-- consecutivos apesar de manter frequência de postagem.
-- =============================================================

create or replace function public.detect_identity_crisis()
returns trigger as $$
declare
  recent_scores numeric[];
  avg_recent numeric;
  avg_older numeric;
begin
  -- Busca os últimos 3 scores de performance do criador.
  select array_agg(average_performance_score order by cycle_number desc)
  into recent_scores
  from public.creator_evolution
  where user_id = NEW.user_id
    and cycle_number >= NEW.cycle_number - 2
    and average_performance_score is not null;

  -- Só analisa se tiver pelo menos 3 ciclos de dados.
  if array_length(recent_scores, 1) >= 3 then

    -- Média dos últimos 2 ciclos.
    avg_recent := (recent_scores[1] + recent_scores[2]) / 2;

    -- Score do ciclo mais antigo dos 3.
    avg_older := recent_scores[3];

    -- Se houve queda de mais de 30% em 3 ciclos consecutivos,
    -- ativa o flag de crise de identidade.
    if avg_recent < (avg_older * 0.70) then
      update public.creator_evolution
      set identity_crisis_flag = true,
          updated_at = now()
      where id = NEW.id;
    end if;

  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger que dispara após inserção de creator_evolution.
create trigger on_creator_evolution_inserted
  after insert on public.creator_evolution
  for each row
  execute function public.detect_identity_crisis();

-- =============================================================
-- TRIGGER 4: CONTROLE DE LIMITE DE ANÁLISES
-- Impede que um usuário inicie uma análise quando
-- atingiu o limite do plano atual.
-- Verificação dupla — o código da aplicação também verifica,
-- mas o banco é a última linha de defesa.
-- =============================================================

create or replace function public.check_analysis_limit()
returns trigger as $$
declare
  user_subscription record;
begin
  -- Busca a assinatura do usuário.
  select * into user_subscription
  from public.subscriptions
  where user_id = NEW.user_id;

  -- Se não encontrou assinatura, bloqueia.
  -- Situação anômala — todo usuário deveria ter assinatura.
  if not found then
    raise exception 'Assinatura não encontrada para o usuário %', NEW.user_id;
  end if;

  -- Se o status não é ativo nem trialing, bloqueia.
  if user_subscription.status not in ('active', 'trialing') then
    raise exception 'Assinatura inativa. Renove seu plano para continuar.';
  end if;

  -- Se atingiu o limite do plano, bloqueia.
  -- 999999 é o valor usado para planos ilimitados.
  if user_subscription.analyses_used_this_period >=
     user_subscription.analyses_limit then
    raise exception 'Limite de análises do plano atingido. Faça upgrade para continuar.';
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger que dispara ANTES de inserir uma nova análise.
-- before insert permite bloquear a operação lançando exception.
-- after insert seria tarde demais — o registro já estaria criado.
create trigger check_analysis_limit_before_insert
  before insert on public.analyses
  for each row
  execute function public.check_analysis_limit();

-- =============================================================
-- TRIGGER 5: ATUALIZAÇÃO DO TOTAL DE TOKENS
-- Quando um output de prompt é inserido,
-- atualiza automaticamente o total de tokens
-- e custo estimado na tabela analyses.
-- =============================================================

create or replace function public.update_analysis_tokens()
returns trigger as $$
begin
  -- Soma os tokens do novo output ao total da análise.
  update public.analyses
  set
    total_tokens_used = total_tokens_used + NEW.tokens_used,
    -- Custo estimado: Gemini 1.5 Pro custa aproximadamente
    -- $0.00125 por 1000 tokens. Ajuste conforme o modelo usado.
    estimated_cost_usd = estimated_cost_usd +
      (NEW.tokens_used::numeric / 1000 * 0.00125),
    updated_at = now()
  where id = NEW.analysis_id;

  return NEW;
end;
$$ language plpgsql security definer;

-- Aplica o trigger em todos os outputs de prompt.
-- Cada vez que um prompt completa e insere seu output,
-- o custo total da análise é atualizado automaticamente.
create trigger update_tokens_on_prompt1
  after insert on public.prompt1_outputs
  for each row
  execute function public.update_analysis_tokens();

create trigger update_tokens_on_prompt2
  after insert on public.prompt2_outputs
  for each row
  execute function public.update_analysis_tokens();

create trigger update_tokens_on_prompt3
  after insert on public.prompt3_outputs
  for each row
  execute function public.update_analysis_tokens();

create trigger update_tokens_on_prompt4
  after insert on public.prompt4_outputs
  for each row
  execute function public.update_analysis_tokens();

-- =============================================================
-- VIEW: DASHBOARD DO CRIADOR
-- Consolida as informações mais usadas no dashboard
-- em uma única query eficiente.
-- Views não têm RLS próprio — herdam das tabelas base.
-- =============================================================

create or replace view public.creator_dashboard as
select
  p.id as user_id,
  p.full_name,
  p.username,
  p.onboarding_completed,

  -- Dados do creator_profile.
  cp.primary_niche,
  cp.channel_stage,
  cp.socioeconomic_reality,

  -- Dados da assinatura.
  s.plan,
  s.status as subscription_status,
  s.analyses_limit,
  s.analyses_used_this_period,
  -- Análises restantes no período atual.
  (s.analyses_limit - s.analyses_used_this_period) as analyses_remaining,
  s.current_period_end,

  -- Totais de atividade.
  (
    select count(*)
    from public.analyses a
    where a.user_id = p.id
      and a.deleted_at is null
  ) as total_analyses,

  (
    select count(*)
    from public.scripts sc
    where sc.user_id = p.id
      and sc.execution_status = 'posted'
      and sc.deleted_at is null
  ) as total_scripts_posted,

  -- Última análise do criador.
  (
    select a.created_at
    from public.analyses a
    where a.user_id = p.id
      and a.deleted_at is null
    order by a.created_at desc
    limit 1
  ) as last_analysis_at,

  -- Check-in pendente se houver.
  (
    select ci.id
    from public.check_ins ci
    where ci.user_id = p.id
      and ci.was_completed = false
    order by ci.created_at desc
    limit 1
  ) as pending_check_in_id

from public.profiles p
left join public.creator_profiles cp on cp.user_id = p.id
left join public.subscriptions s on s.user_id = p.id
where p.deleted_at is null;
