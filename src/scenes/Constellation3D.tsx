import { PerspectiveCamera, View } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PROFILES } from '../data/functions'
import type { Fn } from '../engine/model'
import { FunctionForm } from '../three/forms'
import { AXIS_PAIRS, RING, ringPosition, type ConstellationProps } from './layout'

const R = 2.25
type Anchors = Partial<Record<Fn, THREE.Object3D | null>>
type Labels = Partial<Record<Fn, HTMLElement | null>>

function Axes({ visible }: { visible: number }) {
  const geom = useMemo(() => {
    const pts: number[] = []
    AXIS_PAIRS.forEach(([a, b]) => {
      const [x1, y1] = ringPosition(a, R)
      const [x2, y2] = ringPosition(b, R)
      pts.push(x1, y1, 0, x2, y2, 0)
    })
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  }, [])
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color="#8d8984" transparent opacity={0.15 + 0.3 * visible} />
    </lineSegments>
  )
}

function Scene({ scores, progress, selected, anchors, labels }: ConstellationProps & { anchors: React.MutableRefObject<Anchors>; labels: React.MutableRefObject<Labels> }) {
  const g = useRef<THREE.Group>(null)
  const { camera, size } = useThree()
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime()
    if (g.current) {
      g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, pointer.x * 0.18 + Math.sin(t * 0.15) * 0.12, 0.04)
      g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.1 - 0.08, 0.04)
    }
    // keep the whole ring in frame on narrow boxes
    const aspect = size.width / Math.max(1, size.height)
    const z = aspect < 1.05 ? (8.6 / Math.max(0.5, aspect)) * 1.02 : 8.6
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.2)
    for (const fn of RING) {
      const a = anchors.current[fn]
      const el = labels.current[fn]
      if (!a || !el) continue
      a.getWorldPosition(v).project(camera)
      el.style.transform = `translate(-50%, 0) translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px)`
    }
  })
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8.6]} fov={42} />
      <hemisphereLight args={['#ffffff', '#3a3836', 1.4]} />
      <directionalLight position={[3, 4, 6]} intensity={2.4} />
      <group ref={g}>
        <Axes visible={scores ? 1 : progress ?? 1} />
        {RING.map((fn) => {
          const [x, y] = ringPosition(fn, R)
          const s = scores ? scores[fn] / 100 : null
          const k = s === null ? 0.25 + 0.5 * (progress ?? 0) : 0.15 + 0.85 * s
          return (
            <group key={fn} position={[x, y, 0]} scale={0.62}>
              <FunctionForm fn={fn} intensity={k} mono={s === null} active={selected === fn} />
              <object3D position={[0, -1.25 - 0.45 * k, 0]} ref={(o) => void (anchors.current[fn] = o)} />
            </group>
          )
        })}
      </group>
    </>
  )
}

export default function Constellation3D(props: ConstellationProps) {
  const { scores, selected, onSelect, height = 520, label } = props
  const anchors = useRef<Anchors>({})
  const labels = useRef<Labels>({})
  return (
    <div className="constellation" style={{ height }} role={onSelect ? 'group' : 'img'} aria-label={label ?? 'Constellation of your eight functions'}>
      <View className="constellation-view">
        <Scene {...props} anchors={anchors} labels={labels} />
      </View>
      {scores && (
        <div className="orb-labels">
          {RING.map((fn) =>
            onSelect ? (
              <button
                key={fn}
                type="button"
                ref={(el) => void (labels.current[fn] = el)}
                className={`orb-label${selected === fn ? ' is-sel' : ''}`}
                onClick={() => onSelect(fn)}
                aria-pressed={selected === fn}
                aria-label={`${PROFILES[fn].name}, ${Math.round(scores[fn])}`}
              >
                <strong>{fn}</strong> <span className="tnum">{Math.round(scores[fn])}</span>
              </button>
            ) : (
              <span key={fn} ref={(el) => void (labels.current[fn] = el)} className="orb-label" aria-hidden="true">
                <strong>{fn}</strong> <span className="tnum">{Math.round(scores[fn])}</span>
              </span>
            ),
          )}
        </div>
      )}
    </div>
  )
}
