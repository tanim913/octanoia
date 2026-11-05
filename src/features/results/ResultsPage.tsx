import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LocalNotice } from '../../components/LocalNotice'
import { NoteBars } from '../../components/NoteBars'
import { Footer, NoteChip, TopBar, useReveal } from '../../components/Shell'
import { PROFILES } from '../../data/functions'
import { tierOf } from '../../data/readings'
import { TYPE_NOTES } from '../../data/typeNotes'
import { FUNCTIONS, type Fn } from '../../engine/model'
import { axisLeans, scoresOf } from '../../engine/typeFit'
import { ROLES } from '../../engine/types16'
import { analyze } from '../../lib/analysis'
import { deleteResult, getResult } from '../../lib/storage'
import { useTest } from '../../lib/testStore'
import { scrollToTarget } from '../../lib/smooth'
import Constellation from '../../scenes/Constellation'
import { Glyph } from '../../three/glyphs'
import { NoteForm } from '../../three/Stage'
import { SaveToProfile } from '../profile/SaveToProfile'
import { rankOf, sharpenItems, whyFits } from './explain'
import { FunctionChapter } from './FunctionChapter'
import './results.css'

export default function ResultsPage() {
  const { id } = useParams()
  const stored = id ? getResult(id) : undefined
  const ref = useReveal<HTMLDivElement>()
  const a = useMemo(() => (stored ? analyze(stored.answers) : null), [stored])
  const nav = useNavigate()
  const startTest = useTest((s) => s.start)
  const [current, setCurrent] = useState<Fn | null>(null)

  const order = useMemo(() => (a ? [...FUNCTIONS].sort((x, y) => a.scores[y] - a.scores[x]) : []), [a])

  // highlight the chapter in view in the side index
  useEffect(() => {
    if (!order.length) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setCurrent(e.target.id.replace('note-', '') as Fn)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    order.forEach((fn) => {
      const el = document.getElementById(`note-${fn}`)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [order])

  if (!stored || !a) {
    return (
      <div>
        <TopBar />
        <main className="wrap" style={{ padding: '20vh 0' }}>
          <h1 className="head">This result isn’t on this device</h1>
          <p className="lead" style={{ marginTop: 24, maxWidth: '40ch' }}>
            Results live in the browser where you took the test, in your profile if you saved it, or in a copy you downloaded.
          </p>
          <p style={{ marginTop: 32, display: 'flex', gap: 20, alignItems: 'center' }}>
            <Link className="btn" to="/test/quick">Take the test</Link>
            <Link className="link" to="/profile">Open your profile</Link>
          </p>
        </main>
      </div>
    )
  }

  const { score, fit, scores } = a
  const top = fit.ranked[0]
  const clarity = Object.fromEntries(FUNCTIONS.map((f) => [f, score.scores[f].clarity])) as Record<Fn, number>
  const rank = rankOf(scores)
  const note = TYPE_NOTES[top.code]
  const stress = scoresOf(score.stress)
  const sharpen = fit.tooClose ? sharpenItems(stored.answers, fit.decidingFns) : []
  const isDeep = stored.mode !== 'quick'
  const go = (fn: Fn) => {
    const el = document.getElementById(`note-${fn}`)
    if (el) scrollToTarget(el)
  }
  const strongest = order.slice(0, 2)
  const quietest = order.slice(-2).reverse()

  return (
    <div ref={ref}>
      {/* ── Opening: the eight as a whole ── */}
      <section className="on-night res-hero">
        <TopBar night />
        <div className="wrap res-hero-grid">
          <div className="res-summary">
            <h1 className="display res-title">
              <span className="mask-line"><span>Your eight notes</span></span>
            </h1>
            <p className="lead serif rise" style={{ animationDelay: '300ms' }}>
              Your clearest note is <strong>{PROFILES[top.stack[0]].name}</strong>. The pattern you resemble most is <strong>{top.code}</strong> ({top.fit}% fit), then{' '}
              {fit.ranked[1].code} ({fit.ranked[1].fit}%) and {fit.ranked[2].code} ({fit.ranked[2].fit}%).
            </p>
            <p className="rise res-shape" style={{ animationDelay: '400ms' }}>
              Strongest: {strongest.map((f, i) => <span key={f}>{i ? ' and ' : ''}<NoteChip fn={f} /></span>)}. Quietest:{' '}
              {quietest.map((f, i) => <span key={f}>{i ? ' and ' : ''}<NoteChip fn={f} /></span>)}. Below, every note gets its own explanation.
            </p>
            {fit.tooClose && (
              <p className="rise close-call" style={{ animationDelay: '450ms' }}>
                {top.code} and {fit.ranked[1].code} are too close to call. They differ mainly on{' '}
                {fit.decidingFns.map((f, i) => <span key={f}>{i ? ', ' : ''}<NoteChip fn={f} /></span>)}.
                {fit.tiebreakApplied && ' We listed first the one whose under-pressure pattern matches yours.'}
              </p>
            )}
            <p className="small muted rise" style={{ animationDelay: '500ms' }}>
              {stored.mode === 'quick' ? 'Quick test' : stored.mode === 'deep' ? 'Deep test' : 'Sharpened result'} · {Object.keys(stored.answers).length} answers ·{' '}
              {new Date(stored.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="res-stage">
            <Constellation scores={scores} selected={current} onSelect={go} height="100%" label="Your eight notes. Select one to jump to its explanation." />
          </div>
        </div>
        <div className="wrap res-notice">
          <LocalNotice resultId={stored.id} night />
        </div>
      </section>

      {/* ── Eight chapters, strongest first ── */}
      <section className="wrap res-chapters" aria-labelledby="notes-h">
        <nav className="note-index" aria-label="Jump to a note">
          <h2 id="notes-h" className="index-h">Strongest first</h2>
          <ol>
            {order.map((fn) => (
              <li key={fn}>
                <button type="button" className={current === fn ? 'is-on' : ''} onClick={() => go(fn)}>
                  <span className="index-glyph"><Glyph fn={fn} /></span>
                  <span className="index-name">{fn}</span>
                  <span className="index-tier muted">{tierOf(scores[fn]).label}</span>
                  <span className="index-score tnum">{Math.round(scores[fn])}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="small muted index-note">50 is neutral. Each chapter shows the answers behind its number.</p>
        </nav>
        <div className="chapters">
          {order.map((fn) => (
            <FunctionChapter key={fn} fs={score.scores[fn]} rank={rank(fn)} fit={top} />
          ))}
        </div>
      </section>

      {/* ── At a glance ── */}
      <section className="wrap res-glance" aria-labelledby="glance-h">
        <h2 id="glance-h" className="head reveal">All eight at a glance</h2>
        <NoteBars scores={scores} clarity={clarity} order="score" onSelect={go} />
      </section>

      {/* ── Type fits ── */}
      <section className="res-fits" aria-labelledby="fits-h">
        <div className="wrap">
          <h2 id="fits-h" className="head reveal">Closest patterns</h2>
          <p className="reveal fits-sub">Each of the 16 types is a pattern of the eight notes. These are the three your scores resemble most, with the reasons.</p>
          <div className="fits">
            {fit.ranked.slice(0, 3).map((f, i) => (
              <article key={f.code} className={`fit reveal${i === 0 ? ' fit-top' : ''}`}>
                <div className="fit-head">
                  <h3 className="fit-code serif">{f.code}</h3>
                  <p className="tnum fit-pct">{f.fit}% fit</p>
                </div>
                <div className="fit-stack" aria-label={`Leads with ${f.stack.slice(0, 4).join(', ')}`}>
                  {f.stack.slice(0, 4).map((fn) => (
                    <span key={fn} className="fit-glyph"><Glyph fn={fn} /><span>{fn}</span></span>
                  ))}
                </div>
                <p>{TYPE_NOTES[f.code].portrait}</p>
                <ul className="fit-why small">{whyFits(f, scores).map((w) => <li key={w}>{w}</li>)}</ul>
              </article>
            ))}
          </div>
          {sharpen.length > 0 && (
            <div className="sharpen reveal">
              <p className="lead serif">Want a clearer answer between {top.code} and {fit.ranked[1].code}?</p>
              <p>{sharpen.length} more scenes focus on the notes that decide between them. Your earlier answers are kept.</p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  startTest('sharpen', sharpen, stored.answers)
                  nav('/test/sharpen')
                }}
              >
                Sharpen my result
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Cast ── */}
      <section className="wrap res-cast" aria-labelledby="cast-h">
        <div className="cast-intro">
          <h2 id="cast-h" className="head reveal">Your cast of eight</h2>
          <p className="reveal">
            The analyst John Beebe described the eight functions as characters, each playing a role. Here is the {top.code} cast with your scores. The first four are roles you tend to own; the last four mostly appear when you feel challenged.
          </p>
        </div>
        <ol className="cast">
          {ROLES.map((r, i) => {
            const fn = top.stack[i]
            return (
              <li key={r.key} className={`reveal${i >= 4 ? ' shadow' : ''}`}>
                <NoteForm fn={fn} intensity={scores[fn] / 100} className="cast-form" />
                <p className="cast-role serif">{r.name}</p>
                <NoteChip fn={fn} withName />
                <p className="small">{r.does}</p>
                <p className="small tnum muted">Your score {Math.round(scores[fn])}</p>
              </li>
            )
          })}
        </ol>
      </section>

      {/* ── Pressure & growth ── */}
      <section className="res-pressure on-night" aria-labelledby="press-h">
        <div className="wrap press-grid">
          <div>
            <h2 id="press-h" className="head reveal">Under pressure</h2>
            <p className="lead serif reveal">{note.stuck}</p>
            <p className="reveal press-growth"><strong>Where growth tends to come from:</strong> {note.growth}</p>
            <p className="small muted reveal">Based on Lenore Thomson’s account of how each pattern gets stuck and unstuck. A common pattern, not a prediction.</p>
          </div>
          <div className="reveal">
            {isDeep && a.hasStress ? (
              <>
                <p className="small press-label">How strongly each note erupts when you are under strain</p>
                <NoteBars scores={stress} order="score" compact />
                <p className="small muted" style={{ marginTop: 16 }}>
                  For {top.code}, the note most likely to erupt is {top.stack[3]}. Yours scored {Math.round(stress[top.stack[3]])} here
                  {stress[top.stack[3]] > 60 ? ', which supports this pattern.' : '.'}
                </p>
              </>
            ) : (
              <div className="press-empty">
                <p>The deep test adds 16 scenes about how you react under strain. Your weakest note often shows itself there, which helps confirm your pattern.</p>
                <Link className="btn btn-night" to="/test/deep">Take the deep test</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Axes ── */}
      <section className="wrap res-axes" aria-labelledby="axes-h">
        <h2 id="axes-h" className="head reveal">Four axes</h2>
        <p className="reveal axes-sub">Opposite notes share an axis: leaning on one usually makes the other harder to reach.</p>
        <div className="axes">
          {axisLeans(scores).map(({ a: x, b: y, diff }) => (
            <div key={x} className="axis reveal">
              <NoteChip fn={x} withName />
              <div className="axis-track" aria-hidden="true">
                <span className="axis-mid" />
                <span className="axis-dot" style={{ left: `${50 - Math.max(-50, Math.min(50, diff)) / 2}%`, background: diff >= 0 ? PROFILES[x].color : PROFILES[y].color }} />
              </div>
              <NoteChip fn={y} withName />
              <p className="small muted axis-read">{Math.abs(diff) < 8 ? 'Roughly even' : `Leans ${diff > 0 ? x : y} by ${Math.round(Math.abs(diff))} points`}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Snapshot ── */}
      <section className="wrap res-snapshot" aria-labelledby="snap-h">
        <div>
          <h2 id="snap-h" className="head reveal">A snapshot, not a box</h2>
          <p className="lead serif reveal">
            You tended to agree with statements by {score.acquiescence >= 0 ? '+' : ''}{score.acquiescence.toFixed(2)} on average. We subtracted that from every statement, so only your relative leanings count.
          </p>
          <p className="reveal snap-p">A new job, a new relationship or a hard year can blur these scores. That is normal. Take the test again in a few months and compare in your profile.</p>
          <blockquote className="reveal snap-q">
            <p className="serif">“Our type does not define who we ‘really are’ any more than using a particular language defines the nature of the soul.”</p>
            <cite className="small muted">Lenore Thomson, Personality Type, p.23</cite>
          </blockquote>
        </div>
        <div className="snap-actions reveal">
          <SaveToProfile resultId={stored.id} />
          {stored.mode === 'quick' && <Link className="btn btn-quiet" to="/test/deep">Take the deep test</Link>}
          <Link className="btn btn-quiet" to="/read">Read about the functions</Link>
          <Link className="btn btn-quiet" to="/how-scoring-works">See the full scoring</Link>
          <button
            type="button"
            className="link small"
            onClick={() => {
              if (confirm('Delete this result from this device?')) {
                deleteResult(stored.id)
                nav('/profile')
              }
            }}
          >
            Delete this result from this device
          </button>
        </div>
      </section>
      <Footer />
    </div>
  )
}
