import { useMemo, useState } from 'react'
import { Footer, NoteChip, TopBar } from '../../components/Shell'
import { ALL_ITEMS, CHAPTERS } from '../../data/items'
import { FACET_WEIGHT, type Fn, type Item } from '../../engine/model'
import { POSITION_WEIGHTS } from '../../engine/types16'
import { loadResults } from '../../lib/storage'
import './library.css'

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Your answers become numbers',
    body: 'Statements run from “Not me” (−2) to “Very me” (+2). For scene questions you pick one of four options, or say none fit, in which case the scene is skipped.',
  },
  {
    title: 'Agreeing with everything is removed',
    body: 'We take the average of all your statement answers and subtract it from each one. If you answered “Often me” to almost everything, only the statements you rated higher or lower than your usual count.',
  },
  {
    title: 'Each answer moves one or more notes',
    body: 'A statement moves the note it is about, multiplied by its weight: how your mind works (×1), what energises you (×1), or what you value (×½, because people often idealise their weakest note). Some statements are reversed, so agreeing lowers the note. In a scene, the option you pick adds +1.5 to its note and the three you pass over each take −0.5, so a scene never adds up to more than zero overall.',
  },
  {
    title: 'Totals become a score from 0 to 100',
    body: 'For each note we compare your total with the most it could have reached. 50 means your answers cancelled out or were neutral; 100 means every answer pushed it as far up as possible. Clarity is the share of your answers that pointed the same way.',
  },
  {
    title: 'Scores are matched to sixteen patterns',
    body: `Each type is a pattern of eight positions. The pattern gives its leading note a weight of ${POSITION_WEIGHTS[0]}, its helper ${POSITION_WEIGHTS[1]}, its third ${POSITION_WEIGHTS[2]}, its weakest ${POSITION_WEIGHTS[3]}, and the four shadow positions ${POSITION_WEIGHTS[4]} each, because the books disagree about those. Fit is the correlation between your eight scores and each pattern.`,
  },
  {
    title: 'Close calls are named',
    body: 'If the top two patterns are within 0.05 of each other, we say so, name the notes that decide between them, and offer extra scenes. Stress questions from the deep test never change your scores; they only help break a tie.',
  },
]

export default function ScoringPage() {
  const tookTest = loadResults().length > 0
  const [reveal, setReveal] = useState(tookTest)
  const [filter, setFilter] = useState<Fn | 'all'>('all')
  const items = useMemo(
    () =>
      ALL_ITEMS.filter((i) =>
        filter === 'all'
          ? true
          : i.kind === 'likert'
            ? filter in i.loads
            : i.options.some((o) => filter in o.loads),
      ),
    [filter],
  )

  return (
    <div>
      <TopBar />
      <main className="wrap scoring">
        <header className="scoring-head">
          <h1 className="display">How scoring works</h1>
          <p className="lead">Six steps from your answers to your eight scores. Nothing else happens behind the scenes.</p>
        </header>
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.title}>
              <h2 className="lead">{s.title}</h2>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>

        <section className="itemmap" aria-labelledby="map-h">
          <h2 id="map-h" className="head">Every question and what it measures</h2>
          {!reveal ? (
            <div className="panel reveal-gate">
              <p>
                Seeing which question measures which note can nudge how you answer. We suggest taking the test first.
              </p>
              <button type="button" className="btn btn-quiet" onClick={() => setReveal(true)}>
                Show the full list anyway
              </button>
            </div>
          ) : (
            <>
              <div className="segmented map-filter" role="radiogroup" aria-label="Filter by note">
                {(['all', 'Se', 'Si', 'Ne', 'Ni', 'Te', 'Ti', 'Fe', 'Fi'] as const).map((f) => (
                  <button key={f} type="button" role="radio" aria-checked={filter === f} className={filter === f ? 'is-on' : ''} onClick={() => setFilter(f)}>
                    {f === 'all' ? 'All' : f}
                  </button>
                ))}
              </div>
              <p className="small muted">{items.length} questions</p>
              <ul className="map-list">
                {items.map((i) => (
                  <MapRow key={i.id} item={i} />
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

function MapRow({ item }: { item: Item }) {
  const chapter = CHAPTERS.find((c) => c.id === item.chapter)?.title
  return (
    <li className="map-row">
      <div>
        <p>{item.text}</p>
        {item.kind === 'choice' && (
          <ul className="map-opts small">
            {item.options.map((o) => (
              <li key={o.text}>
                {Object.keys(o.loads).map((f) => <NoteChip key={f} fn={f as Fn} />)} {o.text}
              </li>
            ))}
          </ul>
        )}
        <p className="small muted">{item.why}</p>
      </div>
      <div className="map-meta small">
        {item.kind === 'likert' &&
          Object.entries(item.loads).map(([f, l]) => (
            <span key={f}>
              <NoteChip fn={f as Fn} /> {l! < 0 ? 'reversed' : ''}
            </span>
          ))}
        <span className="muted">
          {item.facet === 'stress' ? 'Under pressure (not scored)' : `${item.facet} ×${FACET_WEIGHT[item.facet]}`}
        </span>
        <span className="muted">{chapter} · {item.modes.includes('quick') ? 'Quick + Deep' : 'Deep'}</span>
        <span className="muted">{item.sources.join('; ')}</span>
      </div>
    </li>
  )
}
