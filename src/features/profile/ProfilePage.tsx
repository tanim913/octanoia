import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Footer, NoteChip, TopBar } from '../../components/Shell'
import { PROFILES } from '../../data/functions'
import { FUNCTIONS, type Fn } from '../../engine/model'
import { fitTypes } from '../../engine/typeFit'
import { exportResults, importResults, loadResults, sanitizeResult, saveResult, type StoredResult } from '../../lib/storage'
import { LocalNotice } from '../../components/LocalNotice'
import { GoogleIcon, LogOutIcon, TrashIcon } from '../../components/Icons'
import { tierOf } from '../../data/readings'
import { NoteForm } from '../../three/Stage'
import { deleteAccount, deleteRemote, fetchResults, signInWithGoogle, signOut, uploadResult } from '../../lib/supabase'
import { useSession } from '../../lib/useSession'
import { AFTER_LOGIN_KEY } from './SaveToProfile'
import './profile.css'

function mergeHistory(local: StoredResult[], remote: StoredResult[]): StoredResult[] {
  const seen = new Set(local.map((l) => l.remoteId).filter(Boolean))
  const all = [...local, ...remote.filter((r) => !seen.has(r.remoteId))]
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export default function ProfilePage() {
  const { user, configured, ready } = useSession()
  const [local, setLocal] = useState(loadResults)
  const [remote, setRemote] = useState<StoredResult[]>([])
  const [msg, setMsg] = useState('')
  const nav = useNavigate()
  const name: string = user?.user_metadata?.full_name ?? user?.email ?? ''

  const refresh = useCallback(async () => {
    setLocal(loadResults())
    if (!user) return setRemote([])
    try {
      const rows = await fetchResults()
      setRemote(
        rows
          .map((r) =>
            sanitizeResult({
              id: `remote-${r.id}`,
              remoteId: r.id,
              createdAt: r.created_at,
              testVersion: r.test_version,
              mode: r.mode,
              answers: r.answers,
              scores: r.scores,
              topType: r.fits?.topType,
            }),
          )
          .filter((r): r is StoredResult => r !== null),
      )
    } catch (e) {
      setMsg((e as Error).message)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const history = useMemo(() => mergeHistory(local, remote), [local, remote])
  const unsynced = local.filter((r) => !r.remoteId)
  const recent = history.slice(0, 3)
  const reflection = useMemo(() => {
    if (!recent.length) return null
    const avg = Object.fromEntries(
      FUNCTIONS.map((f) => [f, recent.reduce((s, r) => s + r.scores[f], 0) / recent.length]),
    ) as Record<Fn, number>
    return { avg, fit: fitTypes(avg) }
  }, [recent])

  const [cmp, setCmp] = useState<[string, string] | null>(null)
  const pair = cmp ?? (history.length >= 2 ? [history[1].id, history[0].id] : null)

  const open = (r: StoredResult) => {
    if (!getLocal(r.id)) saveResult(r)
    nav(`/results/${r.id}`)
  }

  return (
    <div>
      <TopBar />
      <main className="wrap profile">
        <header className="profile-head">
          <h1 className="display">Your profile</h1>
          {(configured || !history.length || msg) && (
          <div className="account panel">
              {!configured && !history.length && (
                <p className="small">
                  Your results are kept on this device. Google sign-in will appear here once the site’s account service is connected.
                </p>
              )}
              {configured && ready && !user && (
                <>
                  <p>Sign in to keep your results across devices and watch how your notes change over time.</p>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      localStorage.setItem(AFTER_LOGIN_KEY, '/profile')
                      signInWithGoogle().catch((e) => setMsg(e.message))
                    }}
                  >
                    <GoogleIcon />
                    Sign in with Google
                  </button>
                </>
              )}
              {user && (
                <div className="account-in">
                  <div className="account-who">
                    <span className="avatar" aria-hidden="true">{initials(name)}</span>
                    <div>
                      <p className="account-name">{name}</p>
                      <p className="small muted account-mail">Signed in · {user.email}</p>
                    </div>
                  </div>
                  {unsynced.length > 0 && (
                    <button
                      type="button"
                      className="btn"
                      onClick={async () => {
                        try {
                          for (const r of unsynced) saveResult({ ...r, remoteId: await uploadResult(r) })
                          setMsg(`Saved ${unsynced.length} result${unsynced.length > 1 ? 's' : ''} to your profile.`)
                          refresh()
                        } catch (e) {
                          setMsg((e as Error).message)
                        }
                      }}
                    >
                      Save {unsynced.length} result{unsynced.length > 1 ? 's' : ''} from this device
                    </button>
                  )}
                  <div className="account-actions">
                    <button type="button" className="btn btn-quiet" onClick={() => signOut().then(refresh)}>
                      <LogOutIcon />
                      Sign out
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={async () => {
                        if (!confirm('Delete your account and every result saved to it? Results kept on this device stay here. This can’t be undone.')) return
                        try {
                          await deleteAccount()
                          for (const r of loadResults()) if (r.remoteId) saveResult({ ...r, remoteId: undefined })
                          setMsg('Your account and saved results are deleted.')
                          refresh()
                        } catch (e) {
                          setMsg((e as Error).message)
                        }
                      }}
                    >
                      <TrashIcon />
                      Delete account
                    </button>
                  </div>
                </div>
              )}
              {msg && <p className="small">{msg}</p>}
            </div>
          )}
        </header>

        {history.length > 0 && <LocalNotice />}

        {!history.length ? (
          <section className="profile-empty">
            <h2 className="head">No results yet</h2>
            <p className="lead">Take the test and your eight notes will appear here. Each time you retake it, you’ll see how your notes move.</p>
            <div className="empty-actions">
              <Link className="btn" to="/test/quick">Take the test</Link>
              <label className="btn btn-quiet file-btn">
                Import a downloaded copy
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    try {
                      const n = await importResults(f)
                      setMsg(n ? `Imported ${n} result${n > 1 ? 's' : ''}.` : 'Nothing new in that file.')
                      refresh()
                    } catch (err) {
                      setMsg((err as Error).message)
                    }
                  }}
                />
              </label>
            </div>
            {msg && <p className="small">{msg}</p>}
          </section>
        ) : (
          <>
            {reflection && (
              <section className="reflection" aria-labelledby="refl-h">
                <div className="refl-copy">
                  <h2 id="refl-h" className="head">Your reflection</h2>
                  <p className="lead serif">
                    Averaged over your {recent.length === 1 ? 'one result' : `last ${recent.length} results`}, your clearest note is{' '}
                    <strong>{PROFILES[reflection.fit.ranked[0].stack[0]].name}</strong>, closest to{' '}
                    <strong>{reflection.fit.ranked[0].code}</strong> ({reflection.fit.ranked[0].fit}% fit).
                  </p>
                  <button type="button" className="btn" onClick={() => open(history[0])}>
                    Open your latest result in full
                  </button>
                </div>
                <ol className="refl-forms">
                  {[...FUNCTIONS]
                    .sort((a, b) => reflection.avg[b] - reflection.avg[a])
                    .map((f) => (
                      <li key={f} style={{ ['--c' as string]: PROFILES[f].color }}>
                        <NoteForm fn={f} intensity={0.15 + 0.85 * (reflection.avg[f] / 100)} className="refl-form" />
                        <span className="refl-code">{f} <span className="tnum">{Math.round(reflection.avg[f])}</span></span>
                        <span className="refl-tier small">{tierOf(reflection.avg[f]).label}</span>
                      </li>
                    ))}
                </ol>
              </section>
            )}

            {history.length >= 2 && (
              <section className="timeline" aria-labelledby="tl-h">
                <h2 id="tl-h" className="head">How your notes move</h2>
                <Timeline history={[...history].reverse()} />
              </section>
            )}

            {pair && (
              <section className="compare" aria-labelledby="cmp-h">
                <h2 id="cmp-h" className="head">Compare two results</h2>
                <div className="cmp-pickers">
                  {[0, 1].map((k) => (
                    <label key={k} className="small">
                      {k === 0 ? 'Before' : 'After'}
                      <select
                        value={pair[k]}
                        onChange={(e) => {
                          const next: [string, string] = [...pair] as [string, string]
                          next[k] = e.target.value
                          setCmp(next)
                        }}
                      >
                        {history.map((r) => (
                          <option key={r.id} value={r.id}>
                            {fmtDate(r.createdAt)} · {r.topType} · {r.mode}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <CompareTable a={history.find((r) => r.id === pair[0])!} b={history.find((r) => r.id === pair[1])!} />
              </section>
            )}

            <section className="history" aria-labelledby="hist-h">
              <div className="hist-head">
                <h2 id="hist-h" className="head">All results</h2>
                <div className="hist-tools">
                  <button type="button" className="btn btn-quiet" onClick={() => exportResults()}>Download all</button>
                  <label className="btn btn-quiet file-btn">
                    Import a copy
                    <input
                      type="file"
                      accept="application/json,.json"
                      onChange={async (e) => {
                        const f = e.target.files?.[0]
                        if (!f) return
                        try {
                          const n = await importResults(f)
                          setMsg(n ? `Imported ${n} result${n > 1 ? 's' : ''}.` : 'Nothing new in that file.')
                          refresh()
                        } catch (err) {
                          setMsg((err as Error).message)
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <ul className="hist-list">
                {history.map((r) => (
                  <li key={r.id}>
                    <button type="button" className="hist-row" onClick={() => open(r)}>
                      <span>{fmtDate(r.createdAt)}</span>
                      <strong className="hist-type">{r.topType}</strong>
                      <span className="muted small">
                        {r.mode === 'quick' ? 'Quick' : r.mode === 'deep' ? 'Deep' : 'Sharpened'}
                        {r.remoteId ? ' · in profile' : ' · this device only'}
                      </span>
                      <MiniDots scores={r.scores} />
                    </button>
                    {r.remoteId && user && (
                      <button
                        type="button"
                        className="link small"
                        onClick={async () => {
                          if (!confirm('Delete this result from your profile?')) return
                          try {
                            await deleteRemote(r.remoteId!)
                          } catch (e) {
                            return setMsg((e as Error).message)
                          }
                          const l = getLocal(r.id)
                          if (l) saveResult({ ...l, remoteId: undefined })
                          refresh()
                        }}
                      >
                        Remove from profile
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

const initials = (n: string) => (n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('') || '?').toUpperCase()

function getLocal(id: string) {
  return loadResults().find((r) => r.id === id)
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

function MiniDots({ scores }: { scores: Record<Fn, number> }) {
  return (
    <svg className="minidots" viewBox="0 0 160 24" aria-hidden="true">
      {FUNCTIONS.map((f, i) => (
        <circle key={f} cx={10 + i * 20} cy={12} r={2 + (scores[f] / 100) * 8} fill={PROFILES[f].color} />
      ))}
    </svg>
  )
}

function Timeline({ history }: { history: StoredResult[] }) {
  const W = 260
  const H = 90
  const n = history.length
  const x = (i: number) => (n === 1 ? W / 2 : 8 + (i * (W - 16)) / (n - 1))
  const y = (v: number) => H - 6 - (v / 100) * (H - 12)
  return (
    <div className="tl-grid">
      {FUNCTIONS.map((f) => {
        const pts = history.map((r, i) => `${x(i)},${y(r.scores[f])}`).join(' ')
        const last = history[n - 1].scores[f]
        const first = history[0].scores[f]
        const d = last - first
        return (
          <figure key={f} className="tl-cell">
            <figcaption>
              <NoteChip fn={f} />
              <span className="tnum small">
                {Math.round(last)} <span className="muted">{Math.abs(d) < 3 ? 'steady' : `${d > 0 ? '+' : '−'}${Math.round(Math.abs(d))} since first`}</span>
              </span>
            </figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${PROFILES[f].name} across ${n} results, from ${Math.round(first)} to ${Math.round(last)}`}>
              <line x1="0" x2={W} y1={y(50)} y2={y(50)} stroke="#6b6763" strokeOpacity="0.25" strokeDasharray="3 4" />
              <polyline points={pts} fill="none" stroke={PROFILES[f].color} strokeWidth="2.5" strokeLinejoin="round" />
              {history.map((r, i) => (
                <circle key={r.id} cx={x(i)} cy={y(r.scores[f])} r={i === n - 1 ? 4.5 : 3} fill={PROFILES[f].color} />
              ))}
            </svg>
          </figure>
        )
      })}
    </div>
  )
}

function CompareTable({ a, b }: { a: StoredResult; b: StoredResult }) {
  if (!a || !b) return null
  return (
    <table className="cmp">
      <thead>
        <tr>
          <th scope="col">Note</th>
          <th scope="col" className="num">Before</th>
          <th scope="col" className="num">After</th>
          <th scope="col" className="num">Change</th>
        </tr>
      </thead>
      <tbody>
        {[...FUNCTIONS]
          .sort((x, y) => Math.abs(b.scores[y] - a.scores[y]) - Math.abs(b.scores[x] - a.scores[x]))
          .map((f) => {
            const d = b.scores[f] - a.scores[f]
            return (
              <tr key={f}>
                <th scope="row"><NoteChip fn={f} withName /></th>
                <td className="num tnum">{Math.round(a.scores[f])}</td>
                <td className="num tnum">{Math.round(b.scores[f])}</td>
                <td className="num tnum">{Math.abs(d) < 1 ? '—' : `${d > 0 ? '+' : '−'}${Math.round(Math.abs(d))}`}</td>
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}
