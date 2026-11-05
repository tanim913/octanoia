import type { Fn } from './model'

/**
 * The 16 types as eight-position stacks (Beebe's model; positions 5–8 are
 * positions 1–4 with the attitude flipped). Verified against Beebe Table 7.1.
 */
export const STACKS: Record<string, [Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]> = {
  ENTP: ['Ne', 'Ti', 'Fe', 'Si', 'Ni', 'Te', 'Fi', 'Se'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si', 'Ni', 'Fe', 'Ti', 'Se'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni', 'Si', 'Te', 'Fi', 'Ne'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni', 'Si', 'Fe', 'Ti', 'Ne'],
  INTJ: ['Ni', 'Te', 'Fi', 'Se', 'Ne', 'Ti', 'Fe', 'Si'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se', 'Ne', 'Fi', 'Te', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne', 'Se', 'Ti', 'Fe', 'Ni'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne', 'Se', 'Fi', 'Te', 'Ni'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi', 'Ti', 'Ne', 'Si', 'Fe'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi', 'Ti', 'Se', 'Ni', 'Fe'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti', 'Fi', 'Ne', 'Si', 'Te'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti', 'Fi', 'Se', 'Ni', 'Te'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe', 'Te', 'Ni', 'Se', 'Fi'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe', 'Te', 'Si', 'Ne', 'Fi'],
  INFP: ['Fi', 'Ne', 'Si', 'Te', 'Fe', 'Ni', 'Se', 'Ti'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te', 'Fe', 'Si', 'Ne', 'Ti'],
}

export const TYPE_CODES = Object.keys(STACKS)

/** Template weight per stack position (see knowledge/scoring-model.md §6). */
export const POSITION_WEIGHTS = [1.0, 0.8, 0.4, 0.1, 0.3, 0.3, 0.3, 0.3] as const

export const ROLES = [
  { key: 'hero', name: 'Hero', area: 'strength and pride', does: 'Leads how you adapt; where you feel most competent.' },
  { key: 'parent', name: 'Good Parent', area: 'fostering and protecting', does: 'How you naturally help and support others.' },
  { key: 'child', name: 'Eternal Child', area: 'immaturity and play', does: 'Playful and creative when no one is watching; shaky under pressure.' },
  { key: 'anima', name: 'Inner Guide', area: 'embarrassment and idealization', does: 'Your weakest spot, and often your highest ideals. The gateway to growth.' },
  { key: 'opposing', name: 'Opposing Personality', area: 'frustration and challenge', does: 'Leaps out defensively when your strongest way of being is challenged.' },
  { key: 'critic', name: 'Critical Parent', area: 'limit-setting and control', does: 'Sets limits, sometimes by belittling or freezing things.' },
  { key: 'trickster', name: 'Trickster', area: 'manipulation and paradox', does: 'Double binds and loopholes, used by you or on you.' },
  { key: 'demon', name: 'Saboteur / Daimon', area: 'undermining and redemption', does: 'Undermines you under stress, yet can bring rare, surprising insight.' },
] as const

export const OPPOSITE: Record<Fn, Fn> = {
  Ni: 'Se', Se: 'Ni', Ne: 'Si', Si: 'Ne', Ti: 'Fe', Fe: 'Ti', Te: 'Fi', Fi: 'Te',
}

export const AXES: [Fn, Fn][] = [
  ['Ni', 'Se'],
  ['Ne', 'Si'],
  ['Ti', 'Fe'],
  ['Te', 'Fi'],
]
