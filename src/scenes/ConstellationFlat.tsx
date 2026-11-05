import { PROFILES } from '../data/functions'
import { Glyph } from '../three/glyphs'
import { AXIS_PAIRS, RING, ringPosition, type ConstellationProps } from './layout'

/** 2D fallback: same layout, no WebGL, no motion. */
export default function ConstellationFlat({ scores, progress = 1, selected, onSelect, height = 520, label }: ConstellationProps) {
  const R = 150
  return (
    <div className="constellation" style={{ height }}>
      <svg viewBox="-230 -210 460 420" role="img" aria-label={label ?? 'Constellation of your eight functions'} style={{ width: '100%', height: '100%' }}>
        {AXIS_PAIRS.map(([a, b]) => {
          const [x1, y1] = ringPosition(a, R)
          const [x2, y2] = ringPosition(b, R)
          return <line key={a} x1={x1} y1={-y1} x2={x2} y2={-y2} stroke="#a8a39d" strokeOpacity={0.3} />
        })}
        {RING.map((fn) => {
          const [x, y] = ringPosition(fn, R)
          const s = scores ? scores[fn] : null
          const r = s === null ? 6 + 8 * progress : 10 + 26 * (s / 100)
          const interactive = !!onSelect && s !== null
          return (
            <g
              key={fn}
              transform={`translate(${x} ${-y})`}
              onClick={() => interactive && onSelect!(fn)}
              onKeyDown={(e) => interactive && (e.key === 'Enter' || e.key === ' ') && onSelect!(fn)}
              tabIndex={interactive ? 0 : -1}
              role={interactive ? 'button' : undefined}
              aria-label={s !== null ? `${PROFILES[fn].name}: ${Math.round(s)}` : undefined}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
              {selected === fn && <circle r={r + 6} fill="none" stroke="#eeecea" strokeWidth={2} />}
              <g transform={`translate(${-r} ${-r})`} opacity={s === null ? 0.35 + 0.65 * progress : 1}>
                <Glyph fn={fn} mono={s === null} size={r * 2} />
              </g>
              {s !== null && (
                <text y={r + 20} textAnchor="middle" fill="#eeecea" fontSize="15" fontFamily="Hanken Grotesk, sans-serif">
                  {fn} {Math.round(s)}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
