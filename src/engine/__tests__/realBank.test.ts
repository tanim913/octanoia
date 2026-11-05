import { describe, expect, it } from 'vitest'
import { itemsFor } from '../../data/items'
import type { Answers, Fn, Item, Mode } from '../model'
import { scoreAnswers } from '../score'
import { fitTypes, scoresOf, template } from '../typeFit'
import { STACKS, TYPE_CODES } from '../types16'

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

/** A respondent whose latent preferences follow a type template, plus noise. */
function simulate(items: Item[], code: string, noise: number, seed: number, yeaSay = 0): Answers {
  const t = template(code)
  const inferior = STACKS[code][3]
  const rand = rng(seed)
  const a: Answers = {}
  for (const item of items) {
    if (item.kind === 'likert') {
      const [fn, load] = Object.entries(item.loads)[0] as [Fn, number]
      const base = item.facet === 'stress' ? (fn === inferior ? 1.5 : -0.5) : 4 * (t[fn] - 0.5) * Math.sign(load)
      const latent = base + yeaSay + (rand() - 0.5) * 2 * noise
      a[item.id] = Math.max(-2, Math.min(2, Math.round(latent)))
    } else {
      let best = 0
      let bestV = -Infinity
      item.options.forEach((o, idx) => {
        const fn = Object.keys(o.loads)[0] as Fn
        const v = t[fn] + (rand() - 0.5) * noise * 0.6
        if (v > bestV) {
          bestV = v
          best = idx
        }
      })
      a[item.id] = best
    }
  }
  return a
}

describe.each(['quick', 'deep'] as Mode[])('real %s bank recovers simulated types', (mode) => {
  const items = itemsFor(mode)
  it.each(TYPE_CODES)('%s', (code) => {
    let wins = 0
    for (let s = 1; s <= 6; s++) {
      const r = scoreAnswers(items, simulate(items, code, 1, s * 131))
      const fit = fitTypes(scoresOf(r.scores), scoresOf(r.stress))
      if (fit.ranked[0].code === code) wins++
    }
    expect(wins).toBeGreaterThanOrEqual(5)
  })

  it('yea-saying respondents are still typed correctly', () => {
    let wins = 0
    for (const code of TYPE_CODES) {
      const r = scoreAnswers(items, simulate(items, code, 0.8, 5, 1))
      if (fitTypes(scoresOf(r.scores)).ranked[0].code === code) wins++
    }
    expect(wins).toBeGreaterThanOrEqual(14)
  })
})
