import { PROFILES } from '../data/functions'
import { ITEM_BY_ID } from '../data/items'
import type { Contribution } from '../engine/score'

const fmt = (v: number) => (v > 0 ? '+' : '−') + Math.abs(v).toFixed(2)

/** One row per answer that moved a function: what you said, by how much, and why. */
export function LedgerRows({ rows, empty }: { rows: Contribution[]; empty: string }) {
  if (!rows.length) return <p className="muted small">{empty}</p>
  return (
    <ul className="ledger" data-ui>
      {rows.map((c) => {
        const item = ITEM_BY_ID[c.itemId]
        return (
          <li key={c.itemId + c.fn + c.answer}>
            <span className={`ledger-val tnum ${c.value > 0 ? 'up' : 'down'}`}>{fmt(c.value)}</span>
            <div>
              <p className="ledger-q">{item?.text}</p>
              <p className="small"><strong>{c.answer}</strong></p>
              {item && <p className="small muted">{item.why}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** For a single just-answered item: how each function moved. */
export function ItemEffect({ effects }: { effects: Contribution[] }) {
  const sorted = [...effects].sort((a, b) => b.value - a.value)
  return (
    <ul className="item-effect" data-ui>
      {sorted.map((c) => (
        <li key={c.fn + c.answer}>
          <span className="note" style={{ ['--c' as string]: PROFILES[c.fn].color }}>
            <i aria-hidden="true" />
            {c.fn}
          </span>
          <span className={`tnum ${c.value > 0 ? 'up' : 'down'}`}>{fmt(c.value)}</span>
          <span className="small muted">{c.answer.replace(/^(Picked|Passed over): /, (m) => m)}</span>
        </li>
      ))}
    </ul>
  )
}
