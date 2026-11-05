// Core domain types shared by the item bank, engine and UI.

export const FUNCTIONS = ['Ne', 'Ni', 'Se', 'Si', 'Te', 'Ti', 'Fe', 'Fi'] as const
export type Fn = (typeof FUNCTIONS)[number]

export type Facet = 'process' | 'energy' | 'value' | 'stress'
export type Mode = 'quick' | 'deep'

export type ChapterId =
  | 'new-place'
  | 'making'
  | 'people'
  | 'deciding'
  | 'meaning'
  | 'going-wrong'
  | 'time-off'
  | 'looking-back'

export type Loads = Partial<Record<Fn, number>>

interface ItemBase {
  id: string
  chapter: ChapterId
  modes: Mode[] // 'quick' items are also part of 'deep'
  facet: Facet
  /** Plain-language note shown in results: what this item listens for. */
  why: string
  /** Book references, e.g. "Thomson p.229". */
  sources: string[]
}

export interface LikertItem extends ItemBase {
  kind: 'likert'
  text: string
  /** Negative load = reverse-keyed. */
  loads: Loads
}

export interface ChoiceOption {
  text: string
  loads: Loads
}

export interface ChoiceItem extends ItemBase {
  kind: 'choice'
  /** Scene / prompt. */
  text: string
  options: ChoiceOption[]
}

export type Item = LikertItem | ChoiceItem

/** Likert: -2..2. Choice: option index, or -1 for "none of these fit". */
export type Answers = Record<string, number>

export const LIKERT_LABELS = ['Not me', 'Rarely me', 'Sometimes', 'Often me', 'Very me'] as const

export const FACET_WEIGHT: Record<Facet, number> = {
  process: 1,
  energy: 1,
  value: 0.5,
  stress: 0,
}

export const CHOICE_PICKED = 1.5
export const CHOICE_UNPICKED = -0.5

export const TEST_VERSION = 'octanoia-1'
