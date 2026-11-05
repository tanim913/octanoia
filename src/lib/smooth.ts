import Lenis from 'lenis'
import { prefersReducedMotion } from '../scenes/layout'

/**
 * One smooth-scroll engine for the whole site. Wheel and trackpad scrolling glide;
 * touch devices keep their native momentum; reduced-motion users get plain scrolling.
 */
let lenis: Lenis | null = null
/** When the 3D canvas is running, it advances scrolling inside its own frame so forms and page move together. */
let external = false

export function driveScrollFromRenderLoop(on: boolean) {
  external = on
}

export function stepScroll(time: number) {
  lenis?.raf(time)
}

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined' || prefersReducedMotion()) return
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false })
  const raf = (t: number) => {
    if (!external) lenis?.raf(t)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

/** Scroll to an element or the top, smoothly when the engine is running. */
export function scrollToTarget(target: HTMLElement | number, opts: { immediate?: boolean; offset?: number } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: opts.immediate, offset: opts.offset ?? -24, duration: 1.1 })
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: opts.immediate ? 'auto' : 'smooth' })
  else target.scrollIntoView({ behavior: opts.immediate ? 'auto' : 'smooth', block: 'start' })
}
