import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

/* ──────────────────────────────────────────────────────────────
   PlayStation showcase: a TV whose screen is animated (flowing
   ribbons + PlayStation symbols) and casts a colour-shifting glow
   on the console and controller. The controller tilts toward the
   cursor and its light bar follows the screen colour.
────────────────────────────────────────────────────────────── */
const SYMBOLS = ['△', '○', '✕', '□']

function useScreen() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null
    const c = document.createElement('canvas'); c.width = 384; c.height = 216
    const g = c.getContext('2d')
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
    const draw = (t) => {
      const w = c.width, h = c.height, hue = (t * 18) % 360
      const bg = g.createLinearGradient(0, 0, w, h)
      bg.addColorStop(0, `hsl(${hue}, 70%, 14%)`); bg.addColorStop(1, `hsl(${(hue + 70) % 360}, 80%, 30%)`)
      g.fillStyle = bg; g.fillRect(0, 0, w, h)
      for (let k = 0; k < 6; k++) {
        g.beginPath()
        for (let x = 0; x <= w; x += 6) { const y = h * 0.52 + Math.sin(x * 0.018 + t * (0.9 + k * 0.15) + k * 1.3) * h * (0.09 + k * 0.012) + (k - 3) * 11; x ? g.lineTo(x, y) : g.moveTo(x, y) }
        g.strokeStyle = `hsla(${(hue + k * 28) % 360}, 95%, ${62 + k * 2}%, ${0.32 - k * 0.025})`; g.lineWidth = 7 - k * 0.6; g.stroke()
      }
      g.font = 'bold 26px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'
      for (let i = 0; i < 9; i++) {
        const sx = ((i * 97 + 30) % w), sy = h - ((t * (14 + (i % 4) * 7) + i * 53) % (h + 50)) + 20
        g.fillStyle = `rgba(255,255,255,${0.12 + (i % 3) * 0.06})`; g.save(); g.translate(sx, sy); g.rotate(Math.sin(t + i) * 0.4); g.fillText(SYMBOLS[i % 4], 0, 0); g.restore()
      }
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, h - 26, w, 26)
      g.font = '600 11px sans-serif'; g.textAlign = 'left'; g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillText('PLAYSTATION 5  ·  PRESS  ✕  TO START', 14, h - 13)
      g.fillStyle = `hsl(${hue}, 90%, 62%)`; g.fillRect(w - 110, h - 16, ((t * 30) % 96), 4)
      tex.needsUpdate = true
      return hue
    }
    return { tex, draw }
  }, [])
}

function haloTexture() {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas'); c.width = c.height = 256
  const g = c.getContext('2d'); const r = g.createRadialGradient(128, 128, 8, 128, 128, 128)
  r.addColorStop(0, 'rgba(255,255,255,0.9)'); r.addColorStop(0.45, 'rgba(255,255,255,0.28)'); r.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = r; g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

const Console = () => (
  <group>
    <mesh><boxGeometry args={[0.34, 1.7, 0.95]} /><meshStandardMaterial color="#0a0a0f" roughness={0.4} /></mesh>
    {[-1, 1].map(s => (
      <mesh key={s} position={[s * 0.2, 0, 0]} rotation={[0, 0, s * 0.03]}><boxGeometry args={[0.1, 1.72, 1.05]} /><meshStandardMaterial color="#f4f6fa" roughness={0.25} /></mesh>
    ))}
    <mesh position={[0, 0, 0.5]}><boxGeometry args={[0.28, 1.5, 0.02]} /><meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} toneMapped={false} /></mesh>
    <mesh position={[0, -0.9, 0]}><cylinderGeometry args={[0.55, 0.6, 0.06, 32]} /><meshStandardMaterial color="#e5e7eb" roughness={0.3} /></mesh>
  </group>
)

const Controller = React.forwardRef(function Controller({ barRef }, ref) {
  const white = { color: '#f4f6fa', roughness: 0.3 }
  return (
    <group ref={ref}>
      <mesh scale={[1.5, 0.45, 0.8]}><sphereGeometry args={[0.5, 32, 32]} /><meshStandardMaterial {...white} /></mesh>
      {[-1, 1].map(s => (
        <mesh key={s} position={[s * 0.6, -0.2, 0.05]} rotation={[0, 0, s * -0.25]} scale={[0.5, 1, 0.7]}><capsuleGeometry args={[0.2, 0.45, 8, 16]} /><meshStandardMaterial {...white} /></mesh>
      ))}
      <mesh position={[0, 0.17, 0.02]} scale={[0.55, 0.05, 0.3]}><sphereGeometry args={[0.5, 24, 24]} /><meshStandardMaterial color="#0a0a0f" /></mesh>
      <mesh ref={barRef} position={[0, 0.2, 0.18]}><boxGeometry args={[0.5, 0.02, 0.03]} /><meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3} toneMapped={false} /></mesh>
      {[-0.28, 0.28].map(x => (
        <mesh key={x} position={[x, 0.17, -0.1]}><cylinderGeometry args={[0.07, 0.07, 0.05, 16]} /><meshStandardMaterial color="#111" /></mesh>
      ))}
      {[['#38bdf8', 0.5, 0.05], ['#f87171', 0.62, -0.05], ['#f472b6', 0.38, -0.05], ['#4ade80', 0.5, -0.15]].map(([c, x, z], i) => (
        <mesh key={i} position={[x, 0.19, z - 0.05]}><cylinderGeometry args={[0.035, 0.035, 0.03, 12]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} /></mesh>
      ))}
    </group>
  )
})

