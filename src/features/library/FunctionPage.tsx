import { Link, Navigate, useParams } from 'react-router-dom'
import { Footer, NoteChip, TopBar } from '../../components/Shell'
import { PROFILES } from '../../data/functions'
import { FUNCTIONS, type Fn } from '../../engine/model'
import { OPPOSITE, ROLES, STACKS } from '../../engine/types16'
import { NoteForm } from '../../three/Stage'
import './library.css'

export default function FunctionPage() {
  const { fn: raw } = useParams()
  const fn = FUNCTIONS.find((f) => f.toLowerCase() === raw?.toLowerCase()) as Fn | undefined
  if (!fn) return <Navigate to="/library" replace />
  const p = PROFILES[fn]
  const shadow = FUNCTIONS.find((f) => f !== fn && f[0] === fn[0] && f[1] !== fn[1])!
  const byPosition = ROLES.map((r, i) => ({
    role: r,
    types: Object.entries(STACKS).filter(([, s]) => s[i] === fn).map(([c]) => c),
  }))

  return (
    <div>
      <section className="fn-hero" style={{ ['--c' as string]: p.color }}>
        <TopBar />
        <div className="wrap fn-hero-in">
          <div className="fn-hero-text">
            <p className="note fn-note"><i aria-hidden="true" />{fn} · {p.note}</p>
            <h1 className="display">{p.name}</h1>
            <p className="lead serif fn-one">{p.oneLine}</p>
            <Link className="btn btn-light" to={`/read/${fn.toLowerCase()}`}>Read the full chapter</Link>
          </div>
          <NoteForm fn={fn} intensity={0.9} className="fn-hero-form" label={`${p.name} form`} />
        </div>
      </section>
      <main className="wrap fn-body">
        <section className="fn-def">
          <h2 className="head">What it is</h2>
          <p className="lead">{p.definition}</p>
          <p className="fn-story">{p.story}</p>
        </section>
        <section className="fn-cols">
          <div>
            <h2 className="lead fn-h">What it looks like</h2>
            <ul className="fn-list">{p.looksLike.map((l) => <li key={l}>{l}</li>)}</ul>
          </div>
          <div>
            <h2 className="lead fn-h">What it isn’t</h2>
            <ul className="fn-list">{p.notThis.map((l) => <li key={l}>{l}</li>)}</ul>
          </div>
          <div>
            <h2 className="lead fn-h">When it’s your weakest note</h2>
            <p>{p.underPressure}</p>
          </div>
        </section>
        <section className="fn-quotes">
          {p.quotes.map((q) => (
            <blockquote key={q.text}>
              <p className="lead">“{q.text}”</p>
              <cite className="small muted">{q.source}</cite>
            </blockquote>
          ))}
        </section>
        <section className="fn-related">
          <h2 className="head">Its neighbours</h2>
          <div className="fn-rel-grid">
            <Link to={`/library/${shadow.toLowerCase()}`} className="panel fn-rel">
              <NoteChip fn={shadow} withName />
              <span className="small muted">Same function, the other attitude. The hardest pair to tell apart.</span>
            </Link>
            <Link to={`/library/${OPPOSITE[fn].toLowerCase()}`} className="panel fn-rel">
              <NoteChip fn={OPPOSITE[fn]} withName />
              <span className="small muted">Its opposite on the same axis. Leaning on one makes the other harder to reach.</span>
            </Link>
          </div>
        </section>
        <section className="fn-roles">
          <h2 className="head">Where it plays in each type</h2>
          <ol className="fn-role-list">
            {byPosition.map(({ role, types }) => (
              <li key={role.key}>
                <span className="fn-role-name">{role.name}</span>
                <span className="fn-role-types">{types.join(', ')}</span>
                <span className="small muted">{role.does}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  )
}
