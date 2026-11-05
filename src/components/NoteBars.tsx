import { PROFILES } from '../data/functions'
import { FUNCTIONS, type Fn } from '../engine/model'

/**
 * Horizontal bars for the eight notes, centred on 50 (neutral).
 * Bars grow right of the midline for scores above 50 and left for below.
 */
export function NoteBars({
  scores,
  clarity,
  order = 'fixed',
  selected,
  onSelect,
  compact = false,
}: {
  scores: Record<Fn, number>
  clarity?: Record<Fn, number>
  order?: 'fixed' | 'score'
  selected?: Fn | null
  onSelect?: (fn: Fn) => void
  compact?: boolean
}) {
  const fns = order === 'score' ? [...FUNCTIONS].sort((a, b) => scores[b] - scores[a]) : [...FUNCTIONS]
  return (
    <ul className={`notebars${compact ? ' compact' : ''}`} data-ui>
      {fns.map((fn) => {
        const s = scores[fn]
        const left = s >= 50 ? 50 : s
        const width = Math.abs(s - 50)
        const Tag = onSelect ? 'button' : 'div'
        return (
          <li key={fn}>
            <Tag
              className={`notebar${selected === fn ? ' is-selected' : ''}`}
              {...(onSelect ? { onClick: () => onSelect(fn), type: 'button' as const, 'aria-pressed': selected === fn } : {})}
            >
              <span className="nb-name">
                <i style={{ background: PROFILES[fn].color }} aria-hidden="true" />
                <strong>{fn}</strong>
                {!compact && <span className="muted">{PROFILES[fn].name}</span>}
              </span>
              <span className="nb-track" aria-hidden="true">
                <span className="nb-mid" />
                <span className="nb-fill" style={{ left: `${left}%`, width: `${width}%`, background: PROFILES[fn].color }} />
              </span>
              <span className="nb-val tnum">
                {Math.round(s)}
                {clarity && !compact && <span className="muted small"> · {Math.round(clarity[fn] * 100)}% clear</span>}
              </span>
            </Tag>
          </li>
        )
      })}
    </ul>
  )
}
