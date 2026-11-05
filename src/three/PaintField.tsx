import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PROFILES } from '../data/functions'
import { RING } from '../scenes/layout'
import { THREE_ON } from './Stage'

const MAX = 40
const srgb = (hex: string) => new THREE.Color(hex).convertLinearToSRGB()
const PIGMENTS = RING.map((f) => srgb(PROFILES[f].color))

const frag = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uPts[${MAX}];   // xy = position (px, y up), z = birth time, w = radius px
uniform vec3 uCols[${MAX}];
uniform int uCount;
uniform vec3 uPaper;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a*noise(p); p *= 2.03; a *= 0.5; } return v; }

void main(){
  vec2 px = vUv * uRes;
  vec3 col = uPaper;
  // paper tooth
  float grain = fbm(px * 0.35) * 0.022 + noise(px * 1.7) * 0.014;
  col -= grain;
  // one shared turbulence field for every bloom's edge (cheaper than per-bloom noise)
  float n = fbm(px * 0.012 + uTime * 0.02);
  for (int i = 0; i < ${MAX}; i++){
    if (i >= uCount) break;
    vec4 p = uPts[i];
    float age = uTime - p.z;
    float life = clamp(1.0 - age / 9.0, 0.0, 1.0);
    if (life <= 0.0) continue;
    float r = p.w * (0.75 + 0.45 * smoothstep(0.0, 2.5, age));      // pigment spreads as it soaks in
    vec2 dv = px - p.xy;
    if (dot(dv, dv) > r * r * 2.6) continue;                          // too far to matter
    float warp = (n - 0.5 + 0.22 * sin(dot(p.xy, vec2(0.013, 0.017)) + age * 0.3)) * r * 0.9;
    float d = length(dv) + warp;
    float body = 1.0 - smoothstep(r * 0.35, r, d);
    float rim = (1.0 - smoothstep(r * 0.88, r * 1.02, d)) - (1.0 - smoothstep(r * 0.7, r * 0.9, d)); // darker drying edge
    float amt = clamp(body * 0.27 + rim * 0.24, 0.0, 1.0) * life;
    vec3 pig = mix(vec3(1.0), uCols[i] * 1.1, 0.8);
    col = mix(col, col * pig, amt);
  }
  gl_FragColor = vec4(col, 1.0);
}
`

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`

function Field() {
  const { size, viewport, invalidate } = useThree()
  const pts = useRef<{ x: number; y: number; t: number; r: number; c: number; seed?: boolean }[]>([])
  const last = useRef({ x: -999, y: -999, i: 0 })
  const uniforms = useMemo(
    () => ({
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uPts: { value: Array.from({ length: MAX }, () => new THREE.Vector4()) },
      uCols: { value: Array.from({ length: MAX }, () => new THREE.Color()) },
      uCount: { value: 0 },
      uPaper: { value: srgb('#e4e3e0') },
    }),
    [],
  )
  const clock = useRef(0)
  const mat = useRef<THREE.ShaderMaterial>(null)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      if (dx * dx + dy * dy < 70 * 70) return
      last.current.x = e.clientX
      last.current.y = e.clientY
      const hue = Math.floor(last.current.i / 5) % PIGMENTS.length
      last.current.i++
      pts.current.push({ x: e.clientX, y: window.innerHeight - e.clientY, t: clock.current, r: 70 + Math.random() * 90, c: hue })
      if (pts.current.length > MAX) pts.current.splice(pts.current.findIndex((p) => !p.seed), 1)
      invalidate()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    // a few blooms already on the page, so the first screen is never empty
    const seed = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ;[
        [0.78, 0.7, 2],
        [0.86, 0.38, 4],
        [0.1, 0.18, 6],
        [0.66, 0.12, 1],
      ].forEach(([x, y, c], i) => pts.current.push({ x: x * w, y: (1 - y) * h, t: 0, r: 150 + i * 30, c, seed: true }))
    }
    seed()
    invalidate()
    return () => window.removeEventListener('pointermove', onMove)
  }, [invalidate])

  useFrame((_, dt) => {
    clock.current += Math.min(dt, 0.05)
    const u = (mat.current?.uniforms ?? uniforms) as typeof uniforms
    u.uTime.value = clock.current
    u.uRes.value.set(size.width, size.height)
    const list = pts.current.filter((p) => p.seed || clock.current - p.t < 9)
    pts.current = list
    u.uCount.value = list.length
    list.forEach((p, i) => {
      // seeds stay at a steady, half-dried state; pointer blooms spread and fade
      u.uPts.value[i].set(p.x, p.y, p.seed ? clock.current - 2.6 : p.t, p.r)
      u.uCols.value[i].copy(PIGMENTS[p.c])
    })
    // keep drawing only while some pigment is still spreading or fading
    if (list.some((p) => !p.seed)) invalidate()
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthTest={false} depthWrite={false} />
    </mesh>
  )
}

/** Fixed watercolour ground behind the whole site. Pointer movement leaves soft pigment blooms. */
export function PaintField() {
  if (!THREE_ON) return null
  return (
    <Canvas
      className="paint-field"
      frameloop="demand"
      dpr={0.5}
      gl={{ antialias: false, depth: false, stencil: false, powerPreference: 'low-power' }}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
    >
      <Field />
    </Canvas>
  )
}
