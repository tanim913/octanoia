// The eight function forms. Each shape encodes how its function works:
// Se rippling presence · Si stacked strata · Ne branching · Ni converging spiral
// Te ordered lattice · Ti precise crystal · Fe linked ring · Fi core within a shell
import { MeshDistortMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PROFILES } from '../data/functions'
import type { Fn } from '../engine/model'

export const MONO = '#9b9893'

export interface FormProps {
  fn: Fn
  /** 0–1: how strongly the note sounds. Scales size and liveliness. */
  intensity?: number
  /** Neutral grey, used while a test is still in progress. */
  mono?: boolean
  /** Brightened, e.g. when selected or hovered. */
  active?: boolean
}

function useColor(fn: Fn, mono?: boolean) {
  return mono ? MONO : PROFILES[fn].color
}

function Mat({ color, active, opacity = 1, rough = 0.42 }: { color: string; active?: boolean; opacity?: number; rough?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={rough}
      metalness={0.08}
      emissive={color}
      emissiveIntensity={active ? 0.35 : 0.12}
      transparent={opacity < 1}
      opacity={opacity}
    />
  )
}

/** Se: a body that ripples with whatever is happening now. */
function SeForm({ color, k, active }: { color: string; k: number; active?: boolean }) {
  return (
    <mesh scale={0.95}>
      <icosahedronGeometry args={[1, 10]} />
      <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={active ? 0.35 : 0.12} roughness={0.38} distort={0.22 + 0.28 * k} speed={1.5 + 3 * k} />
    </mesh>
  )
}

/** Si: strata, each layer a remembered impression, settling on the last. */
function SiForm({ color, k, active }: { color: string; k: number; active?: boolean }) {
  const g = useRef<THREE.Group>(null)
  const layers = 6
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = clock.getElapsedTime()
    g.current.children.forEach((c, i) => {
      c.position.y = -0.75 + i * 0.3 + Math.sin(t * 0.8 + i * 0.6) * 0.025 * (0.5 + k)
      c.rotation.z = t * 0.1 * (i % 2 ? 1 : -1)
    })
  })
  return (
    <group ref={g} rotation={[0.38, 0, 0]}>
      {Array.from({ length: layers }, (_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.55]}>
          <torusGeometry args={[0.95 - i * 0.12, 0.09, 10, 48]} />
          <Mat color={color} active={active} opacity={0.55 + i * 0.09} />
        </mesh>
      ))}
    </group>
  )
}

const fib = (n: number) =>
  Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = i * 2.399963
    return new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r)
  })

