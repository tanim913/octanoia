/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * GitHub Pages can't send security headers, so the built page carries its policy in a <meta> tag.
 * Build only: the dev server needs inline scripts for hot reload.
 * Scripts come only from this site; the only servers the page may talk to are Supabase and Google Fonts.
 */
function securityPolicy(supabaseUrl: string | undefined): Plugin {
  let origin = ''
  try {
    if (supabaseUrl) origin = new URL(supabaseUrl).origin
  } catch {
    // a malformed URL just leaves sign-in off; the policy stays strict
  }
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    `connect-src 'self'${origin ? ` ${origin}` : ''}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
  return {
    name: 'octanoia-security-policy',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: csp }, injectTo: 'head-prepend' },
      { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
    ],
  }
}

// GitHub Pages project site: https://<user>.github.io/octanoia/
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  return {
    base: env.VITE_BASE ?? '/',
    plugins: [react(), securityPolicy(env.VITE_SUPABASE_URL)],
    test: { environment: 'node', include: ['src/**/*.test.ts'] },
  }
})
