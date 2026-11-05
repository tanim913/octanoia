import { Link } from 'react-router-dom'
import { Footer, TopBar } from '../../components/Shell'
import { PROFILES } from '../../data/functions'
import { NoteForm } from '../../three/Stage'
import type { Fn } from '../../engine/model'
import './library.css'

const GRID: [string, Fn, Fn][] = [
  ['Sensing', 'Se', 'Si'],
  ['Intuition', 'Ne', 'Ni'],
  ['Thinking', 'Te', 'Ti'],
  ['Feeling', 'Fe', 'Fi'],
]

export default function LibraryIndex() {
  return (
    <div>
      <TopBar />
      <main className="wrap lib">
        <header className="lib-head">
          <h1 className="display">The eight notes</h1>
          <p className="lead">
            Four functions, each turned outward or inward. Hue tells you the function; a deeper shade means the inward version.
          </p>
        </header>
        <div className="lib-table" role="table" aria-label="The eight functions by function and attitude">
          <div className="lib-row lib-colhead" role="row">
            <span role="columnheader" />
            <span role="columnheader" className="small muted">Extraverted, cued by the world outside</span>
            <span role="columnheader" className="small muted">Introverted, cued by an inner reference</span>
          </div>
          {GRID.map(([family, e, i]) => (
            <div key={family} className="lib-row" role="row">
              <span role="rowheader" className="lib-family">{family}</span>
              {[e, i].map((fn) => (
                <Link key={fn} role="cell" to={`/library/${fn.toLowerCase()}`} className="lib-card" style={{ ['--c' as string]: PROFILES[fn].color }}>
                  <NoteForm fn={fn} intensity={0.6} className="lib-form" />
                  <span className="lib-code">{fn}</span>
                  <span className="lib-name">{PROFILES[fn].name}</span>
                  <span className="small lib-one">{PROFILES[fn].oneLine}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
        <section className="lib-more">
          <Link to="/read" className="lib-more-link">
            <span className="lead">Read the book</span>
            <span className="muted">Fourteen chapters that go deep into each function and how they work together.</span>
          </Link>
          <Link to="/library/concepts" className="lib-more-link">
            <span className="lead">How the notes work together</span>
            <span className="muted">Attitudes, opposites, the leading and helping functions, the cast of eight, and why type is a spectrum.</span>
          </Link>
          <Link to="/how-scoring-works" className="lib-more-link">
            <span className="lead">How scoring works</span>
            <span className="muted">The full arithmetic, and every question with the notes it measures.</span>
          </Link>
          <Link to="/library/sources" className="lib-more-link">
            <span className="lead">Sources</span>
            <span className="muted">The four books Octanoia is built on, and how each was used.</span>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
