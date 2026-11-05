import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { StoredResult } from './storage'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
// The publishable key (sb_publishable_…) or the legacy anon key. Public by design: the
// database rules in supabase/migrations decide what it can do.
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined

/** Null when Supabase isn't configured yet; the app then works fully offline. */
export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true },
      })
    : null

/** Where Google should send the user back: the app root (hash routes live after it). */
export function redirectUrl() {
  return window.location.origin + import.meta.env.BASE_URL
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Sign-in is not configured yet.')
  await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl() } })
}

export async function signOut() {
  await supabase?.auth.signOut()
}

export interface RemoteRow {
  id: string
  created_at: string
  test_version: string
  mode: string
  answers: Record<string, number>
  scores: Record<string, number>
  fits: { topType: string }
  note: string | null
}

/** Postgres errors from our own rules are readable; anything else gets a plain message. */
function friendly(error: { message?: string }): Error {
  const m = error.message ?? ''
  if (/Too many saves|reached 500/.test(m)) return new Error(m)
  if (/JWT|session|auth/i.test(m)) return new Error('Your sign-in has expired. Sign in again to save.')
  return new Error('Couldn’t reach your profile just now. Your result is still on this device.')
}

export async function uploadResult(r: StoredResult): Promise<string> {
  if (!supabase) throw new Error('Sign-in is not configured yet.')
  // user_id is filled in by the database from the session, never sent by the browser
  const { data, error } = await supabase
    .from('results')
    .insert({
      test_version: r.testVersion,
      mode: r.mode,
      answers: r.answers,
      scores: r.scores,
      fits: { topType: r.topType },
      created_at: r.createdAt,
    })
    .select('id')
    .single()
  if (error) throw friendly(error)
  return data.id as string
}

export async function fetchResults(): Promise<RemoteRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('results')
    .select('id, created_at, test_version, mode, answers, scores, fits, note')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw friendly(error)
  return data as RemoteRow[]
}

export async function deleteRemote(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('results').delete().eq('id', id)
  if (error) throw friendly(error)
}

/** Deletes the signed-in account and every result saved to it, then signs out. */
export async function deleteAccount() {
  if (!supabase) return
  const { error } = await supabase.rpc('delete_my_account')
  if (error) throw friendly(error)
  await supabase.auth.signOut()
}
