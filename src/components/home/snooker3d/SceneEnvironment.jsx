import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

/* ──────────────────────────────────────────────────────────────
   Theme-aware environment for the hero scene: lounge floor, wall,
   background + fog and renderer exposure. The scene follows the
   website theme so the table and player stay clearly visible in
   both Dark Mode (moody lounge) and Light Mode (bright daylight).
────────────────────────────────────────────────────────────── */
export const PALETTE = {
  dark: {
    bg: '#06110D', fog: '#06110D', fogNear: 12, fogFar: 30,
    floorA: '#1d1712', floorB: '#120e0b', wall: '#0C1C16', wainscot: '#10261D', trim: '#D68454',
    ambient: 0.3, hemiSky: '#FFF1D6', hemiGround: '#2a2118', hemi: 0.3,
    key: 1.0, rim: 0.55, fill: 5, lamp: 12, exposure: 1.1, envIntensity: 0.55, envPreset: 'night',
    dust: 0.3,
  },
  light: {
    bg: '#EEF3EA', fog: '#EEF3EA', fogNear: 14, fogFar: 36,
    floorA: '#C7A472', floorB: '#B58F5C', wall: '#E3ECDE', wainscot: '#CFDCC9', trim: '#C8703A',
    ambient: 0.5, hemiSky: '#FFF8EA', hemiGround: '#C9AE82', hemi: 0.9,
    key: 1.5, rim: 0.7, fill: 3, lamp: 3.6, exposure: 1.0, envIntensity: 0.9, envPreset: 'apartment',
    dust: 0.12,
  },
}

/* Procedural plank-floor texture (canvas) */
function makeFloorTexture(a, b) {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas'); c.width = c.height = 512
  const g = c.getContext('2d')
  const base = new THREE.Color(a), alt = new THREE.Color(b)
  const planks = 8, ph = 512 / planks
  for (let i = 0; i < planks; i++) {
    let x = (i % 2) * -128
    while (x < 512) {
      const w = 256 + ((i * 37) % 3) * 32
      const t = ((x * 7 + i * 13) % 100) / 100
      const col = base.clone().lerp(alt, 0.25 + 0.55 * t)
      g.fillStyle = `#${col.getHexString()}`
      g.fillRect(x, i * ph, w, ph)
      // grain
      g.strokeStyle = 'rgba(0,0,0,0.07)'; g.lineWidth = 1
      for (let k = 0; k < 7; k++) { const y = i * ph + 3 + k * (ph / 7); g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y + ((k % 2) ? 1.5 : -1.5)); g.stroke() }
      // seams
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x, i * ph, 1.5, ph); g.fillRect(x, i * ph, w, 1.5)
      x += w
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(7, 7)
  tex.anisotropy = 8; tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function Floor({ theme }) {
  const p = PALETTE[theme]
  const tex = useMemo(() => makeFloorTexture(p.floorA, p.floorB), [p.floorA, p.floorB])
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-1.7} receiveShadow>
      <planeGeometry args={[34, 34]} />
      <meshStandardMaterial color={tex ? '#ffffff' : p.floorA} map={tex} roughness={theme === 'light' ? 0.55 : 0.4} metalness={0.0} envMapIntensity={0.6} />
    </mesh>
  )
}

export function BackWall({ theme }) {
  const p = PALETTE[theme]
  return (
    <group position={[0, 0, -6]}>
      <mesh position={[0, 1.5, 0]} receiveShadow>
        <planeGeometry args={[34, 10]} />
        <meshStandardMaterial color={p.wall} roughness={0.95} />
      </mesh>
      {/* wainscot panel + gold rail + skirting */}
      <mesh position={[0, -0.55, 0.02]} receiveShadow>
        <boxGeometry args={[34, 2.3, 0.06]} />
        <meshStandardMaterial color={p.wainscot} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.62, 0.07]}>
        <boxGeometry args={[34, 0.05, 0.06]} />
        <meshStandardMaterial color={p.trim} roughness={0.25} metalness={0.85} />
      </mesh>
      <mesh position={[0, -1.62, 0.07]}>
        <boxGeometry args={[34, 0.16, 0.08]} />
        <meshStandardMaterial color={p.wainscot} roughness={0.6} />
      </mesh>
    </group>
  )
}

/* Applies renderer exposure + keeps the scene background/fog in sync with the theme */
export function ThemeRenderer({ theme }) {
  const p = PALETTE[theme]
  const gl = useThree(s => s.gl)
  const scene = useThree(s => s.scene)
  useEffect(() => {
    gl.toneMappingExposure = p.exposure
    scene.background = new THREE.Color(p.bg)
  }, [gl, scene, p])
  return <fog attach="fog" args={[p.fog, p.fogNear, p.fogFar]} />
}
