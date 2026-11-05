import { Link } from 'react-router-dom'
import { PROFILES } from '../../data/functions'
import { ITEM_BY_ID } from '../../data/items'
import type { Contribution, FunctionScore } from '../../engine/score'
import type { TypeFit } from '../../engine/typeFit'
import { NoteForm } from '../../three/Stage'
import { ordinal, roleLine, storyFor } from './explain'

const fmt = (v: number) => (v > 0 ? '+' : '−') + Math.abs(v).toFixed(1)

function AnswerRow({ c }: { c: Contribution }) {
  const item = ITEM_BY_ID[c.itemId]
  const picked = c.answer.startsWith('Picked')
  const passed = c.answer.startsWith('Passed over')
  const option = c.answer.replace(/^(Picked|Passed over): /, '')
  return (
    <li className="ans">
      <span className={`ans-val tnum ${c.value > 0 ? 'up' : 'down'}`}>{fmt(c.value)}</span>
      <div>
        <p className="ans-q">{item?.text}</p>
        <p className="ans-a">
          {picked ? <>You picked {option}</> : passed ? <>You passed over {option}</> : <>You answered “{c.answer}”</>}
        </p>
        {item && <p className="ans-why">{item.why}</p>}
      </div>
    </li>
  )
}

export function FunctionChapter({ fs, rank, fit }: { fs: FunctionScore; rank: number; fit: TypeFit }) {
  const p = PROFILES[fs.fn]
  const s = storyFor(fs)
  const leaningUp = fs.score >= 50
  const size = Math.round(150 + fs.score * 1.9)
  return (
    <section id={`note-${fs.fn}`} className={`chapter tier-${s.tier.key}`} style={{ ['--c' as string]: p.color }} aria-labelledby={`h-${fs.fn}`}>
      <div className="chapter-form">
        <NoteForm fn={fs.fn} intensity={0.15 + 0.85 * (fs.score / 100)} style={{ width: `min(${size}px, 100%)` }} label={`${p.name}, scoring ${Math.round(fs.score)}`} />
      </div>
      <div className="chapter-text">
        <p className="chapter-tier">
          <span className="tier-word">{s.tier.label}</span>
          <span className="muted"> · your {ordinal(rank)} note</span>
        </p>
        <h3 id={`h-${fs.fn}`} className="chapter-h serif">
          {p.name} <span className="chapter-score tnum">{Math.round(fs.score)}</span>
        </h3>
        <p className="chapter-meaning">{s.meaning}</p>
        <p className="chapter-role">{roleLine(fs.fn, fs.score, fit)}</p>

        <div className="chapter-why">
          <h4 className="why-title">{leaningUp ? 'Why it scored high' : 'Why it scored low'}</h4>
          {s.because.length ? (
            <ul className="answers">{s.because.map((c) => <AnswerRow key={c.itemId + c.answer} c={c} />)}</ul>
          ) : (
            <p className="muted">No answers pushed strongly either way, so it sits near neutral.</p>
          )}
          {s.against.length > 0 && (
            <>
              <h4 className="why-title why-title-soft">Pulling the other way</h4>
              <ul className="answers answers-soft">{s.against.map((c) => <AnswerRow key={c.itemId + c.answer} c={c} />)}</ul>
            </>
          )}
          <p className="chapter-clarity">{s.clarityLine}</p>
          {s.practise && (
            <p className="chapter-practise">
              <strong>If you want to strengthen it:</strong> {s.practise}
            </p>
          )}
          <details className="chapter-all">
            <summary>All {s.all.length} answers that touched {fs.fn}</summary>
            <ul className="answers">{s.all.map((c) => <AnswerRow key={c.itemId + c.answer} c={c} />)}</ul>
          </details>
          <p className="chapter-links">
            <Link className="link" to={`/read/${fs.fn.toLowerCase()}`}>Read the chapter on {p.name}</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
