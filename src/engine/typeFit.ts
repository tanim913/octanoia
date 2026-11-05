// Type fit. Implements knowledge/scoring-model.md §6–§8.
import { FUNCTIONS, type Fn } from './model'
import type { FunctionScore } from './score'
import { AXES, POSITION_WEIGHTS, STACKS, TYPE_CODES } from './types16'

export interface TypeFit {
  code: string
  r: number
  fit: number // 0–100
  stack: Fn[]
  inferiorStress?: number
}

export interface FitResult {
  ranked: TypeFit[]
  tooClose: boolean
  /** True if the top two were reordered by the under-pressure tiebreak. */
  tiebreakApplied: boolean
  /** Functions whose positions differ most between #1 and #2. */
  decidingFns: Fn[]
}

export function template(code: string): Record<Fn, number> {
  const t = {} as Record<Fn, number>
  STACKS[code].forEach((fn, i) => (t[fn] = POSITION_WEIGHTS[i]))
  return t
}

export function pearson(a: number[], b: number[]): number {
  const n = a.length
  const ma = a.reduce((s, x) => s + x, 0) / n
  const mb = b.reduce((s, x) => s + x, 0) / n
  let num = 0
  let da = 0
  let db = 0
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb)
    da += (a[i] - ma) ** 2
    db += (b[i] - mb) ** 2
  }
  return da === 0 || db === 0 ? 0 : num / Math.sqrt(da * db)
}

export const TOO_CLOSE = 0.05

export function fitTypes(
  scores: Record<Fn, number>,
  stressScores?: Record<Fn, number>,
): FitResult {
  const v = FUNCTIONS.map((f) => scores[f])
  const ranked: TypeFit[] = TYPE_CODES.map((code) => {
    const t = template(code)
    const r = pearson(v, FUNCTIONS.map((f) => t[f]))
    const stack = STACKS[code]
    return {
      code,
      r,
      fit: Math.round(Math.max(0, r) * 100),
      stack,
      inferiorStress: stressScores ? stressScores[stack[3]] : undefined,
    }
  }).sort((a, b) => b.r - a.r)

  const tooClose = ranked[0].r - ranked[1].r < TOO_CLOSE
  let tiebreakApplied = false
  if (tooClose && stressScores) {
    const [a, b] = ranked
    if ((b.inferiorStress ?? 50) > (a.inferiorStress ?? 50)) {
      ranked[0] = b
      ranked[1] = a
      tiebreakApplied = true
    }
  }

  const t1 = template(ranked[0].code)
  const t2 = template(ranked[1].code)
  const decidingFns = [...FUNCTIONS]
    .sort((x, y) => Math.abs(t2[y] - t1[y]) - Math.abs(t2[x] - t1[x]))
    .filter((f) => Math.abs(t1[f] - t2[f]) >= 0.3)
    .slice(0, 4)

  return { ranked, tooClose, tiebreakApplied, decidingFns }
}

export function axisLeans(scores: Record<Fn, number>) {
  return AXES.map(([a, b]) => ({ a, b, diff: scores[a] - scores[b] }))
}

export function scoresOf(fs: Record<Fn, FunctionScore>): Record<Fn, number> {
  return Object.fromEntries(FUNCTIONS.map((f) => [f, fs[f].score])) as Record<Fn, number>
}
