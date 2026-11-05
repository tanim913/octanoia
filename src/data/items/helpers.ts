import type { ChapterId, ChoiceItem, Facet, Fn, LikertItem, Mode } from '../../engine/model'

export function L(
  id: string,
  chapter: ChapterId,
  facet: Facet,
  fn: Fn,
  load: number,
  text: string,
  why: string,
  sources: string[],
  modes: Mode[] = ['quick', 'deep'],
): LikertItem {
  return { id, kind: 'likert', chapter, facet, loads: { [fn]: load }, text, why, sources, modes }
}

export function C(
  id: string,
  chapter: ChapterId,
  text: string,
  options: [Fn, string][],
  why: string,
  sources: string[],
  modes: Mode[] = ['quick', 'deep'],
  facet: Facet = 'process',
): ChoiceItem {
  return {
    id,
    kind: 'choice',
    chapter,
    facet,
    text,
    options: options.map(([fn, t]) => ({ text: t, loads: { [fn]: 1 } })),
    why,
    sources,
    modes,
  }
}
