-- =============================================================
-- MIGRATION 002: Tabela de Profiles
-- Estende o auth.users do Supabase com dados de negócio.
-- Todo usuário da vipeSocial tem exatamente um profile.
-- =============================================================

create table public.profiles (
  -- O ID do profile é o mesmo ID do auth.users.
  -- Isso cria uma relação 1 para 1 entre as duas tabelas.
  -- on delete cascade significa: se o usuário deletar a conta
  -- no Supabase Auth, o profile é deletado automaticamente.
  id uuid references auth.users(id) on delete cascade not null primary key,

  -- Nome completo do criador.
  full_name text,

  -- Handle público único do criador.
  -- Usado na URL do perfil público futuramente.
  -- citext seria ideal mas usamos lower() nas queries.
  username text unique,

  -- URL da foto de perfil guardada no Supabase Storage.
  avatar_url text,

  -- Controla se o criador completou o fluxo de onboarding.
  -- Usado pelo proxy.ts para redirecionar para o onboarding
  -- quando o usuário loga pela primeira vez.
  onboarding_completed boolean default false not null,

  -- Em qual etapa do onboarding o criador parou.
  -- Se ele fechar o navegador no meio, voltamos para onde parou.
  -- 0 = não começou, 1 = sessão de identidade, 2 = referências
  onboarding_step integer default 0 not null,

  -- Soft delete: nunca deletamos profiles com delete real.
  -- Se precisar remover, setamos deleted_at com o timestamp.
  deleted_at timestamptz,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Ativa o Row Level Security na tabela.
-- Sem essa linha, qualquer usuário autenticado pode ver
-- os profiles de todos os outros usuários.
alter table public.profiles enable row level security;

-- Política de leitura: cada usuário só vê o próprio profile.
-- auth.uid() é uma função do Supabase que retorna o ID
-- do usuário autenticado na requisição atual.
create policy "Usuário vê apenas o próprio profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Política de atualização: cada usuário só atualiza o próprio profile.
create policy "Usuário atualiza apenas o próprio profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Política de inserção: usuário só insere o próprio profile.
-- O check garante que o ID inserido é o do usuário autenticado.
create policy "Usuário insere apenas o próprio profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Trigger que chama a função update_updated_at
-- automaticamente antes de cada UPDATE na tabela.
-- Criada na migration 001.
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function update_updated_at();

-- Índice para buscar profiles por username rapidamente.
-- Sem índice, uma busca por username faz um scan completo
-- na tabela — lento quando a plataforma crescer.
create index profiles_username_idx on public.profiles(username)
  where deleted_at is null;

-- =============================================================
-- FUNÇÃO E TRIGGER DE CRIAÇÃO AUTOMÁTICA DE PROFILE
-- Quando um usuário cria conta no Supabase Auth,
-- essa função cria automaticamente um profile para ele.
-- O usuário nunca precisa chamar uma API separada para isso.
-- =============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    -- ID vem do auth.users automaticamente.
    new.id,
    -- Tenta pegar o nome dos metadados do OAuth (Google, etc).
    -- Se não tiver, fica null e o usuário preenche no onboarding.
    new.raw_user_meta_data->>'full_name',
    -- Mesmo para o avatar — pega do OAuth se disponível.
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que dispara a função acima sempre que
-- um novo usuário é inserido no auth.users.
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();