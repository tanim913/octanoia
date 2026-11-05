-- Security test for the Octanoia schema. Run the whole file at once (SQL editor or psql).
-- It rolls back, so nothing is kept. Any failed expectation raises; reaching the end means it passed.
begin;

create function pg_temp.expect_error(p_sql text, p_msg text) returns void language plpgsql as $$
begin
  execute p_sql;
  raise exception 'expected error "%" from: %', p_msg, p_sql using errcode = 'P0099';
exception
  when sqlstate 'P0099' then raise;
  when others then
    if sqlerrm not ilike '%' || p_msg || '%' then
      raise exception 'expected "%" from: %, got "%"', p_msg, p_sql, sqlerrm;
    end if;
end $$;
create function pg_temp.as_user(p text) returns void language sql as $$
  select set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-0000-0000-00000000000' || p || '"}', true);
$$;
create function pg_temp.expect(p_ok boolean, p_what text) returns void language plpgsql as $$
begin
  if not coalesce(p_ok, false) then raise exception 'failed: %', p_what; end if;
end $$;
grant execute on all functions in schema pg_temp to anon, authenticated;

insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a@test.invalid', '{"full_name":"Ada"}'),
  ('00000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'b@test.invalid', '{"name":"Bo"}');

select pg_temp.expect((select display_name from public.profiles where id = '00000000-0000-0000-0000-00000000000b') = 'Bo',
  'profile created from Google name');

-- 1. anon (the public key, not signed in) can touch nothing
set local role anon;
select pg_temp.expect_error('select * from public.results', 'permission denied');
select pg_temp.expect_error('select * from public.profiles', 'permission denied');
select pg_temp.expect_error($q$insert into public.results (test_version, mode, answers, scores) values ('x', 'quick', '{}', '{}')$q$, 'permission denied');
select pg_temp.expect_error('select public.delete_my_account()', 'permission denied');
reset role;

-- 2. A saves a result; user_id comes from the session
set local role authenticated;
select pg_temp.as_user('a');
insert into public.results (test_version, mode, answers, scores) values ('octanoia-1', 'quick', '{"q1":2}', '{"Ni":70}');
select pg_temp.expect((select count(*) from public.results) = 1, 'A sees own result');
select pg_temp.expect((select user_id from public.results) = '00000000-0000-0000-0000-00000000000a', 'user_id set by server');

-- A cannot write as B, edit a result, or set server columns
select pg_temp.expect_error($q$insert into public.results (user_id, test_version, mode, answers, scores) values ('00000000-0000-0000-0000-00000000000b', 'octanoia-1', 'quick', '{}', '{}')$q$, 'permission denied');
select pg_temp.expect_error($q$update public.results set mode = 'deep'$q$, 'permission denied');
select pg_temp.expect_error($q$insert into public.results (inserted_at, test_version, mode, answers, scores) values (now(), 'octanoia-1', 'quick', '{}', '{}')$q$, 'permission denied');
select pg_temp.expect_error('update public.profiles set display_name = $$x$$', 'permission denied');

-- shape and size checks
select pg_temp.expect_error($q$insert into public.results (test_version, mode, answers, scores) values ('octanoia-1', 'evil', '{}', '{}')$q$, 'check constraint');
select pg_temp.expect_error($q$insert into public.results (test_version, mode, answers, scores) values ('<script>', 'quick', '{}', '{}')$q$, 'check constraint');
select pg_temp.expect_error($q$insert into public.results (test_version, mode, answers, scores) values ('octanoia-1', 'quick', '[1,2]', '{}')$q$, 'check constraint');
select pg_temp.expect_error($q$insert into public.results (test_version, mode, answers, scores) values ('octanoia-1', 'quick', jsonb_build_object('x', repeat('a', 40000)), '{}')$q$, 'check constraint');
select pg_temp.expect_error($q$insert into public.results (test_version, mode, answers, scores, created_at) values ('octanoia-1', 'quick', '{}', '{}', now() + interval '1 day')$q$, 'check constraint');

-- 3. B sees none of A's rows and cannot delete them
select pg_temp.as_user('b');
select pg_temp.expect((select count(*) from public.results) = 0, 'B cannot see A results');
select pg_temp.expect((select count(*) from public.profiles) = 1, 'B sees only own profile');
delete from public.results;
select pg_temp.as_user('a');
select pg_temp.expect((select count(*) from public.results) = 1, 'B could not delete A results');

-- 4. rate limit: 30 saves an hour
insert into public.results (test_version, mode, answers, scores)
  select 'octanoia-1', 'quick', '{}', '{}' from generate_series(1, 29);
select pg_temp.expect_error($q$insert into public.results (test_version, mode, answers, scores) values ('octanoia-1', 'quick', '{}', '{}')$q$, 'Too many saves');

-- 5. A deletes their own result, then their account
delete from public.results where id = (select id from public.results limit 1);
select pg_temp.expect((select count(*) from public.results) = 29, 'A deletes own result');
select public.delete_my_account();
reset role;
select pg_temp.expect(not exists (select 1 from auth.users where id = '00000000-0000-0000-0000-00000000000a'), 'account deleted');
select pg_temp.expect(not exists (select 1 from public.results where user_id = '00000000-0000-0000-0000-00000000000a'), 'results deleted with account');
select pg_temp.expect(exists (select 1 from auth.users where id = '00000000-0000-0000-0000-00000000000b'), 'B untouched');

select 'rls-test passed' as result;
rollback;
