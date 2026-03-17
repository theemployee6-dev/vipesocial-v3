-- =============================================================
-- MIGRATION 004: Tabela de Videos
-- Guarda metadados de cada vídeo subido pelo criador.
-- O arquivo binário fica no Cloudflare R2.
-- O banco guarda apenas o caminho e informações do vídeo.
-- =============================================================

-- Enum para o status do upload do arquivo.
-- Separado do status de processamento porque são
-- duas etapas distintas — primeiro sobe, depois processa.
create type upload_status as enum (
  'pending',    -- aguardando início do upload
  'uploading',  -- upload em andamento
  'completed',  -- arquivo chegou no R2 com sucesso
  'failed'      -- upload falhou
);

-- Enum para o status do processamento do vídeo.
-- Cada valor é uma etapa do pipeline antes da análise começar.
create type video_processing_status as enum (
  'pending',       -- aguardando início do processamento
  'transcribing',  -- extraindo áudio e transcrevendo
  'extracting',    -- extraindo frames chave do vídeo
  'ready',         -- pronto para ser enviado ao Gemini
  'failed'         -- processamento falhou
);

create table public.videos (
  id uuid default gen_random_uuid() primary key,

  -- Dono do vídeo.
  user_id uuid references public.profiles(id)
    on delete cascade not null,

  -- Caminho do arquivo no Cloudflare R2.
  -- Ex: 'videos/user_id/timestamp_nome_arquivo.mp4'
  -- Nunca guardamos a URL completa — guardamos o path
  -- e construímos a URL quando precisamos acessar.
  storage_path text,

  -- Nome do bucket no R2 onde o arquivo está.
  -- Separado do path para facilitar migração futura
  -- caso precisemos mudar de bucket ou provedor.
  storage_bucket text default 'vipesocial-videos',

  -- Nome original do arquivo enviado pelo criador.
  -- Guardamos para referência — não usamos para acessar o arquivo.
  original_filename text,

  -- Tamanho do arquivo em bytes.
  -- Usado para validação e para mostrar ao usuário.
  file_size_bytes bigint,

  -- Duração do vídeo em segundos.
  -- Preenchido após o processamento extrair essa informação.
  duration_seconds integer,

  -- Tipo do arquivo. Ex: 'video/mp4'
  mime_type text,

  -- Status do upload do arquivo para o R2.
  upload_status upload_status default 'pending' not null,

  -- Status do processamento após o upload completar.
  processing_status video_processing_status default 'pending' not null,

  -- Transcrição completa do áudio em texto.
  -- Gerada pelo Whisper após o upload.
  -- Enviada ao Gemini junto com o vídeo para análise.
  transcription text,

  -- Transcrição com timestamp de cada palavra.
  -- Formato: [{"word": "mano", "start": 0.5, "end": 0.8}, ...]
  -- Usada para análise prosódica do Prompt 1.
  transcription_with_timestamps jsonb default '[]'::jsonb,

  -- Paths dos frames extraídos do vídeo no R2.
  -- Formato: ["frames/id/frame_0.jpg", "frames/id/frame_15.jpg"]
  keyframes jsonb default '[]'::jsonb,

  -- Path do primeiro frame separado por importância.
  -- É o frame que aparece antes do usuário dar play.
  -- Analisado especificamente no Prompt 1 como Frame Zero.
  first_frame_path text,

  -- Se esse vídeo é o que viralizou — o vídeo principal da análise.
  is_viral_reference boolean default false not null,

  -- Se esse vídeo é um que não performou bem.
  -- Submetido para o Prompt 6 de análise de fracasso.
  is_failed_reference boolean default false not null,

  -- Soft delete.
  deleted_at timestamptz,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- Garante que um vídeo não pode ser ao mesmo tempo
  -- referência viral e referência de fracasso.
  constraint viral_or_failed_not_both
    check (not (is_viral_reference = true and is_failed_reference = true))
);

