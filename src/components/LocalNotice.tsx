import { exportResults, getResult } from '../lib/storage'
import { signInWithGoogle } from '../lib/supabase'
import { useSession } from '../lib/useSession'
import { GoogleIcon } from './Icons'
import { AFTER_LOGIN_KEY } from '../features/profile/SaveToProfile'

/**
 * Tells people who aren't signed in that their results live only in this browser,
 * and gives them a way to keep them.
 */
export function LocalNotice({ resultId, night = false }: { resultId?: string; night?: boolean }) {
  const { user, configured, ready } = useSession()
  if (!ready || user) return null
  const one = resultId ? getResult(resultId) : undefined
  return (
    <aside className={`local-notice${night ? ' on-night-notice' : ''}`} role="note" aria-label="Your results are not backed up">
      <p>
        <strong>{one ? 'This result is saved only in this browser.' : 'Your results are saved only in this browser.'}</strong>{' '}
        Clearing your browsing data, using a private window or switching devices will erase {one ? 'it' : 'them'}.{' '}
        {configured ? 'Sign in to keep it safe in your profile.' : 'Download a copy to keep it safe. Profiles with sign-in are coming.'}
      </p>
      <div className="local-notice-actions">
        {configured && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              localStorage.setItem(AFTER_LOGIN_KEY, window.location.hash.slice(1) || '/profile')
              signInWithGoogle()
            }}
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        )}
        <button type="button" className={configured ? 'btn btn-quiet' : 'btn'} onClick={() => exportResults(one ? [one] : undefined)}>
          Download a copy
        </button>
      </div>
    </aside>
  )
}
