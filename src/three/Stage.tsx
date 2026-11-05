import { PerformanceMonitor, PerspectiveCamera, View } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { driveScrollFromRenderLoop, stepScroll } from '../lib/smooth'
import { useEffect, useState } from 'react'
import type { Fn } from '../engine/model'
import { prefersReducedMotion, webglAvailable } from '../scenes/layout'
import { FunctionForm } from './forms'
import { Glyph } from './glyphs'

/** Decided once per visit: WebGL present and motion welcome. */
export const THREE_ON = typeof window !== 'undefined' && webglAvailable() && !prefersReducedMotion()

const COARSE = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
/** Pixel density cap: phones get a lighter canvas; everyone steps down if frames drop. */
const MAX_DPR = COARSE ? 1.25 : 1.6

/** Advance smooth scrolling before each 3D frame, so tracked views never lag the DOM. */
function ScrollSync() {
  useEffect(() => {
    driveScrollFromRenderLoop(true)
    return () => driveScrollFromRenderLoop(false)
  }, [])
  useFrame(() => stepScroll(performance.now()), -1)
  return null
}

/**
 * One fixed, transparent canvas above the page that draws every <NoteForm/> in its own box.
 * Pointer events pass through to the page; interaction lives on the DOM element.
 */
export function FormsCanvas() {
  const [ready, setReady] = useState(false)
  const [dpr, setDpr] = useState(Math.min(window.devicePixelRatio || 1, MAX_DPR))
  useEffect(() => setReady(true), [])
  if (!THREE_ON || !ready) return null
  return (
    <Canvas
      className="forms-canvas"
      dpr={dpr}
      gl={{ alpha: true, antialias: !COARSE, powerPreference: 'high-performance', stencil: false }}
      eventSource={document.getElementById('root')!}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}
    >
      <ScrollSync />
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(window.devicePixelRatio || 1, MAX_DPR))} />
      <View.Port />
    </Canvas>
  )
}

export interface NoteFormProps {
  fn: Fn
  intensity?: number
  mono?: boolean
  active?: boolean
  className?: string
  style?: React.CSSProperties
  /** Accessible label; when omitted the form is decorative. */
  label?: string
  distance?: number
}

/** A living 3D form for one function, placed in normal layout flow. Falls back to a drawing. */
export function NoteForm({ fn, intensity = 0.7, mono, active, className = '', style, label, distance = 4.2 }: NoteFormProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
  if (!THREE_ON) {
    return (
      <div className={`note-form ${className}`} style={style} {...a11y}>
        <Glyph fn={fn} mono={mono} />
      </div>
    )
  }
  return (
    <div className={`note-form ${className}`} style={style} {...a11y}>
      <View className="note-form-view">
        <PerspectiveCamera makeDefault position={[0, 0, distance]} fov={35} />
        <hemisphereLight args={['#ffffff', '#6f6a64', 1.6]} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} />
        <FunctionForm fn={fn} intensity={intensity} mono={mono} active={active} />
      </View>
    </div>
  )
}
