# Backend runbook

Octanoia runs on one free Supabase project. Google is the only way to sign in, and signing in is optional:
without it, results stay in the browser.

## What lives where

- Schema, rules, rate limit and account deletion: `supabase/migrations/001_init.sql`.
- Security test: `supabase/tests/rls-test.sql` (runs inside a transaction and rolls back).
- Client settings: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, from `.env.local` locally and from
  GitHub repository *variables* in the deploy workflow. Both are public by design; they end up in the browser.
- **Never in the repo or the workflow:** the database password, the secret / `service_role` key, the Google client secret.
  The Google client secret goes only into the Supabase dashboard.

## How the data is protected

| Threat | What stops it |
|---|---|
| Reading someone else's results | Row-level security: every query only returns rows where `user_id` is the signed-in user. Tested in `rls-test.sql`. |
| Writing a result as someone else | `user_id` isn't writable by the browser; the database fills it from the session. |
| Using the public key without signing in | The `anon` role has no access to any table or function. |
| Editing old results | No update permission on `results` at all. |
| Stuffing huge or malformed data | Check constraints: JSON objects only, answers < 16 kB, scores < 2 kB, fixed list of modes, version format, no future dates. |
| A script flooding the database | A trigger allows 30 saves an hour and 500 results per account. Supabase Auth has its own sign-in rate limits. |
| Bots creating accounts with email/password | Email sign-up is turned off in the dashboard (step 4 below). Only Google accounts can exist. |
| Stealing a sign-in by redirecting it elsewhere | PKCE flow, plus an exact list of allowed redirect URLs in Supabase. |
| Injected scripts (XSS) | React escapes all text. Imported files and server rows are validated (`sanitizeResult`). The built page carries a Content-Security-Policy that only allows scripts from the site itself. |
| Malicious npm packages | `npm audit` runs in the deploy workflow and fails on high-severity issues. |
| Traffic floods on the website | GitHub Pages is a static CDN and absorbs this. The database is only reached by signed-in users. |

## Free plan limits that matter here

- 500 MB database. One result is about 3 kB, so this holds well over 100,000 results.
- 50,000 monthly active users for Auth.
- The project **pauses after about a week with no traffic**. Restore it from the Supabase dashboard
  (project, then Restore). Data is kept. While paused, sign-in fails but the test still works offline.
- No automatic backups. For a backup: `npx supabase db dump --db-url "<connection string>" -f backup.sql`,
  and keep the file somewhere safe, never in this repo (`backup*.sql` is git-ignored).

## Changing the schema

1. Add a new numbered file in `supabase/migrations/` (don't edit `001_init.sql` once it has run).
2. Every new table: RLS on, policies, `revoke all ... from anon, authenticated`, then explicit grants to `authenticated` only.
3. Run `supabase/tests/rls-test.sql` and the Security and Performance Advisors in the dashboard.

Against a local Postgres:

```bash
psql -d octanoia -f supabase/tests/local-stub.sql
psql -d octanoia -f supabase/migrations/001_init.sql
psql -d octanoia -f supabase/tests/rls-test.sql     # ends with "rls-test passed"
```
