import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { drinkColor } from '../../utils/foodMeta'

/* Small procedural 3D models (no downloads) for the cafe hover preview. */
const M = (color, o = {}) => <meshStandardMaterial color={color} roughness={o.r ?? 0.6} metalness={o.m ?? 0} {...o.extra} />
const lathe = (pts, seg = 40) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg)

function Steam() {
  const refs = useRef([])
  useFrame((s) => {
    refs.current.forEach((m, i) => {
      if (!m) return
      const t = (s.clock.elapsedTime * 0.35 + i / 6) % 1
      m.position.y = 0.55 + t * 0.9; m.position.x = Math.sin(t * 6 + i) * 0.08 + (i % 3 - 1) * 0.1
      m.scale.setScalar(0.07 + t * 0.14); m.material.opacity = (1 - t) * 0.35
    })
  })
  return <>{Array.from({ length: 6 }).map((_, i) => <mesh key={i} ref={el => (refs.current[i] = el)}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} /></mesh>)}</>
}

const Cup = () => {
  const outer = useMemo(() => lathe([[0, 0], [0.3, 0], [0.36, 0.04], [0.52, 0.5], [0.55, 0.56], [0.52, 0.58], [0.47, 0.56], [0.33, 0.1], [0, 0.08]]), [])
  const saucer = useMemo(() => lathe([[0, -0.02], [0.62, -0.02], [0.82, 0.04], [0.84, 0.06], [0.6, 0.0], [0, 0.0]]), [])
  return (
    <group position-y={-0.3}>
      <mesh geometry={saucer}>{M('#f6f2ea', { r: 0.25 })}</mesh>
      <mesh geometry={outer} position-y={0.02}><meshStandardMaterial color="#f6f2ea" roughness={0.2} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.54, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[0.49, 32]} />{M('#7a4a2a', { r: 0.3 })}</mesh>
      <mesh position={[0.56, 0.3, 0]} rotation-z={0}><torusGeometry args={[0.16, 0.035, 10, 20, Math.PI]} />{M('#f6f2ea', { r: 0.2 })}</mesh>
      <Steam />
    </group>
  )
}

const Burger = () => {
  const top = useMemo(() => lathe([[0, 0.34], [0.2, 0.33], [0.42, 0.26], [0.56, 0.12], [0.6, 0.0], [0.0, 0.0]]), [])
  const seeds = useMemo(() => Array.from({ length: 16 }, (_, i) => { const a = i * 2.4, r = 0.12 + (i % 4) * 0.1; return [Math.cos(a) * r, 0.32 - r * 0.45 + 0.02, Math.sin(a) * r, a] }), [])
  return (
    <group position-y={-0.38}>
      <mesh position-y={0.06}><cylinderGeometry args={[0.6, 0.56, 0.14, 32]} />{M('#d69a4a', { r: 0.55 })}</mesh>
      <mesh position-y={0.2}><cylinderGeometry args={[0.62, 0.62, 0.05, 32]} />{M('#7bb83d', { r: 0.7 })}</mesh>
      <mesh position-y={0.28}><cylinderGeometry args={[0.58, 0.58, 0.04, 32]} />{M('#d63b2f', { r: 0.5 })}</mesh>
      <mesh position-y={0.4}><cylinderGeometry args={[0.6, 0.6, 0.18, 32]} />{M('#5a3320', { r: 0.8 })}</mesh>
      <mesh position-y={0.51} rotation-y={Math.PI / 4}><boxGeometry args={[0.95, 0.025, 0.95]} />{M('#f2b61e', { r: 0.4 })}</mesh>
      <mesh geometry={top} position-y={0.55}>{M('#d69a4a', { r: 0.45 })}</mesh>
      {seeds.map(([x, y, z, a], i) => <mesh key={i} position={[x, y + 0.55, z]} rotation-y={a} scale={[1, 0.5, 0.6]}><sphereGeometry args={[0.03, 6, 5]} />{M('#f6e7c1', { r: 0.4 })}</mesh>)}
    </group>
  )
}

const Pizza = () => {
  const pep = useMemo(() => Array.from({ length: 9 }, (_, i) => { const a = i * 2.2, r = 0.18 + (i % 3) * 0.2; return [Math.cos(a) * r, Math.sin(a) * r] }), [])
  return (
    <group rotation-x={0.7} position-y={-0.05}>
      <mesh><cylinderGeometry args={[0.95, 0.95, 0.07, 48]} />{M('#e0a850', { r: 0.7 })}</mesh>
      <mesh position-y={0.04}><cylinderGeometry args={[0.82, 0.82, 0.02, 48]} />{M('#c92f1f', { r: 0.6 })}</mesh>
      <mesh position-y={0.06}><cylinderGeometry args={[0.8, 0.8, 0.02, 48]} />{M('#f3cf66', { r: 0.5 })}</mesh>
      {pep.map(([x, z], i) => <mesh key={i} position={[x, 0.085, z]}><cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />{M('#a9261c', { r: 0.5 })}</mesh>)}
      {[0, 2, 4, 6].map(i => <mesh key={'b' + i} position={[Math.cos(i * 1.57 + 0.5) * 0.45, 0.1, Math.sin(i * 1.57 + 0.5) * 0.45]} rotation-y={i} scale={[1, 0.3, 0.6]}><sphereGeometry args={[0.09, 8, 6]} />{M('#2f8a3b', { r: 0.6 })}</mesh>)}
    </group>
  )
}

