import { describe, expect, it } from 'vitest'
import { FUNCTIONS, type Answers, type Fn, type Item } from '../model'
import { scoreAnswers, topContributions } from '../score'
import { fitTypes, scoresOf, template } from '../typeFit'
import { TYPE_CODES } from '../types16'

// ---- synthetic bank: 6 likert per function (1 reverse-keyed) + 16 choice items ----
function syntheticBank(): Item[] {
  const items: Item[] = []
  FUNCTIONS.forEach((fn) => {
    for (let i = 0; i < 6; i++) {
      items.push({
        id: `${fn}-l${i}`,
        kind: 'likert',
        chapter: 'new-place',
        modes: ['quick'],
        facet: i < 3 ? 'process' : i < 5 ? 'energy' : 'value',
        text: `${fn} likert ${i}`,
        loads: { [fn]: i === 2 ? -1 : 1 },
        why: 'x',
        sources: ['test'],
      })
    }
  })
  // 16 choice items, 4 options each; every function appears 8 times
  for (let i = 0; i < 16; i++) {
    const opts = [0, 1, 2, 3].map((k) => FUNCTIONS[(i * 2 + k * 2 + (i % 2)) % 8])
    items.push({
      id: `c${i}`,
      kind: 'choice',
      chapter: 'deciding',
      modes: ['quick'],
      facet: 'process',
      text: `choice ${i}`,
      options: opts.map((fn) => ({ text: fn, loads: { [fn]: 1 } })),
      why: 'x',
      sources: ['test'],
    })
  }
  return items
}

// deterministic PRNG
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function simulate(items: Item[], code: string, noise: number, seed: number): Answers {
  const t = template(code)
  const rand = rng(seed)
  const answers: Answers = {}
  for (const item of items) {
    if (item.kind === 'likert') {
      const [fn, load] = Object.entries(item.loads)[0] as [Fn, number]
      const latent = 4 * (t[fn] - 0.5) * Math.sign(load) + (rand() - 0.5) * 2 * noise
      answers[item.id] = Math.max(-2, Math.min(2, Math.round(latent)))
    } else {
      let best = 0
      let bestV = -Infinity
      item.options.forEach((o, idx) => {
        const fn = Object.keys(o.loads)[0] as Fn
        const v = t[fn] + (rand() - 0.5) * noise * 0.5
        if (v > bestV) {
          bestV = v
          best = idx
        }
      })
      answers[item.id] = best
    }
  }
  return answers
}

const bank = syntheticBank()

describe('choice bank balance (sanity of synthetic fixture)', () => {
  it('each function appears 8 times across choice options', () => {
    const counts: Record<string, number> = {}
    bank.filter((i) => i.kind === 'choice').forEach((i) => {
      if (i.kind === 'choice') i.options.forEach((o) => Object.keys(o.loads).forEach((f) => (counts[f] = (counts[f] ?? 0) + 1)))
    })
    FUNCTIONS.forEach((f) => expect(counts[f]).toBe(8))
  })
})

describe('scoreAnswers', () => {
  it('all-neutral answers give 50s and zero clarity from likert', () => {
    const answers: Answers = {}
    bank.forEach((i) => (answers[i.id] = i.kind === 'likert' ? 0 : -1))
    const r = scoreAnswers(bank, answers)
    FUNCTIONS.forEach((f) => {
      expect(r.scores[f].score).toBeCloseTo(50)
      expect(r.scores[f].clarity).toBe(0)
    })
  })

  it('agree-with-everything is neutralised by the acquiescence correction', () => {
    const answers: Answers = {}
    bank.forEach((i) => (answers[i.id] = i.kind === 'likert' ? 2 : -1))
    const r = scoreAnswers(bank, answers)
    expect(r.acquiescence).toBe(2)
    FUNCTIONS.forEach((f) => expect(r.scores[f].score).toBeCloseTo(50))
  })

  it('ledger sums equal the function sum', () => {
    const answers = simulate(bank, 'INFJ', 1, 7)
    const r = scoreAnswers(bank, answers)
    FUNCTIONS.forEach((f) => {
      const s = r.scores[f].ledger.reduce((a, c) => a + c.value, 0)
      expect(s).toBeCloseTo(r.scores[f].sum)
    })
  })

  it('choice-only answers still produce differentiated scores', () => {
    const answers: Answers = {}
    bank.forEach((i) => {
      if (i.kind === 'choice') {
        const idx = i.options.findIndex((o) => 'Ni' in o.loads)
        answers[i.id] = idx >= 0 ? idx : -1
      }
    })
    const r = scoreAnswers(bank, answers)
    expect(r.scores.Ni.score).toBeGreaterThan(90)
    // Si shares choice items with Ni in the fixture, so passing it over lowers it
    expect(r.scores.Si.score).toBeLessThan(50)
  })

  it('a choice item sums to zero across functions', () => {
    const one = bank.filter((i) => i.id === 'c0')
    const r = scoreAnswers(one, { c0: 2 })
    const total = FUNCTIONS.reduce((a, f) => a + r.scores[f].sum, 0)
    expect(total).toBeCloseTo(0)
  })

  it('topContributions splits raised and lowered', () => {
    const r = scoreAnswers(bank, simulate(bank, 'ENTP', 0.5, 3))
    const { raised, lowered } = topContributions(r.scores.Ne)
    expect(raised.length).toBeGreaterThan(0)
    raised.forEach((c) => expect(c.value).toBeGreaterThan(0))
    lowered.forEach((c) => expect(c.value).toBeLessThan(0))
  })
})

describe('fitTypes', () => {
  it.each(TYPE_CODES)('a simulated %s respondent ranks %s first', (code) => {
    let wins = 0
    for (let seed = 1; seed <= 5; seed++) {
      const r = scoreAnswers(bank, simulate(bank, code, 0.8, seed * 97))
      const fit = fitTypes(scoresOf(r.scores))
      if (fit.ranked[0].code === code) wins++
    }
    expect(wins).toBeGreaterThanOrEqual(4)
  })

  it('flat scores give no meaningful fit', () => {
    const flat = Object.fromEntries(FUNCTIONS.map((f) => [f, 50])) as Record<Fn, number>
    const fit = fitTypes(flat)
    expect(fit.ranked[0].fit).toBe(0)
    expect(fit.tooClose).toBe(true)
  })

  it('tiebreak uses the inferior function stress score', () => {
    // equal fit for INFJ and INTJ: Ni top, Fe & Te equal
    const s = { Ni: 90, Fe: 70, Te: 70, Ti: 50, Fi: 50, Se: 30, Ne: 45, Si: 40 } as Record<Fn, number>
    const stressInfjAndIntjShareSe = { Ne: 50, Ni: 50, Se: 50, Si: 50, Te: 50, Ti: 50, Fe: 50, Fi: 50 } as Record<Fn, number>
    const fit = fitTypes(s, stressInfjAndIntjShareSe)
    expect(['INFJ', 'INTJ']).toContain(fit.ranked[0].code)
    expect(fit.decidingFns.length).toBeGreaterThan(0)
  })
})
