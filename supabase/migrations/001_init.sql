-- Octanoia: profiles + results, private to each user.
-- Run once in the Supabase SQL editor (or with `supabase db push`).
--
-- Security model
--   * Row-level security on every table: a signed-in user only ever sees their own rows.
--   * The anon role (anyone with the public key, signed in or not) gets no table access at all.
--   * Signed-in users get only the columns they need: results can be read, added and deleted,
--     never edited. user_id is filled by the server, so nobody can write a row as someone else.
--   * Size and shape checks stop anyone from stuffing huge blobs into the database, and a
--     per-account rate limit stops a script from flooding it.
--   * delete_my_account() lets a user remove their account and every result in one step.

-- Profiles -----------------------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  avatar_url text check (char_length(avatar_url) <= 500),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

-- Results ------------------------------------------------------------------------------------------

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  test_version text not null check (test_version ~ '^[a-z0-9.-]{1,32}$'),
  mode text not null check (mode in ('quick', 'deep', 'sharpen')),
  answers jsonb not null check (jsonb_typeof(answers) = 'object' and pg_column_size(answers) < 16000),
  scores jsonb not null check (jsonb_typeof(scores) = 'object' and pg_column_size(scores) < 2000),
  fits jsonb not null default '{}'::jsonb check (jsonb_typeof(fits) = 'object' and pg_column_size(fits) < 1000),
  note text check (char_length(note) <= 500),
  -- the browser may send the time the test was taken (for results saved before signing in),
  -- but never a time in the future
  created_at timestamptz not null default now() check (created_at <= now() + interval '10 minutes'),
  inserted_at timestamptz not null default now()
);

create index if not exists results_user_created_idx on public.results (user_id, created_at desc);
create index if not exists results_user_inserted_idx on public.results (user_id, inserted_at desc);

alter table public.results enable row level security;

drop policy if exists results_select on public.results;
create policy results_select on public.results for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists results_insert on public.results;
create policy results_insert on public.results for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists results_delete on public.results;
create policy results_delete on public.results for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.results from anon, authenticated;
grant select, delete on public.results to authenticated;
grant insert (test_version, mode, answers, scores, fits, note, created_at) on public.results to authenticated;

-- Rate limit: at most 30 saves an hour and 500 results in total per account.
create or replace function public.results_rate_limit() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  -- one save at a time per account, so parallel requests can't slip past the count
  perform pg_advisory_xact_lock(hashtext(new.user_id::text));
  if (select count(*) from public.results
      where user_id = new.user_id and inserted_at > now() - interval '1 hour') >= 30 then
    raise exception 'Too many saves in the last hour. Try again later.';
  end if;
  if (select count(*) from public.results where user_id = new.user_id) >= 500 then
    raise exception 'This profile has reached 500 saved results. Delete some to save more.';
  end if;
  new.inserted_at := now();
  return new;
end $$;
revoke execute on function public.results_rate_limit() from public, anon, authenticated;

drop trigger if exists results_rate_limit on public.results;
create trigger results_rate_limit before insert on public.results
  for each row execute function public.results_rate_limit();

-- New users ----------------------------------------------------------------------------------------

-- Create a profile row when someone signs up with Google.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    left(coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), nullif(new.raw_user_meta_data ->> 'name', '')), 80),
    left(coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'), 500)
  )
  on conflict (id) do nothing;
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Account deletion ---------------------------------------------------------------------------------

-- Deletes the caller's account; profile and results go with it (on delete cascade).
create or replace function public.delete_my_account() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = (select auth.uid());
$$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
