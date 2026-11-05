import { useState } from 'react'
import { getResult, saveResult } from '../../lib/storage'
import { signInWithGoogle, uploadResult } from '../../lib/supabase'
import { useSession } from '../../lib/useSession'

export const AFTER_LOGIN_KEY = 'octanoia.afterLogin'

/** Save one local result to the signed-in user's profile, or prompt to sign in. */
export function SaveToProfile({ resultId }: { resultId: string }) {
  const { user, configured } = useSession()
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>(() =>
    getResult(resultId)?.remoteId ? 'saved' : 'idle',
  )
  const [err, setErr] = useState('')

  if (!configured) {
    return <p className="small muted">This result is saved on this device. Profiles with Google sign-in arrive once the site’s account service is connected.</p>
  }
  if (state === 'saved') return <p className="small">Saved to your profile.</p>

  if (!user) {
    return (
      <button
        type="button"
        className="btn"
        onClick={() => {
          localStorage.setItem(AFTER_LOGIN_KEY, window.location.hash.slice(1) || '/profile')
          signInWithGoogle().catch((e) => setErr(String(e.message ?? e)))
        }}
      >
        Sign in with Google to save
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        className="btn"
        disabled={state === 'saving'}
        onClick={async () => {
          const r = getResult(resultId)
          if (!r) return
          setState('saving')
          try {
            const remoteId = await uploadResult(r)
            saveResult({ ...r, remoteId })
            setState('saved')
          } catch (e) {
            setErr((e as Error).message)
            setState('error')
          }
        }}
      >
        {state === 'saving' ? 'Saving…' : 'Save to my profile'}
      </button>
      {err && <p className="small" style={{ color: 'var(--bad)' }}>{err}</p>}
    </>
  )
}