-- Ativa RLS.
alter table public.videos enable row level security;

-- Políticas de segurança.
create policy "Usuário vê apenas os próprios vídeos"
  on public.videos
  for select
  using (auth.uid() = user_id);

create policy "Usuário insere apenas os próprios vídeos"
  on public.videos
  for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza apenas os próprios vídeos"
  on public.videos
  for update
  using (auth.uid() = user_id);

-- Trigger de updated_at.
create trigger videos_updated_at
  before update on public.videos
  for each row
  execute function update_updated_at();

-- Índices para queries frequentes.

-- Buscar todos os vídeos de um usuário ordenados por data.
create index videos_user_id_created_at_idx
  on public.videos(user_id, created_at desc)
  where deleted_at is null;

-- Buscar especificamente os vídeos virais de um usuário.
create index videos_viral_reference_idx
  on public.videos(user_id, is_viral_reference)
  where deleted_at is null and is_viral_reference = true;

-- Buscar vídeos pelo status de processamento.
-- Usado pelo sistema para encontrar vídeos pendentes.
create index videos_processing_status_idx
  on public.videos(processing_status)
  where deleted_at is null and processing_status != 'ready';

-- =============================================================
-- TABELA DE MÉTRICAS DO VÍDEO
-- Separada da tabela de vídeos porque as métricas mudam
-- ao longo do tempo — podemos ter múltiplos registros
-- de métricas para o mesmo vídeo em datas diferentes.
-- =============================================================

-- De onde vieram as métricas.
create type metrics_source as enum (
  'manual_input',  -- usuário digitou manualmente
  'tiktok_api',    -- integração futura com API do TikTok
  'check_in'       -- informado durante o check-in de 7 dias
);

create table public.video_metrics (
  id uuid default gen_random_uuid() primary key,

  -- Vídeo ao qual essas métricas pertencem.
  video_id uuid references public.videos(id)
    on delete cascade not null,

  -- Número de visualizações.
  views bigint default 0 not null,

  -- Número de curtidas.
  likes bigint default 0 not null,

  -- Número de comentários.
  comments integer default 0 not null,

  -- Número de compartilhamentos.
  shares integer default 0 not null,

  -- Número de salvamentos.
  saves integer default 0 not null,

  -- Taxa de replay — quantas vezes as pessoas assistiram de novo.
  -- Nem sempre disponível. Ex: 0.35 significa 35% de replay rate.
  replay_rate numeric(5,2),

  -- Tempo médio de visualização em segundos.
  average_watch_time_seconds numeric(8,2),

  -- Curva de retenção segundo a segundo.
  -- Formato: {"5": 0.95, "10": 0.87, "30": 0.62, "60": 0.41}
  -- Chave é o segundo, valor é a porcentagem ainda assistindo.
  watch_time_by_second jsonb default '{}'::jsonb,

  -- Quando essas métricas foram registradas.
  recorded_at timestamptz default now() not null,

  -- De onde vieram as métricas.
  source metrics_source default 'manual_input' not null,

  created_at timestamptz default now() not null
);

-- Ativa RLS na tabela de métricas.
alter table public.video_metrics enable row level security;

-- Para acessar métricas, o usuário precisa ser dono do vídeo.
-- Essa policy faz um join implícito com a tabela videos.
create policy "Usuário vê métricas dos próprios vídeos"
  on public.video_metrics
  for select
  using (
    exists (
      select 1 from public.videos
      where videos.id = video_metrics.video_id
      and videos.user_id = auth.uid()
    )
  );

create policy "Usuário insere métricas dos próprios vídeos"
  on public.video_metrics
  for insert
  with check (
    exists (
      select 1 from public.videos
      where videos.id = video_metrics.video_id
      and videos.user_id = auth.uid()
    )
  );

-- Índice para buscar métricas de um vídeo ordenadas por data.
create index video_metrics_video_id_recorded_at_idx
  on public.video_metrics(video_id, recorded_at desc);