import { PerspectiveCamera, View } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { Fn } from '../engine/model'
import { FunctionForm } from '../three/forms'
import { Glyph } from '../three/glyphs'
import { THREE_ON } from '../three/Stage'

// A loose, hand-placed drift of the eight forms (x, y, z, scale), not a grid.
const PLACES: [Fn, number, number, number, number][] = [
  ['Ni', 0.1, 1.6, -0.6, 1.0],
  ['Fe', 1.75, 0.85, 0.2, 0.82],
  ['Se', -1.5, 0.75, 0.4, 0.88],
  ['Ti', 0.35, -0.1, 0.9, 0.78],
  ['Ne', 1.9, -0.95, -0.3, 0.9],
  ['Si', -0.95, -1.05, -0.2, 0.82],
  ['Te', -2.05, -0.35, -0.8, 0.7],
  ['Fi', 0.75, -1.85, 0.3, 0.8],
]

function Drift({ fn, x, y, z, s, i, active }: { fn: Fn; x: number; y: number; z: number; s: number; i: number; active: boolean }) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock, pointer }) => {
    if (!g.current) return
    const t = clock.getElapsedTime()
    g.current.position.set(
      x + Math.sin(t * 0.3 + i) * 0.12 + pointer.x * 0.25 * (z + 1.2),
      y + Math.cos(t * 0.25 + i * 1.7) * 0.14 + pointer.y * 0.18 * (z + 1.2),
      z,
    )
    const k = THREE.MathUtils.lerp(g.current.scale.x, s * (active ? 1.25 : 1), 0.08)
    g.current.scale.setScalar(k)
  })
  return (
    <group ref={g} position={[x, y, z]} scale={s}>
      <FunctionForm fn={fn} intensity={0.75} active={active} />
    </group>
  )
}

function FitCamera() {
  const { camera, size } = useThree()
  useFrame(() => {
    const aspect = size.width / Math.max(1, size.height)
    const z = aspect < 1 ? 7.5 / Math.max(0.55, aspect) : 7.5
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.2)
  })
  return null
}

/** The eight living forms drifting together. `active` brightens one. */
export function HeroForms({ active, className = '' }: { active?: Fn | null; className?: string }) {
  if (!THREE_ON) {
    return (
      <div className={`hero-forms hero-forms-flat ${className}`} aria-hidden="true">
        {PLACES.map(([fn, x, y, , s]) => (
          <span key={fn} style={{ left: `${50 + x * 15}%`, top: `${50 - y * 22}%`, width: `${s * 15}%` }}>
            <Glyph fn={fn} />
          </span>
        ))}
      </div>
    )
  }
  return (
    <div className={`hero-forms ${className}`} aria-hidden="true">
      <View className="note-form-view">
        <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={40} />
        <FitCamera />
        <hemisphereLight args={['#ffffff', '#6f6a64', 1.6]} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} />
        {PLACES.map(([fn, x, y, z, s], i) => (
          <Drift key={fn} fn={fn} x={x} y={y} z={z} s={s} i={i} active={active === fn} />
        ))}
      </View>
    </div>
  )
}
