// Pure scoring. Implements knowledge/scoring-model.md §2–§5 and §7.
import {
  CHOICE_PICKED,
  CHOICE_UNPICKED,
  FACET_WEIGHT,
  FUNCTIONS,
  type Answers,
  type Fn,
  type Item,
} from './model'

export interface Contribution {
  itemId: string
  fn: Fn
  value: number
  /** Human-readable summary of what the user answered. */
  answer: string
}

export interface FunctionScore {
  fn: Fn
  score: number // 0–100, 50 = neutral
  clarity: number // 0–1
  sum: number
  maxUp: number
  maxDown: number
  ledger: Contribution[]
}

export interface ScoreResult {
  scores: Record<Fn, FunctionScore>
  stress: Record<Fn, FunctionScore>
  acquiescence: number // mean Likert response that was subtracted
  answeredCount: number
}

const LIKERT_WORDS: Record<number, string> = {
  [-2]: 'Not me',
  [-1]: 'Rarely me',
  0: 'Sometimes',
  1: 'Often me',
  2: 'Very me',
}

interface Acc {
  sum: number
  maxUp: number
  maxDown: number
  absSum: number
  ledger: Contribution[]
}

const emptyAcc = (): Record<Fn, Acc> =>
  Object.fromEntries(
    FUNCTIONS.map((f) => [f, { sum: 0, maxUp: 0, maxDown: 0, absSum: 0, ledger: [] }]),
  ) as unknown as Record<Fn, Acc>

export function acquiescenceOf(items: Item[], answers: Answers): number {
  const rs = items.filter((i) => i.kind === 'likert' && answers[i.id] !== undefined).map((i) => answers[i.id])
  return rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0
}

export function scoreAnswers(items: Item[], answers: Answers): ScoreResult {
  const pref = emptyAcc()
  const stress = emptyAcc()
  const mean = acquiescenceOf(items, answers)
  let answeredCount = 0

  for (const item of items) {
    const a = answers[item.id]
    if (a === undefined) continue
    answeredCount++
    const isStress = item.facet === 'stress'
    const acc = isStress ? stress : pref
    // Stress items use weight 1 inside their own scale; weight 0 for preference.
    const w = isStress ? 1 : FACET_WEIGHT[item.facet]

    if (item.kind === 'likert') {
      const rAdj = a - mean
      for (const [fn, load] of Object.entries(item.loads) as [Fn, number][]) {
        const c = w * load * rAdj
        const max = 2 * w * Math.abs(load)
        const t = acc[fn]
        t.sum += c
        t.absSum += Math.abs(c)
        t.maxUp += max
        t.maxDown += max
        t.ledger.push({ itemId: item.id, fn, value: c, answer: LIKERT_WORDS[a] ?? String(a) })
      }
    } else {
      if (a < 0) continue // "none of these fit": item skipped entirely
      item.options.forEach((opt, idx) => {
        const picked = idx === a
        for (const [fn, load] of Object.entries(opt.loads) as [Fn, number][]) {
          const c = w * load * (picked ? CHOICE_PICKED : CHOICE_UNPICKED)
          const t = acc[fn]
          t.sum += c
          t.absSum += Math.abs(c)
          t.maxUp += w * Math.abs(load) * CHOICE_PICKED
          t.maxDown += w * Math.abs(load) * -CHOICE_UNPICKED
          t.ledger.push({
            itemId: item.id,
            fn,
            value: c,
            answer: picked ? `Picked: “${opt.text}”` : `Passed over: “${opt.text}”`,
          })
        }
      })
    }
  }

  const finish = (accs: Record<Fn, Acc>) =>
    Object.fromEntries(
      FUNCTIONS.map((fn) => {
        const t = accs[fn]
        let score = 50
        if (t.sum >= 0 && t.maxUp > 0) score = 50 + (50 * t.sum) / t.maxUp
        else if (t.sum < 0 && t.maxDown > 0) score = 50 + (50 * t.sum) / t.maxDown
        score = Math.max(0, Math.min(100, score))
        const clarity = t.absSum > 0 ? Math.abs(t.sum) / t.absSum : 0
        return [fn, { fn, score, clarity, sum: t.sum, maxUp: t.maxUp, maxDown: t.maxDown, ledger: t.ledger }]
      }),
    ) as Record<Fn, FunctionScore>

  return { scores: finish(pref), stress: finish(stress), acquiescence: mean, answeredCount }
}

/** Top contributions in each direction, for the "why" ledger UI. */
export function topContributions(fs: FunctionScore, n = 5) {
  const sorted = [...fs.ledger].filter((c) => Math.abs(c.value) > 1e-9).sort((a, b) => b.value - a.value)
  return {
    raised: sorted.filter((c) => c.value > 0).slice(0, n),
    lowered: sorted.filter((c) => c.value < 0).reverse().slice(0, n),
  }
}
