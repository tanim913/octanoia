import type { Fn } from '../engine/model'

/**
 * Ring order: every axis partner sits opposite (Se–Ni, Te–Fi, Ne–Si, Fe–Ti);
 * extraverted notes take the upper half, introverted the lower half.
 */
export const RING: Fn[] = ['Se', 'Te', 'Ne', 'Fe', 'Ni', 'Fi', 'Si', 'Ti']

export function ringPosition(fn: Fn, radius = 1): [number, number] {
  const i = RING.indexOf(fn)
  const a = ((157.5 - 45 * i) * Math.PI) / 180
  return [Math.cos(a) * radius, Math.sin(a) * radius]
}

export const AXIS_PAIRS: [Fn, Fn][] = [
  ['Se', 'Ni'],
  ['Te', 'Fi'],
  ['Ne', 'Si'],
  ['Fe', 'Ti'],
]

export interface ConstellationProps {
  /** Null during the test: unlabelled, colourless points. */
  scores: Record<Fn, number> | null
  /** 0–1, used during the test to brighten points as chapters finish. */
  progress?: number
  selected?: Fn | null
  onSelect?: (fn: Fn) => void
  height?: number | string
  label?: string
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}
