// 2D drawings of the eight forms: used without WebGL, under reduced motion, and at small sizes.
import { PROFILES } from '../data/functions'
import type { Fn } from '../engine/model'
import { MONO } from './forms'

export function Glyph({ fn, mono, size = '100%', title }: { fn: Fn; mono?: boolean; size?: number | string; title?: string }) {
  const c = mono ? MONO : PROFILES[fn].color
  const body = (() => {
    switch (fn) {
      case 'Se':
        return <path d="M50 14c9 6 22 3 27 13s-2 18 4 27-6 20-16 23-17 10-27 5-21-3-24-14 6-18 1-28 7-20 17-22 9-10 18-4z" fill={c} />
      case 'Si':
        return (
          <g fill="none" stroke={c} strokeWidth="6">
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} cx="50" cy={72 - i * 11} rx={38 - i * 5} ry={9 - i * 0.8} opacity={0.5 + i * 0.12} />
            ))}
          </g>
        )
      case 'Ne':
        return (
          <g stroke={c} strokeWidth="3.5" fill={c}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i / 8) * Math.PI * 2 + 0.3
              const r = 28 + (i % 3) * 6
              const x = 50 + Math.cos(a) * r
              const y = 50 + Math.sin(a) * r
              return (
                <g key={i}>
                  <line x1="50" y1="50" x2={x} y2={y} />
                  <circle cx={x} cy={y} r={5 + (i % 2) * 2} stroke="none" />
                </g>
              )
            })}
            <circle cx="50" cy="50" r="9" stroke="none" />
          </g>
        )
      case 'Ni':
        return (
          <g fill={c}>
            {Array.from({ length: 34 }, (_, i) => {
              const u = i / 34
              const r = 40 * (1 - u)
              const a = u * Math.PI * 6
              return <circle key={i} cx={50 + Math.cos(a) * r} cy={50 + Math.sin(a) * r} r={1.5 + 3.5 * (1 - u)} />
            })}
            <circle cx="50" cy="50" r="6" />
          </g>
        )
      case 'Te':
        return (
          <g fill={c}>
            {[0, 1, 2].flatMap((x) => [0, 1, 2].map((y) => <rect key={`${x}${y}`} x={20 + x * 22} y={20 + y * 22} width="16" height="16" />))}
          </g>
        )
      case 'Ti':
        return (
          <g stroke={c} strokeWidth="3.5" strokeLinejoin="round">
            <polygon points="50,12 86,38 72,82 28,82 14,38" fill={c} fillOpacity="0.85" />
            <polygon points="50,30 67,42 60,64 40,64 33,42" fill="none" stroke="#e4e3e0" strokeOpacity="0.6" />
            <path d="M50 12v18M86 38l-19 4M72 82l-12-18M28 82l12-18M14 38l19 4" stroke="#e4e3e0" strokeOpacity="0.6" />
          </g>
        )
      case 'Fe':
        return (
          <g fill="none" stroke={c} strokeWidth="6">
            {Array.from({ length: 7 }, (_, i) => {
              const a = (i / 7) * Math.PI * 2
              return <circle key={i} cx={50 + Math.cos(a) * 26} cy={50 + Math.sin(a) * 26} r="12" />
            })}
          </g>
        )
      case 'Fi':
        return (
          <g>
            <circle cx="50" cy="50" r="38" fill={c} fillOpacity="0.18" />
            <circle cx="50" cy="50" r="38" fill="none" stroke={c} strokeOpacity="0.4" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill={c} />
          </g>
        )
    }
  })()
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {body}
    </svg>
  )
}