/** Ne: one seed, many branches, each ending in a new possibility. */
function NeForm({ color, k, active }: { color: string; k: number; active?: boolean }) {
  const g = useRef<THREE.Group>(null)
  const dirs = useMemo(() => fib(11), [])
  const branches = useMemo(
    () =>
      dirs.map((d, i) => {
        const len = 0.65 + ((i * 37) % 10) / 30
        const end = d.clone().multiplyScalar(len)
        const mid = d.clone().multiplyScalar(len * 0.5)
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d)
        const twig = d.clone().cross(new THREE.Vector3(0.3, 1, 0.2)).normalize().multiplyScalar(0.28).add(end.clone().multiplyScalar(0.9))
        return { end, mid, q, len, twig }
      }),
    [dirs],
  )
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = clock.getElapsedTime()
    g.current.rotation.y = t * (0.18 + 0.3 * k)
    g.current.rotation.z = Math.sin(t * 0.3) * 0.2
    g.current.scale.setScalar(0.92 + Math.sin(t * 1.6) * 0.04 * (0.4 + k))
  })
  return (
    <group ref={g}>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <Mat color={color} active={active} />
      </mesh>
      {branches.map((b, i) => (
        <group key={i}>
          <mesh position={b.mid} quaternion={b.q}>
            <cylinderGeometry args={[0.025, 0.04, b.len, 6]} />
            <Mat color={color} active={active} />
          </mesh>
          <mesh position={b.end}>
            <sphereGeometry args={[0.1 + (i % 3) * 0.03, 12, 12]} />
            <Mat color={color} active={active} />
          </mesh>
          {i % 2 === 0 && (
            <mesh position={b.twig}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <Mat color={color} active={active} opacity={0.75} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

/** Ni: many points drawn along a spiral into a single centre. */
function NiForm({ color, k, active }: { color: string; k: number; active?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const N = 72
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useFrame(({ clock }) => {
    const m = ref.current
    if (!m) return
    const t = clock.getElapsedTime() * (0.35 + 0.5 * k)
    for (let i = 0; i < N; i++) {
      const u = ((i / N + t * 0.08) % 1 + 1) % 1 // 0 outer → 1 centre
      const r = 1.05 * (1 - u)
      const a = u * Math.PI * 7 + i * 0.02
      dummy.position.set(Math.cos(a) * r, (0.5 - u) * 0.9 * (1 - u), Math.sin(a) * r)
      dummy.scale.setScalar(0.035 + 0.07 * (1 - u))
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })
  return (
    <group rotation={[0.55, 0, 0]}>
      <instancedMesh ref={ref} args={[undefined, undefined, N]}>
        <sphereGeometry args={[1, 10, 8]} />
        <Mat color={color} active={active} />
      </instancedMesh>
      <mesh>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.1 : 0.7} />
      </mesh>
    </group>
  )
}

/** Te: a lattice where every unit keeps its place in the order. */
function TeForm({ color, k, active }: { color: string; k: number; active?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const g = useRef<THREE.Group>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const cells = useMemo(() => {
    const c: [number, number, number][] = []
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) c.push([x, y, z])
    return c
  }, [])
  useFrame(({ clock }) => {
    const m = ref.current
    if (!m || !g.current) return
    const t = clock.getElapsedTime()
    const breathe = 0.5 + 0.06 * Math.sin(t * 1.4) * (0.4 + k)
    cells.forEach(([x, y, z], i) => {
      dummy.position.set(x * breathe, y * breathe, z * breathe)
      dummy.scale.setScalar(0.3)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    m.instanceMatrix.needsUpdate = true
    g.current.rotation.y = t * 0.2
    g.current.rotation.x = 0.5
  })
  return (
    <group ref={g}>
      <instancedMesh ref={ref} args={[undefined, undefined, cells.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <Mat color={color} active={active} rough={0.5} />
      </instancedMesh>
    </group>
  )
}

/** Ti: a precise crystal whose every face answers to the others. */
function TiForm({ color, k, active }: { color: string; k: number; active?: boolean }) {
  const g = useRef<THREE.Group>(null)
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(1.08)), [])
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = clock.getElapsedTime()
    g.current.rotation.y = t * (0.2 + 0.25 * k)
    g.current.rotation.x = Math.sin(t * 0.4) * 0.3 + 0.3
  })
  return (
    <group ref={g}>
      <mesh>
        <dodecahedronGeometry args={[0.92]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.15} flatShading emissive={color} emissiveIntensity={active ? 0.3 : 0.1} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} />
      </lineSegments>
    </group>
  )
}

/** Fe: a ring of links, each held by its neighbours. */
function FeForm({ color, k, active }: { color: string; k: number; active?: boolean }) {
  const g = useRef<THREE.Group>(null)
  const links = 7
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = clock.getElapsedTime()
    g.current.rotation.z = t * (0.15 + 0.25 * k)
    g.current.rotation.x = 0.9 + Math.sin(t * 0.5) * 0.15
  })
  return (
    <group ref={g}>
      {Array.from({ length: links }, (_, i) => {
        const a = (i / links) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0]} rotation={[i % 2 ? Math.PI / 2 : 0, 0, a + Math.PI / 2]}>
            <torusGeometry args={[0.3, 0.07, 10, 32]} />
            <Mat color={color} active={active} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Fi: a quiet shell around an intense, private core. */
function FiForm({ color, k, active }: { color: string; k: number; active?: boolean }) {
  const core = useRef<THREE.Mesh>(null)
  const shell = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (core.current) core.current.scale.setScalar(0.34 + Math.sin(t * (0.8 + k)) * 0.04 + 0.08 * k)
    if (shell.current) shell.current.rotation.y = t * 0.12
  })
  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial color={color} roughness={0.2} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[1, 24, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.2 : 0.75} roughness={0.3} />
      </mesh>
    </group>
  )
}

const FORMS: Record<Fn, typeof SeForm> = { Se: SeForm, Si: SiForm, Ne: NeForm, Ni: NiForm, Te: TeForm, Ti: TiForm, Fe: FeForm, Fi: FiForm }

export function FunctionForm({ fn, intensity = 0.7, mono, active }: FormProps) {
  const Form = FORMS[fn]
  const color = useColor(fn, mono)
  const k = Math.max(0, Math.min(1, intensity))
  return (
    <group scale={0.55 + 0.45 * k}>
      <Form color={color} k={k} active={active} />
    </group>
  )
}
