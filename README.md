# Octanoia · the eight functions of your mind

Octanoia is a free, transparent cognitive-function test. The questions are short everyday scenes, and every score shows the answers that produced it. Type is presented as ranked fits on a spectrum, not a box. The content is grounded in Jung, Isabel Myers, Lenore Thomson and John Beebe; see `knowledge/`.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # engine, item-bank lint, 16-type simulations
npm run build    # production build in dist/
```

Without Supabase keys the whole app still works: results are saved in the browser, and Google sign-in is hidden.

## Project map

| Path | What it is |
|---|---|
| `knowledge/` | Research digests of the four books, the item style guide, the scoring model and the design direction |
| `src/engine/` | Pure scoring: acquiescence correction, function scores, clarity, ledger, type fit |
| `src/data/items/` | Item bank. `quick.ts` holds 64 items; `deep.ts` adds 96 more, for 160 in Deep mode |
| `src/data/` | Function profiles, per-type notes, interludes |
| `src/scenes/` | The three.js constellation, plus a 2D fallback |
| `src/features/` | Landing, test, results, library, profile |
| `supabase/migrations/` | Database schema, row-level security, rate limit, account deletion |
| `supabase/tests/` | RLS security test (rolls back) |
| `docs/BACKEND.md` | Security model, free-plan limits, backups |

`knowledge_core_books/` holds the source books. It is git-ignored and must never be committed.

## Going live

Live at [tanim913.github.io/octanoia](https://tanim913.github.io/octanoia/) once deployed. Security model and maintenance: [`docs/BACKEND.md`](docs/BACKEND.md).

### 1. Supabase project

1. At [supabase.com](https://supabase.com), create a new project named `octanoia` (free plan, region closest to you). Save the database password in a password manager; the app never needs it.
2. **SQL Editor:** paste all of `supabase/migrations/001_init.sql` and run it. Then paste `supabase/tests/rls-test.sql` and run it; the last line should say `rls-test passed`.
3. **Project Settings → API Keys:** copy the Project URL and the **publishable** key (`sb_publishable_…`). Don't copy the secret key anywhere.

### 2. Google OAuth client

Use a new Google Cloud project (so the consent screen says "Octanoia", not another app's name).

1. [console.cloud.google.com](https://console.cloud.google.com): create project `octanoia`.
2. **Google Auth Platform → Branding:** app name `Octanoia`, your support email, home page `https://tanim913.github.io/octanoia/`, privacy policy `https://tanim913.github.io/octanoia/#/privacy`. Authorised domains: `<project-ref>.supabase.co` and `tanim913.github.io`.
3. **Audience:** External. Then **Publish app** (in production). The default scopes (email, profile, openid) need no Google review. Left in testing, only listed test users can sign in.
4. **Clients → Create client → Web application:**
   - Authorised JavaScript origins: `https://tanim913.github.io` and `http://localhost:5173`
   - Authorised redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback` (copy it from Supabase, next step)
5. Copy the client ID and client secret.

### 3. Connect them in Supabase

1. **Authentication → Sign In / Providers → Google:** enable, paste client ID and secret, save.
2. Same page: **turn off Email** (and Phone). Keep "Allow anonymous sign-ins" off. This stops bots from creating email accounts with the public key.
3. **Authentication → URL Configuration:**
   - Site URL: `https://tanim913.github.io/octanoia/`
   - Redirect URLs: `https://tanim913.github.io/octanoia/` and `http://localhost:5173/` (exact URLs, no wildcards).
4. **Advisors → Security Advisor:** run it; it should report no errors.

### 4. GitHub

1. Push this project to `main` of `github.com/tanim913/octanoia`.
2. **Settings → Secrets and variables → Actions → Variables tab:** add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. They are public values, so they're variables, not secrets.
3. **Settings → Pages:** Source = **GitHub Actions**.
4. **Settings → Code security:** turn on Dependabot alerts and secret scanning.
5. **Actions tab:** re-run the "Deploy to GitHub Pages" workflow (or push any commit). It runs `npm audit`, the tests and the build, then publishes.

### 5. Check it

- Open the site, take the Quick test, then Profile → Sign in with Google. You should come back to the same page, signed in.
- Save a result, then sign in on another browser: the result is there.
- Local development with sign-in: copy `.env.example` to `.env.local`, fill in the two values, `npm run dev`.

Routes use hash URLs (`#/results/…`), so deep links work on GitHub Pages. Sign-in uses the PKCE flow: Google returns to the site root and the app sends the user back to the page they started from.

## Changing the test

- New items must pass `src/data/items/__tests__/lint.test.ts`. The test checks:
  - balance per function and facet
  - no banned words
  - a `why` note and at least one source on every item
  - no resemblance to Sakinorva items
- If you change items or scoring, bump `TEST_VERSION` in `src/engine/model.ts`. Results store their raw answers, so they can be re-scored.

## Credits

The landing-page pictures come from Wikimedia Commons:

- Jung around 1910 (public domain)
- Burghölzli engraving (public domain)
- Doppelmayr's 1730 celestial chart (public domain)
- "Medieval music", Wellcome Collection (CC BY 4.0)

Full credits are in `public/img/credits.json` and at the foot of the landing page.

© 2026 [K M Azizullah Tanim](https://github.com/tanim913). All rights reserved.

Octanoia is not the Myers-Briggs Type Indicator® and is not affiliated with its publisher or with the authors it cites.