function Stage() {
  const screen = useScreen()
  const halo = useMemo(() => haloTexture(), [])
  const ctrl = useRef(), consoleRef = useRef(), glow = useRef(), haloMat = useRef(), bar = useRef(), screenMat = useRef()
  const pointer = useRef({ x: 0, y: 0 })
  const tmp = useMemo(() => new THREE.Color(), [])
  const frame = useRef(0)

  // cursor anywhere on the page steers the controller
  useEffect(() => {
    if (typeof window === 'undefined') return
    const move = (e) => { pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1 }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    frame.current++
    let hue = (t * 18) % 360
    if (screen && frame.current % 2 === 0) hue = screen.draw(t)
    tmp.setHSL(hue / 360, 0.85, 0.55)
    if (glow.current) { glow.current.color.copy(tmp); glow.current.intensity = 14 + Math.sin(t * 2.1) * 2.5 }
    if (haloMat.current) { haloMat.current.color.copy(tmp); haloMat.current.opacity = 0.5 + Math.sin(t * 1.7) * 0.06 }
    if (bar.current) { bar.current.material.color.copy(tmp); bar.current.material.emissive.copy(tmp) }
    const k = 1 - Math.exp(-dt * 6), px = pointer.current.x, py = pointer.current.y
    if (ctrl.current) {
      ctrl.current.rotation.y += ((0.25 + px * 0.75) - ctrl.current.rotation.y) * k
      ctrl.current.rotation.x += ((0.62 - py * 0.5) - ctrl.current.rotation.x) * k
      ctrl.current.rotation.z += ((-px * 0.18) - ctrl.current.rotation.z) * k
    }
    if (consoleRef.current) consoleRef.current.rotation.y += ((0.35 + px * 0.25) - consoleRef.current.rotation.y) * k
  })

  return (
    <>
      {/* TV */}
      <group position={[0, 0.45, -2.0]}>
        <mesh position={[0, 0, -0.02]}><boxGeometry args={[3.75, 2.14, 0.1]} /><meshStandardMaterial color="#090d0b" roughness={0.35} metalness={0.6} /></mesh>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[3.55, 1.99]} />
          <meshBasicMaterial ref={screenMat} map={screen ? screen.tex : null} color={screen ? '#ffffff' : '#1b5e4a'} toneMapped={false} />
        </mesh>
        <mesh position={[0, -1.28, -0.05]}><boxGeometry args={[0.18, 0.42, 0.1]} /><meshStandardMaterial color="#0c120f" metalness={0.7} roughness={0.4} /></mesh>
        <mesh position={[0, -1.5, 0.1]}><boxGeometry args={[1.5, 0.05, 0.55]} /><meshStandardMaterial color="#0c120f" metalness={0.7} roughness={0.4} /></mesh>
      </group>
      {/* screen halo + coloured light cast on the console and controller */}
      <mesh position={[0, 0.45, -2.12]}><planeGeometry args={[7.2, 4.6]} /><meshBasicMaterial ref={haloMat} map={halo} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight ref={glow} position={[0, 0.4, -0.6]} distance={9} decay={1.6} intensity={14} />

      <Float speed={1.4} rotationIntensity={0.05} floatIntensity={0.35}>
        <group ref={consoleRef} position={[-1.75, -0.45, 0.2]} scale={0.78} rotation-y={0.35}><Console /></group>
        <group position={[1.55, -0.78, 0.9]}><Controller ref={ctrl} barRef={bar} /></group>
      </Float>
      <ContactShadows position={[0, -1.35, 0]} opacity={0.55} scale={11} blur={2.6} />
    </>
  )
}

const PlayStation3D = ({ className = '' }) => (
  <div className={`relative ${className}`} style={{ background: 'radial-gradient(ellipse at 50% 35%, rgb(var(--c-surface)) 0%, rgb(var(--c-black)) 100%)' }}>
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.55, 6.4], fov: 38 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 4]} intensity={1.1} />
      <pointLight position={[-3, 1, 3]} intensity={6} color="#D68454" />
      <Stage />
      <OrbitControls enablePan={false} enableZoom={false} enableDamping minAzimuthAngle={-0.55} maxAzimuthAngle={0.55} minPolarAngle={1.2} maxPolarAngle={1.75} />
    </Canvas>
    <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-body text-[9px] tracking-[0.25em] uppercase text-gold/70">Move your cursor · drag to look around</span>
  </div>
)
export { Stage }
export default PlayStation3D
