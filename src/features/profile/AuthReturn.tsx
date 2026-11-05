import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AFTER_LOGIN_KEY } from './SaveToProfile'

/** After Google sign-in returns to the site root, go back to where the user was. */
export function AuthReturn() {
  const nav = useNavigate()
  useEffect(() => {
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== 'SIGNED_IN') return
      const url = new URL(window.location.href)
      if (url.searchParams.has('code')) {
        url.searchParams.delete('code')
        window.history.replaceState(null, '', url.pathname + url.search + url.hash)
      }
      const dest = localStorage.getItem(AFTER_LOGIN_KEY)
      // only ever an in-app route like /results/abc, never another site
      if (dest && /^\/[\w/-]*$/.test(dest) && !dest.startsWith('//')) {
        nav(dest)
      }
      localStorage.removeItem(AFTER_LOGIN_KEY)
    })
    return () => data.subscription.unsubscribe()
  }, [nav])
  return null
}
