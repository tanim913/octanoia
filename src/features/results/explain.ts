import { ALL_ITEMS } from '../../data/items'
import { PROFILES } from '../../data/functions'
import { READINGS, tierOf } from '../../data/readings'
import { FUNCTIONS, type Answers, type Fn } from '../../engine/model'
import type { Contribution, FunctionScore } from '../../engine/score'
import type { TypeFit } from '../../engine/typeFit'
import { ROLES } from '../../engine/types16'

const ORD = ['highest', '2nd highest', '3rd highest', '4th highest', '5th highest', '6th highest', '7th highest', 'lowest']

export function rankOf(scores: Record<Fn, number>) {
  const sorted = [...FUNCTIONS].sort((a, b) => scores[b] - scores[a])
  return (fn: Fn) => sorted.indexOf(fn)
}

export const ordinal = (r: number) => ORD[r]

/** Plain-language reasons why a type pattern fits (or doesn't) these scores. */
export function whyFits(fit: TypeFit, scores: Record<Fn, number>): string[] {
  const rank = rankOf(scores)
  const [dom, aux, , inf] = fit.stack
  const line = (fn: Fn, role: string, want: 'high' | 'low') => {
    const r = rank(fn)
    const ok = want === 'high' ? r <= 2 : r >= 5
    return `${role} ${PROFILES[fn].name} (${fn}). Yours scored ${Math.round(scores[fn])}, your ${ORD[r]} note, which ${ok ? 'matches' : 'doesn’t quite match'} this pattern.`
  }
  return [line(dom, `${fit.code} leads with`, 'high'), line(aux, 'Its helper is', 'high'), line(inf, 'Its least developed note is', 'low')]
}

/** The role this function plays in a type, and whether the score agrees. */
export function roleLine(fn: Fn, score: number, fit: TypeFit): string {
  const pos = fit.stack.indexOf(fn)
  const role = ROLES[pos]
  const high = score >= 55
  const low = score < 45
  const name = PROFILES[fn].name
  switch (pos) {
    case 0:
      return `In the ${fit.code} pattern, ${name} is the Hero: the note you return to most.${high ? ' Your score fits that.' : ' Your score is lower than this pattern expects, which is worth noticing.'}`
    case 1:
      return `In ${fit.code}, ${name} is the Good Parent: the helper that supports your leading note and shows how you care for others.${high ? ' Your score fits that.' : ''}`
    case 2:
      return `In ${fit.code}, ${name} is the Eternal Child: playful and creative when no one is watching, but unreliable under pressure. A middling or uneven score here is common.`
    case 3:
      return `In ${fit.code}, ${name} is the Inner Guide: the least developed note, and often where your ideals live.${low ? ' A low score here is exactly what this pattern predicts.' : ' Your score is higher than usual for this position.'}`
    default:
      return `In ${fit.code}, ${name} plays the ${role.name}: ${role.does.charAt(0).toLowerCase() + role.does.slice(1)} Shadow roles like this usually score in the middle or low, because they show up mainly under challenge.`
  }
}

export interface FunctionStory {
  fn: Fn
  score: number
  tier: ReturnType<typeof tierOf>
  meaning: string
  practise?: string
  /** Answers that pushed in the direction of the result, strongest first. */
  because: Contribution[]
  /** Answers pulling the other way. */
  against: Contribution[]
  clarityLine: string
  all: Contribution[]
}

export function storyFor(fs: FunctionScore): FunctionStory {
  const tier = tierOf(fs.score)
  const nonzero = fs.ledger.filter((c) => Math.abs(c.value) > 1e-6)
  const up = nonzero.filter((c) => c.value > 0).sort((a, b) => b.value - a.value)
  const down = nonzero.filter((c) => c.value < 0).sort((a, b) => a.value - b.value)
  const leaningUp = fs.score >= 50
  const r = READINGS[fs.fn]
  const pct = Math.round(fs.clarity * 100)
  const clarityLine =
    pct >= 70
      ? `Your answers about it were very consistent (${pct}%), so this reading is fairly clear.`
      : pct >= 40
        ? `Your answers about it were moderately consistent (${pct}%).`
        : `Your answers about it pointed in different directions (${pct}% consistent). This note may be less settled for you, or depend a lot on the situation.`
  return {
    fn: fs.fn,
    score: fs.score,
    tier,
    meaning: leaningUp ? r.high : r.low,
    practise: leaningUp ? undefined : r.practise,
    because: (leaningUp ? up : down).slice(0, 4),
    against: (leaningUp ? down : up).slice(0, 3),
    clarityLine,
    all: [...up, ...down],
  }
}

/** Deep-bank items not yet answered that touch the deciding functions. */
export function sharpenItems(answers: Answers, fns: Fn[], max = 16): string[] {
  const set = new Set(fns)
  return ALL_ITEMS.filter((i) => answers[i.id] === undefined && i.facet !== 'stress')
    .filter((i) =>
      i.kind === 'likert'
        ? Object.keys(i.loads).some((f) => set.has(f as Fn))
        : i.options.filter((o) => Object.keys(o.loads).some((f) => set.has(f as Fn))).length >= 2,
    )
    .slice(0, max)
    .map((i) => i.id)
}
