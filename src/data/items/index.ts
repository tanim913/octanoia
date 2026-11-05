import type { ChapterId, Item, Mode } from '../../engine/model'
import { DEEP } from './deep'
import { QUICK } from './quick'

export const ALL_ITEMS: Item[] = [...QUICK, ...DEEP]

export const CHAPTERS: { id: ChapterId; title: string; blurb: string }[] = [
  { id: 'new-place', title: 'A New Place', blurb: 'Arrivals, first impressions, getting your bearings.' },
  { id: 'making', title: 'Making Something', blurb: 'Learning, building, and seeing work through.' },
  { id: 'people', title: 'People Around You', blurb: 'Friends, groups, and how you show up with them.' },
  { id: 'deciding', title: 'Deciding', blurb: 'Choices big and small, and what tips them.' },
  { id: 'meaning', title: 'Ideas & Meaning', blurb: 'What grabs your mind and what you believe.' },
  { id: 'going-wrong', title: 'When Things Go Wrong', blurb: 'Setbacks, pressure, and how you respond.' },
  { id: 'time-off', title: 'Time Off', blurb: 'Free time, rest, and what refills you.' },
  { id: 'looking-back', title: 'Looking Back & Ahead', blurb: 'Memory, direction, and what lasts.' },
]

export function itemsFor(mode: Mode): Item[] {
  const order = new Map(CHAPTERS.map((c, i) => [c.id, i]))
  return ALL_ITEMS.filter((i) => i.modes.includes(mode)).sort(
    (a, b) => (order.get(a.chapter)! - order.get(b.chapter)!),
  )
}

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ALL_ITEMS.map((i) => [i.id, i]))
