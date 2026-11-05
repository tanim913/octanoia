import type { Fn } from '../../engine/model'
import attitudes from './attitudes.md?raw'
import begin from './begin.md?raw'
import fe from './fe.md?raw'
import fi from './fi.md?raw'
import ne from './ne.md?raw'
import ni from './ni.md?raw'
import perceivingJudging from './perceiving-judging.md?raw'
import se from './se.md?raw'
import shadow from './shadow.md?raw'
import si from './si.md?raw'
import spectrum from './spectrum.md?raw'
import stack from './stack.md?raw'
import te from './te.md?raw'
import ti from './ti.md?raw'

export interface Chapter {
  slug: string
  part: 'Foundations' | 'The eight notes'
  title: string
  summary: string
  fn?: Fn
  body: string
}

export const CHAPTERS: Chapter[] = [
  { slug: 'begin', part: 'Foundations', title: 'Eight ways of minding the world', summary: 'The whole map in one place: two jobs the mind does, two directions it faces, and the four writers behind Octanoia.', body: begin },
  { slug: 'attitudes', part: 'Foundations', title: 'Outward and inward', summary: 'What Jung really meant by extraverted and introverted, and why it isn’t about being outgoing or shy.', body: attitudes },
  { slug: 'perceiving-judging', part: 'Foundations', title: 'Taking in, and deciding', summary: 'Perception and judgment, and why feeling is a way of reasoning, not an emotion.', body: perceivingJudging },
  { slug: 'stack', part: 'Foundations', title: 'Leader, helper, child and guide', summary: 'How functions develop in an order, and why growth comes through the helper.', body: stack },
  { slug: 'shadow', part: 'Foundations', title: 'The cast of eight', summary: 'John Beebe’s eight roles, and the shadow functions that appear under pressure.', body: shadow },
  { slug: 'spectrum', part: 'Foundations', title: 'A spectrum, not a box', summary: 'Why scores shift, why a flat profile isn’t balance, and what any test can and cannot tell you.', body: spectrum },
  { slug: 'se', part: 'The eight notes', fn: 'Se', title: 'Extraverted Sensing', summary: 'Meeting the world as it is, right now, through the body.', body: se },
  { slug: 'si', part: 'The eight notes', fn: 'Si', title: 'Introverted Sensing', summary: 'Checking new experience against a rich inner store of what you have lived.', body: si },
  { slug: 'ne', part: 'The eight notes', fn: 'Ne', title: 'Extraverted Intuition', summary: 'Seeing what a situation could become.', body: ne },
  { slug: 'ni', part: 'The eight notes', fn: 'Ni', title: 'Introverted Intuition', summary: 'Sensing the one pattern or meaning beneath many things.', body: ni },
  { slug: 'te', part: 'The eight notes', fn: 'Te', title: 'Extraverted Thinking', summary: 'Organising the world by shared, impersonal standards.', body: te },
  { slug: 'ti', part: 'The eight notes', fn: 'Ti', title: 'Introverted Thinking', summary: 'Making things fit an inner model of how they really work.', body: ti },
  { slug: 'fe', part: 'The eight notes', fn: 'Fe', title: 'Extraverted Feeling', summary: 'Weighing what matters by its effect on people and bonds.', body: fe },
  { slug: 'fi', part: 'The eight notes', fn: 'Fi', title: 'Introverted Feeling', summary: 'Measuring things against a deeply personal sense of what is right.', body: fi },
]

export const readMinutes = (md: string) => Math.max(3, Math.round(md.split(/\s+/).length / 220))
