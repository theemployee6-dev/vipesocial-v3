-- Corrige o trigger de criação automática de subscription
-- analyses_limit deve começar em 1 para trial
-- e ser atualizado pelo webhook do Stripe após o pagamento

create or replace function public.handle_new_subscription()
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
    1,  -- 1 análise grátis no trial
    0
  );
  return new;
end;
$$ language plpgsql security definer;

