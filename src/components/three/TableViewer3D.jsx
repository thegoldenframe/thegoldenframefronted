import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import SnookerTable from '../home/snooker3d/SnookerTable'
import { getInitialPositions } from '../home/snooker3d/SnookerBalls'
import { PALETTE } from '../home/snooker3d/SceneEnvironment'
import { useTheme } from '../../context/ThemeContext'

/* ──────────────────────────────────────────────────────────────
   Tables-page showcase: the same premium table model as the hero,
   with a staged platform, theme-aware lighting and a camera that
   automatically frames the table for every screen size.
────────────────────────────────────────────────────────────── */
const KINDS = {
  snooker: { scale: 0.62, felt: '#1a6b3c', markings: true,  ballR: 0.065 },
  pool:    { scale: 0.52, felt: '#1c5fa8', markings: false, ballR: 0.088 },
}
const FLOOR_Y = -1.72

/* Numbered pool-ball texture: solid or striped, with number disc */
function ballTexture(color, num, stripe) {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas'); c.width = 256; c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = stripe ? '#f6f2ea' : color; g.fillRect(0, 0, 256, 128)
  if (stripe) { g.fillStyle = color; g.fillRect(0, 34, 256, 60) }
  for (const cx of [64, 192]) {
    g.fillStyle = '#fbf8f0'; g.beginPath(); g.arc(cx, 64, 22, 0, Math.PI * 2); g.fill()
    g.fillStyle = '#111'; g.font = 'bold 28px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(num), cx, 66)
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
  return t
}
const POOL_COLORS = ['#f2c200', '#1f4fb8', '#d0261f', '#5b2a86', '#f0731c', '#1c8a3f', '#7a1f1f', '#111111']

function Balls({ kind }) {
  const cfg = KINDS[kind]
  const items = useMemo(() => {
    if (kind === 'snooker') return getInitialPositions().map(b => ({ id: b.id, x: b.x, z: b.z, color: b.color, map: null }))
    const out = [{ id: 'cue', x: -1.7, z: 0, color: '#f6f3ea', map: null }]
    const R = cfg.ballR, d = R * 2.03
    let n = 0; const order = [1, 9, 2, 10, 8, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15]
    for (let row = 0; row < 5; row++) for (let col = 0; col <= row; col++) {
      const num = order[n++]; const base = POOL_COLORS[(num - 1) % 8]
      out.push({ id: 'b' + num, x: 1.7 + row * d * 0.866, z: (col - row / 2) * d, color: base, map: ballTexture(base, num, num > 8) })
    }
    return out
  }, [kind, cfg.ballR])
  return (
    <group>
      {items.map(b => (
        <mesh key={b.id} position={[b.x, cfg.ballR, b.z]} castShadow>
          <sphereGeometry args={[cfg.ballR, 32, 24]} />
          <meshPhysicalMaterial color={b.map ? '#ffffff' : b.color} map={b.map} roughness={0.12} clearcoat={1} clearcoatRoughness={0.06} />
        </mesh>
      ))}
    </group>
  )
}

const PRESETS = [
  { id: 'orbit', label: '3/4 View' },
  { id: 'top', label: 'Top' },
  { id: 'side', label: 'Side' },
  { id: 'pocket', label: 'Pocket' },
]

/* Frames the table to the canvas size (centred, fully visible) and glides between view presets */
function CameraRig({ kind, preset }) {
  const { camera, size, controls } = useThree()
  const anim = useRef({ t: 1, fromP: new THREE.Vector3(), toP: new THREE.Vector3(), fromL: new THREE.Vector3(), toL: new THREE.Vector3() })
  const first = useRef(true)

  useEffect(() => {
    const s = KINDS[kind].scale
    const halfW = (3.4 + 0.22) * s * 1.1, halfH = 1.0 * s * 1.9
    const vfov = THREE.MathUtils.degToRad(camera.fov)
    const aspect = size.width / Math.max(size.height, 1)
    const d = Math.max(halfH / Math.tan(vfov / 2), halfW / (Math.tan(vfov / 2) * aspect)) * 1.25 + 1.2
    const corner = new THREE.Vector3(3.4 * s, 0, 1.75 * s)
    let pos, look
    if (preset === 'top') { pos = new THREE.Vector3(0.001, d * 1.05, 0.02); look = new THREE.Vector3(0, -0.2 * s, 0) }
    else if (preset === 'side') { pos = new THREE.Vector3(0, d * 0.28, d * 0.98); look = new THREE.Vector3(0, -0.5 * s, 0) }
    else if (preset === 'pocket') { pos = corner.clone().add(new THREE.Vector3(0.95, 0.8, 1.35)); look = corner.clone().add(new THREE.Vector3(-0.08, -0.02, -0.1)) }
    else { pos = new THREE.Vector3(0.45, 0.62, 0.9).normalize().multiplyScalar(d).add(new THREE.Vector3(0, -0.25 * s, 0)); look = new THREE.Vector3(0, -0.45 * s, 0) }
    const a = anim.current
    if (first.current) { first.current = false; camera.position.copy(pos); camera.lookAt(look); if (controls) controls.target.copy(look); a.t = 1; return }
    a.fromP.copy(camera.position); a.toP.copy(pos)
    a.fromL.copy(controls ? controls.target : look); a.toL.copy(look)
    a.t = 0
  }, [camera, controls, size.width, size.height, kind, preset])

  useFrame((_, dt) => {
    const a = anim.current
    if (a.t >= 1) return
    a.t = Math.min(1, a.t + dt / 0.85)
    const e = a.t * a.t * (3 - 2 * a.t)
    camera.position.lerpVectors(a.fromP, a.toP, e)
    const tgt = new THREE.Vector3().lerpVectors(a.fromL, a.toL, e)
    if (controls) { controls.target.copy(tgt); controls.update() } else camera.lookAt(tgt)
  })
  return null
}

const TableViewer3D = ({ kind = 'snooker', felt, className = '' }) => {
  const { theme } = useTheme()
  const [preset, setPreset] = useState('orbit')
  const p = PALETTE[theme]
  const cfg = KINDS[kind] || KINDS.snooker
  const s = cfg.scale
  const light = theme === 'light'
  return (
    <div className={`relative ${className}`} style={{ background: light ? 'radial-gradient(ellipse at 50% 40%, #F7FBF3 0%, #D5E2D0 100%)' : 'radial-gradient(ellipse at 50% 40%, #153a2d 0%, #06110D 85%)' }}>
      <Canvas shadows dpr={[1, 1.75]} camera={{ fov: 34, near: 0.1, far: 60, position: [4, 3, 6] }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: p.exposure }}>
        <CameraRig kind={kind} preset={preset} />
        <ambientLight intensity={light ? 0.6 : 0.35} color="#FFF5E0" />
        <hemisphereLight args={[p.hemiSky, p.hemiGround, light ? 0.9 : 0.35]} />
        <directionalLight position={[-4, 6, 4]} intensity={light ? 1.6 : 1.0} color="#FFF8E7" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-0.0004} shadow-normalBias={0.02} shadow-radius={4} />
        <spotLight position={[0, 4.2, 0.4]} angle={0.9} penumbra={1} intensity={light ? 14 : 34} decay={2} distance={16} color="#FFE6B8" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0003} />
        <pointLight position={[4, 1.5, -3]} intensity={light ? 2 : 6} color="#D68454" distance={12} />
        <Suspense fallback={null}>
          <Environment preset={p.envPreset} environmentIntensity={p.envIntensity} />
          <group scale={s}>
            <SnookerTable key={kind + (felt || '')} felt={felt || cfg.felt} showMarkings={cfg.markings} />
            <Balls kind={kind} />
          </group>
          {/* staged platform */}
          <mesh position={[0, FLOOR_Y * s - 0.04, 0]} receiveShadow>
            <cylinderGeometry args={[4.4 * s * 1.25, 4.4 * s * 1.3, 0.08, 64]} />
            <meshStandardMaterial color={light ? '#C5D3BF' : '#0c1c16'} roughness={0.5} metalness={0.15} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y * s + 0.002, 0]}>
            <ringGeometry args={[4.4 * s * 1.25 - 0.05, 4.4 * s * 1.25, 96]} />
            <meshStandardMaterial color="#D68454" roughness={0.25} metalness={0.9} />
          </mesh>
          <ContactShadows position={[0, FLOOR_Y * s + 0.003, 0]} opacity={light ? 0.45 : 0.7} scale={14} blur={2.4} far={3.2} resolution={512} />
        </Suspense>
        <OrbitControls makeDefault target={[0, -0.45 * s, 0]} enablePan={false} enableZoom={false} enableDamping dampingFactor={0.08}
          autoRotate={preset === 'orbit'} autoRotateSpeed={0.7} minPolarAngle={preset === 'top' ? 0 : 0.35} maxPolarAngle={preset === 'top' ? 0.4 : 1.45} />
      </Canvas>
      {/* view presets */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
        {PRESETS.map(v => (
          <button key={v.id} onClick={() => setPreset(v.id)} aria-pressed={preset === v.id}
            className={`px-3 py-1.5 font-body text-[9px] tracking-[0.18em] uppercase border backdrop-blur-md transition-all ${preset === v.id ? 'bg-gold text-black border-gold' : 'bg-surface/80 text-gray/80 border-gold/25 hover:border-gold/60 hover:text-gold'}`}>
            {v.label}
          </button>
        ))}
      </div>
      <span className={`pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-body text-[9px] tracking-[0.25em] uppercase ${light ? 'text-gold-dark' : 'text-gold/70'}`}>Drag to rotate</span>
    </div>
  )
}
export { Balls, KINDS }
export default TableViewer3D