const Glass = ({ color }) => {
  const ice = useMemo(() => [[-0.12, 0.52, 0.05, 0.4], [0.1, 0.62, -0.08, 0.9], [0.02, 0.4, 0.12, 1.4]], [])
  return (
    <group position-y={-0.5}>
      <mesh position-y={0.52}><cylinderGeometry args={[0.38, 0.3, 1.04, 32, 1, true]} /><meshStandardMaterial color="#dff3f2" transparent opacity={0.28} roughness={0.05} side={THREE.DoubleSide} /></mesh>
      <mesh position-y={0.46}><cylinderGeometry args={[0.35, 0.285, 0.86, 32]} /><meshStandardMaterial color={color} transparent opacity={0.88} roughness={0.2} /></mesh>
      <mesh position-y={0.02}><cylinderGeometry args={[0.3, 0.3, 0.04, 32]} />{M('#cfe7e5', { r: 0.1 })}</mesh>
      {ice.map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} rotation={[r, r * 1.3, 0]}><boxGeometry args={[0.17, 0.17, 0.17]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={0.1} /></mesh>)}
      <mesh position={[0.1, 0.75, 0]} rotation-z={-0.18}><cylinderGeometry args={[0.025, 0.025, 1.1, 8]} />{M('#d9423a')}</mesh>
      <mesh position={[0.37, 1.0, 0]} rotation-y={0.5}><cylinderGeometry args={[0.2, 0.2, 0.03, 24]} />{M('#f2d94a', { r: 0.5 })}</mesh>
    </group>
  )
}

const Fries = () => {
  const sticks = useMemo(() => Array.from({ length: 22 }, (_, i) => [((i % 5) - 2) * 0.13 + Math.sin(i) * 0.03, 0.55 + (i % 4) * 0.08, (Math.floor(i / 5) - 2) * 0.12 + Math.cos(i) * 0.03, (i % 7 - 3) * 0.05]), [])
  return (
    <group position-y={-0.35}>
      <mesh position-y={0.32} rotation-y={Math.PI / 4}><cylinderGeometry args={[0.52, 0.38, 0.64, 4]} />{M('#d63b2f', { r: 0.6 })}</mesh>
      <mesh position-y={0.32} rotation-y={Math.PI / 4}><cylinderGeometry args={[0.53, 0.385, 0.2, 4]} />{M('#f2b61e', { r: 0.6 })}</mesh>
      {sticks.map(([x, y, z, tilt], i) => <mesh key={i} position={[x, y, z]} rotation={[tilt, 0, tilt * 0.6]}><boxGeometry args={[0.075, 0.6, 0.075]} />{M('#f0c14a', { r: 0.7 })}</mesh>)}
    </group>
  )
}

const Dessert = () => (
  <group position-y={-0.3}>
    <mesh><cylinderGeometry args={[0.85, 0.8, 0.05, 40]} />{M('#f6f2ea', { r: 0.2 })}</mesh>
    <mesh position-y={0.22}><boxGeometry args={[0.85, 0.35, 0.85]} />{M('#3b1f12', { r: 0.7 })}</mesh>
    <mesh position-y={0.41} scale={[1, 0.05, 1]}><boxGeometry args={[0.87, 1, 0.87]} />{M('#2a150c', { r: 0.4 })}</mesh>
    <mesh position={[0, 0.62, 0]}><sphereGeometry args={[0.24, 20, 16]} />{M('#f8efdc', { r: 0.5 })}</mesh>
    <mesh position={[0, 0.69, 0]} rotation-x={Math.PI / 2}><torusGeometry args={[0.2, 0.025, 8, 24]} />{M('#3b1f12', { r: 0.3 })}</mesh>
    <mesh position={[0.02, 0.9, 0.02]}><sphereGeometry args={[0.055, 12, 10]} />{M('#b3121f', { r: 0.2 })}</mesh>
  </group>
)

function Spin({ children }) {
  const g = useRef()
  useFrame((s, dt) => { if (g.current) { g.current.rotation.y += dt * 0.9; g.current.position.y = Math.sin(s.clock.elapsedTime * 1.6) * 0.04 } })
  return <group ref={g}>{children}</group>
}

const FoodPreview3D = ({ kind, name = '' }) => (
  <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.75, 3.0], fov: 34 }} gl={{ alpha: true, antialias: true }}>
    <ambientLight intensity={0.8} />
    <hemisphereLight args={['#fff4e0', '#2a3b33', 0.7]} />
    <directionalLight position={[2, 3, 3]} intensity={1.6} color="#fff1d8" />
    <pointLight position={[-2, 1, 2]} intensity={5} color="#D68454" />
    <Spin>
      {kind === 'cup' && <Cup />}
      {kind === 'burger' && <Burger />}
      {kind === 'pizza' && <Pizza />}
      {kind === 'glass' && <Glass color={drinkColor(name)} />}
      {kind === 'fries' && <Fries />}
      {kind === 'dessert' && <Dessert />}
    </Spin>
  </Canvas>
)
export { Cup, Burger, Pizza, Glass, Fries, Dessert }
export default FoodPreview3D
