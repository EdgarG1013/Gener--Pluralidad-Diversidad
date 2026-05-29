-- ============================================================
-- Juego Educativo Inclusivo — Esquema de base de datos
-- Ejecutar en el SQL Editor de Supabase (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. Tabla principal de sesiones ───────────────────────────────────────────

create table if not exists game_sessions (
  id           uuid primary key default gen_random_uuid(),
  session_code text unique not null,
  game_state   jsonb not null default '{}',
  host_name    text,
  status       text not null default 'waiting'
                    check (status in ('waiting', 'playing', 'finished')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_game_sessions_code
  on game_sessions (session_code);

-- ── 2. Trigger updated_at ────────────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists game_sessions_updated_at on game_sessions;
create trigger game_sessions_updated_at
  before update on game_sessions
  for each row execute procedure update_updated_at();

-- ── 3. REPLICA IDENTITY FULL (necesario para postgres_changes con filtros) ───
--   También requerido por Supabase Realtime para emitir el registro completo
--   en los eventos UPDATE/DELETE.

alter table game_sessions replica identity full;

-- ── 4. Publicación Realtime ───────────────────────────────────────────────────
--   Habilita que Supabase Realtime escuche cambios en esta tabla.
--   (El Broadcast no necesita esto, pero lo dejamos por si acaso.)

alter publication supabase_realtime add table game_sessions;

-- ── 5. Row Level Security ─────────────────────────────────────────────────────

alter table game_sessions enable row level security;

-- Cualquier cliente (anon o autenticado) puede leer sesiones
create policy "Sesiones: lectura pública"
  on game_sessions for select
  using (true);

-- Cualquier cliente puede crear sesiones
create policy "Sesiones: insertar"
  on game_sessions for insert
  with check (true);

-- Cualquier cliente puede actualizar sesiones (el juego valida el acceso)
create policy "Sesiones: actualizar"
  on game_sessions for update
  using (true);

-- ── 6. Tabla de preguntas (gestión futura desde Supabase) ────────────────────

create table if not exists questions (
  id             serial primary key,
  question       text not null,
  options        jsonb not null,       -- array de 4 strings
  correct_answer int  not null,        -- índice 0-3
  explanation    text not null,
  topic          text,
  difficulty     text not null default 'medium'
                      check (difficulty in ('easy', 'medium', 'hard')),
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

alter table questions enable row level security;
create policy "Preguntas: lectura pública"
  on questions for select
  using (active = true);

-- ── 7. Historial de partidas ──────────────────────────────────────────────────

create table if not exists game_results (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid references game_sessions(id) on delete set null,
  winner_name   text not null,
  winner_avatar text,
  players       jsonb not null,
  total_turns   int,
  created_at    timestamptz not null default now()
);

alter table game_results enable row level security;
create policy "Resultados: lectura pública"
  on game_results for select using (true);
create policy "Resultados: insertar"
  on game_results for insert with check (true);

-- ── 8. Limpieza automática de sesiones antiguas (opcional) ───────────────────
--   Elimina sesiones terminadas o abandonadas después de 24 horas.
--   Requiere la extensión pg_cron (disponible en Supabase Pro).
--   Descomenta si tienes pg_cron habilitado:

-- select cron.schedule(
--   'cleanup-old-sessions',
--   '0 3 * * *',  -- cada día a las 3 AM UTC
--   $$
--     delete from game_sessions
--     where updated_at < now() - interval '24 hours'
--       and status in ('finished', 'waiting');
--   $$
-- );
