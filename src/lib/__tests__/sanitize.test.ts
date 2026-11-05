import { describe, expect, it } from 'vitest'
import { FUNCTIONS } from '../../engine/model'
import { sanitizeResult } from '../storage'

const scores = Object.fromEntries(FUNCTIONS.map((f) => [f, 50]))
const good = {
  id: 'abc-123',
  createdAt: '2026-11-01T10:00:00.000Z',
  testVersion: 'octanoia-1',
  mode: 'quick',
  answers: { q1: 2, c3: 1 },
  scores,
  topType: 'INFJ',
}

describe('sanitizeResult', () => {
  it('keeps a real result', () => {
    expect(sanitizeResult(good)).toMatchObject({ id: 'abc-123', topType: 'INFJ', mode: 'quick' })
  })
  it('drops unknown fields', () => {
    expect(sanitizeResult({ ...good, evil: '<img onerror=alert(1)>' })).not.toHaveProperty('evil')
  })
  it.each([
    ['bad mode', { mode: 'admin' }],
    ['html in id', { id: '<script>' }],
    ['score out of range', { scores: { ...scores, Ni: 900 } }],
    ['missing score', { scores: { Ni: 50 } }],
    ['string answer', { answers: { q1: '2' } }],
    ['array answers', { answers: [1, 2] }],
    ['bad date', { createdAt: 'yesterday' }],
  ])('rejects %s', (_, patch) => {
    expect(sanitizeResult({ ...good, ...patch })).toBeNull()
  })
  it('blanks an unknown type code and clamps future dates', () => {
    const r = sanitizeResult({ ...good, topType: 'ZZZZ', createdAt: '2999-01-01T00:00:00Z' })!
    expect(r.topType).toBe('')
    expect(Date.parse(r.createdAt)).toBeLessThanOrEqual(Date.now())
  })
})
