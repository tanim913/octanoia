import { describe, expect, it } from 'vitest'
import { FUNCTIONS, type Facet, type Item, type Mode } from '../../../engine/model'
import { ALL_ITEMS, itemsFor } from '../index'
import { SAKINORVA_REFERENCE } from './sakinorvaReference'

const BANNED = ['always', 'never', 'everyone', 'photographic', 'prophetic', 'uncanny', 'manipulate', 'genius']
const STOP = new Set(
  'a an the and or but of to in on at for with by from as is are be been being you your yours yourself it its this that these those what which who whom how when where why if than then so very more most less least do does did have has had can could would should will just not no only also too about into over under up down out off own same such some any all each other there their they them he she his her we our us i me my was were am'.split(
    ' ',
  ),
)

const words = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z\s']/g, ' ')
      .split(/\s+/)
      .filter((w) => w && !STOP.has(w)),
  )

function jaccard(a: Set<string>, b: Set<string>) {
  const inter = [...a].filter((x) => b.has(x)).length
  const uni = new Set([...a, ...b]).size
  return uni ? inter / uni : 0
}

const texts = (i: Item) => (i.kind === 'likert' ? [i.text] : [i.text, ...i.options.map((o) => o.text)])

function counts(items: Item[]) {
  const likert: Record<string, Record<Facet, number>> = {}
  const choice: Record<string, number> = {}
  const reverse: Record<string, number> = {}
  FUNCTIONS.forEach((f) => {
    likert[f] = { process: 0, energy: 0, value: 0, stress: 0 }
    choice[f] = 0
    reverse[f] = 0
  })
  for (const i of items) {
    if (i.kind === 'likert') {
      for (const [f, l] of Object.entries(i.loads)) {
        likert[f][i.facet]++
        if (l! < 0) reverse[f]++
      }
    } else i.options.forEach((o) => Object.keys(o.loads).forEach((f) => choice[f]++))
  }
  return { likert, choice, reverse }
}

describe('item bank lint', () => {
  it('ids are unique', () => {
    const ids = ALL_ITEMS.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every item has why + sources and valid function loads', () => {
    for (const i of ALL_ITEMS) {
      expect(i.why.length, i.id).toBeGreaterThan(10)
      expect(i.sources.length, i.id).toBeGreaterThan(0)
      const loads = i.kind === 'likert' ? [i.loads] : i.options.map((o) => o.loads)
      loads.forEach((l) => Object.keys(l).forEach((k) => expect(FUNCTIONS as readonly string[], i.id).toContain(k)))
      if (i.kind === 'choice') expect(i.options.length, i.id).toBe(4)
    }
  })

  it('no banned words', () => {
    for (const i of ALL_ITEMS)
      for (const t of texts(i))
        for (const b of BANNED) expect(new RegExp(`\\b${b}`, 'i').test(t), `${i.id}: "${b}" in "${t}"`).toBe(false)
  })

  it('no duplicate texts', () => {
    const all = ALL_ITEMS.map((i) => i.text.toLowerCase())
    expect(new Set(all).size).toBe(all.length)
  })

  it('likert items do not start with "You are" / "You have"', () => {
    for (const i of ALL_ITEMS) if (i.kind === 'likert') expect(/^you (are|have)\b/i.test(i.text), i.id).toBe(false)
  })

  it('nothing resembles a Sakinorva item (Jaccard ≤ 0.4)', () => {
    const refs = SAKINORVA_REFERENCE.map((r) => ({ r, w: words(r) }))
    for (const i of ALL_ITEMS)
      for (const t of texts(i)) {
        const w = words(t)
        for (const { r, w: rw } of refs) expect(jaccard(w, rw), `${i.id} ~ "${r}"`).toBeLessThanOrEqual(0.4)
      }
  })

  const expectations: Record<Mode, { facets: Record<Facet, number>; choice: number; total: number }> = {
    quick: { facets: { process: 3, energy: 2, value: 1, stress: 0 }, choice: 8, total: 64 },
    deep: { facets: { process: 7, energy: 4, value: 2, stress: 2 }, choice: 20, total: 160 },
  }

  for (const mode of ['quick', 'deep'] as Mode[]) {
    it(`${mode}: balanced counts per function and facet`, () => {
      const items = itemsFor(mode)
      const e = expectations[mode]
      expect(items.length).toBe(e.total)
      const c = counts(items)
      FUNCTIONS.forEach((f) => {
        expect(c.likert[f], `${mode} ${f}`).toEqual(e.facets)
        expect(c.choice[f], `${mode} ${f} choice`).toBe(e.choice)
        expect(c.reverse[f], `${mode} ${f} reverse-keyed`).toBeGreaterThanOrEqual(1)
      })
    })
  }
})
