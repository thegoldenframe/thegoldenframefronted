import React, { useMemo } from 'react'
import * as THREE from 'three'

/* ── Snooker table dimensions (scaled to scene units) ──
   NOTE: the cushion noses / pocket positions below match the ball physics (physics.js). */
const TABLE_W = 6.8   // playing width (x)
const TABLE_L = 3.5   // playing depth (z)
const RAIL_H = 0.18   // rail height above cloth
const RAIL_W = 0.22   // wooden rail thickness
const CLOTH_Y = 0.0   // cloth surface Y
const LEG_H = 1.6     // table leg height
const POCKET_R = 0.2  // pocket mouth radius

const HX = TABLE_W / 2, HZ = TABLE_L / 2           // inner opening half-sizes (3.4 × 1.75)
const NOSE_X = 3.25, NOSE_Z = 1.60                 // cushion nose positions (ball-physics faces)
const SIDE_END = 1.475, LONG_MIN = 0.175, LONG_MAX = 3.225

/* ── Pocket positions (6 pockets) ── */
const pocketPositions = [
  [-HX + 0.02, CLOTH_Y + 0.01, -HZ + 0.02],
  [0, CLOTH_Y + 0.01, -HZ - 0.02],
  [HX - 0.02, CLOTH_Y + 0.01, -HZ + 0.02],
  [-HX + 0.02, CLOTH_Y + 0.01, HZ - 0.02],
  [0, CLOTH_Y + 0.01, HZ + 0.02],
  [HX - 0.02, CLOTH_Y + 0.01, HZ - 0.02],
]
const POCKET_CENTERS = [[-HX, -HZ], [0, -HZ], [HX, -HZ], [-HX, HZ], [0, HZ], [HX, HZ]]

/* ── Procedural textures (canvas) ── */
function canvasTex(draw, size = 256, repeat = [1, 1]) {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas'); c.width = c.height = size
  draw(c.getContext('2d'), size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace
  return t
}
const clothTexture = () => canvasTex((g, s) => {
  g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, s, s)
  for (let i = 0; i < 9000; i++) { const v = 205 + Math.random() * 50; g.fillStyle = `rgba(${v},${v},${v},0.55)`; g.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4) }
  g.strokeStyle = 'rgba(0,0,0,0.045)'; g.lineWidth = 1
  for (let i = 0; i < s; i += 3) { g.beginPath(); g.moveTo(0, i); g.lineTo(s, i + 2); g.stroke() }
}, 256, [3.2, 1.6])
const woodTexture = () => canvasTex((g, s) => {
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, s, s)
  for (let i = 0; i < 70; i++) { const y = Math.random() * s, a = 0.05 + Math.random() * 0.12; g.strokeStyle = `rgba(40,18,6,${a})`; g.lineWidth = 0.6 + Math.random() * 1.8; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(s * 0.3, y + (Math.random() - 0.5) * 10, s * 0.7, y + (Math.random() - 0.5) * 10, s, y + (Math.random() - 0.5) * 6); g.stroke() }
}, 256, [4, 1])

/* ── 2D outlines ── */
function arcPoints(cx, cy, r, a0, a1, n = 14) { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * (i / n); p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]) } return p }

/* Wooden frame: outer rounded rectangle with the inner opening + a circular notch at every pocket */
function frameShape() {
  const ox = HX + RAIL_W, oz = HZ + RAIL_W, rr = 0.14
  const outer = new THREE.Shape()
  outer.moveTo(-ox + rr, -oz); outer.lineTo(ox - rr, -oz); outer.quadraticCurveTo(ox, -oz, ox, -oz + rr)
  outer.lineTo(ox, oz - rr); outer.quadraticCurveTo(ox, oz, ox - rr, oz)
  outer.lineTo(-ox + rr, oz); outer.quadraticCurveTo(-ox, oz, -ox, oz - rr)
  outer.lineTo(-ox, -oz + rr); outer.quadraticCurveTo(-ox, -oz, -ox + rr, -oz)
  const r = POCKET_R + 0.015
  const P = []
  const add = (a) => a.forEach(p => P.push(p))
  // opening outline, counter-clockwise; each pocket bulges outward as an arc
  add(arcPoints(-HX, -HZ, r, Math.PI / 2, Math.PI * 2, 24))     // bottom-left corner
  add(arcPoints(0, -HZ, r, Math.PI, Math.PI * 2, 18))           // bottom middle
  add(arcPoints(HX, -HZ, r, Math.PI, Math.PI * 2.5, 24))        // bottom-right corner
  add(arcPoints(HX, HZ, r, -Math.PI / 2, Math.PI, 24))          // top-right corner
  add(arcPoints(0, HZ, r, 0, Math.PI, 18))                      // top middle
  add(arcPoints(-HX, HZ, r, 0, Math.PI * 1.5, 24))              // top-left corner
  const hole = new THREE.Path(P.map(([x, y]) => new THREE.Vector2(x, y)))
  outer.holes.push(hole)
  return outer
}

/* Cloth: the opening minus the pocket discs (concave quarter / half circles) */
function clothShape() {
  const r = POCKET_R - 0.01
  const P = []
  const add = (a) => a.forEach(p => P.push(p))
  add(arcPoints(-HX, -HZ, r, Math.PI / 2, 0, 12))
  add(arcPoints(0, -HZ, r, Math.PI, 0, 14))
  add(arcPoints(HX, -HZ, r, Math.PI, Math.PI / 2, 12))
  add(arcPoints(HX, HZ, r, -Math.PI / 2, -Math.PI, 12))
  add(arcPoints(0, HZ, r, 0, -Math.PI, 14))
  add(arcPoints(-HX, HZ, r, 0, -Math.PI / 2, 12))
  return new THREE.Shape(P.map(([x, y]) => new THREE.Vector2(x, y)))
}

/* Cushion: sloped profile, nose at u = 0, body toward the rail; extruded along its length */
function cushionGeometry(len, H = 0.108, D = 0.135, nose = 0.062) {
  const sh = new THREE.Shape()
  sh.moveTo(0, 0); sh.lineTo(0, nose); sh.quadraticCurveTo(0.004, nose + 0.012, 0.03, nose + 0.014); sh.lineTo(D, H); sh.lineTo(D, 0); sh.lineTo(0, 0)
  const g = new THREE.ExtrudeGeometry(sh, { depth: len, bevelEnabled: false, steps: 1 })
  g.translate(0, 0, -len / 2)
  return g
}

const SnookerTable = React.memo(({ felt = '#1a6b3c', cushionColor, showMarkings = true }) => {
  const m = useMemo(() => {
    const ft = clothTexture(), wt = woodTexture()
    const cush = cushionColor || new THREE.Color(felt).offsetHSL(0, 0, 0.025).getStyle()
    return {
      cloth: new THREE.MeshStandardMaterial({ color: felt, map: ft, roughness: 0.96, metalness: 0 }),
      cushion: new THREE.MeshStandardMaterial({ color: cush, map: ft, roughness: 0.85, metalness: 0 }),
      veneer: new THREE.MeshStandardMaterial({ color: '#5a2f18', map: wt, roughness: 0.28, metalness: 0.12, envMapIntensity: 1.1 }),
      wood: new THREE.MeshStandardMaterial({ color: '#3b2012', roughness: 0.4, metalness: 0.1 }),
      leg: new THREE.MeshStandardMaterial({ color: '#4e2c18', map: wt, roughness: 0.32, metalness: 0.12, emissive: '#1a0e08', emissiveIntensity: 0.35 }),
      gold: new THREE.MeshStandardMaterial({ color: '#D68454', roughness: 0.25, metalness: 0.9 }),
      pearl: new THREE.MeshStandardMaterial({ color: '#F4EBD6', roughness: 0.25, metalness: 0.2, emissive: '#6a6250', emissiveIntensity: 0.25 }),
      cup: new THREE.MeshStandardMaterial({ color: '#1a0f09', roughness: 0.9, side: THREE.DoubleSide }),
      hole: new THREE.MeshBasicMaterial({ color: '#030303' }),
      line: new THREE.MeshBasicMaterial({ color: '#e9efe4', transparent: true, opacity: 0.55, depthWrite: false }),
    }
  }, [felt, cushionColor])

  const geo = useMemo(() => {
    const frame = new THREE.ExtrudeGeometry(frameShape(), { depth: RAIL_H - 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.022, bevelOffset: -0.022, bevelSegments: 4, curveSegments: 20 })
    frame.rotateX(-Math.PI / 2)
    frame.translate(0, 0.02, 0)
    const cloth = new THREE.ShapeGeometry(clothShape(), 24); cloth.rotateX(-Math.PI / 2)
    // UVs are in scene units → tile the cloth texture every ~0.5 units
    const uv = cloth.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.42, uv.getY(i) * 0.42)
    return { frame, cloth, sideC: cushionGeometry(2 * SIDE_END), longC: cushionGeometry(LONG_MAX - LONG_MIN) }
  }, [])

  const diamonds = useMemo(() => {
    const d = []
    ;[0.85, 1.7, 2.55].forEach(x => [-1, 1].forEach(sx => [-1, 1].forEach(sz => d.push({ p: [sx * x, RAIL_H + 0.004, sz * (HZ + RAIL_W * 0.55)], r: 0 }))))
    ;[-0.875, 0, 0.875].forEach(z => [-1, 1].forEach(sx => d.push({ p: [sx * (HX + RAIL_W * 0.55), RAIL_H + 0.004, z], r: 0 })))
    return d
  }, [])

  const spots = [[0, 0], [-1.7, 0], [-1.7, -0.35], [-1.7, 0.35], [1.1, 0], [2.4, 0]]
  const jaws = []
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { jaws.push([sx * NOSE_X, sz * SIDE_END]); jaws.push([sx * LONG_MAX, sz * NOSE_Z]); jaws.push([sx * LONG_MIN, sz * NOSE_Z]) }

  return (
    <group>
      {/* cloth with real pocket openings */}
      <mesh geometry={geo.cloth} material={m.cloth} position-y={CLOTH_Y} receiveShadow />
      {/* slate/bed + underside */}
      <mesh position={[0, CLOTH_Y - 0.06, 0]} material={m.wood} receiveShadow><boxGeometry args={[TABLE_W + RAIL_W * 2, 0.1, TABLE_L + RAIL_W * 2]} /></mesh>

      {/* table markings: baulk line, D and spots */}
      {showMarkings && (
        <group position-y={CLOTH_Y + 0.002}>
          <mesh rotation-x={-Math.PI / 2} position={[-1.7, 0, 0]} material={m.line}><planeGeometry args={[0.008, NOSE_Z * 2 - 0.1]} /></mesh>
          <mesh rotation-x={-Math.PI / 2} position={[-1.7, 0, 0]} material={m.line}><ringGeometry args={[0.346, 0.354, 48, 1, Math.PI / 2, Math.PI]} /></mesh>
          {spots.map(([x, z], i) => <mesh key={i} rotation-x={-Math.PI / 2} position={[x, 0, z]} material={m.line}><circleGeometry args={[0.012, 12]} /></mesh>)}
        </group>
      )}

      {/* wooden frame with carved pocket notches (veneer top, solid sides) */}
      <mesh geometry={geo.frame} material={[m.veneer, m.wood]} castShadow receiveShadow />
      {/* gold inlay line around the top of the frame */}
      {[[0, HZ + RAIL_W * 0.86, TABLE_W + RAIL_W * 1.45, 0.012], [0, -(HZ + RAIL_W * 0.86), TABLE_W + RAIL_W * 1.45, 0.012]].map(([x, z, w, d], i) => (
        <mesh key={'gi' + i} position={[x, RAIL_H + 0.0, z]} material={m.gold}><boxGeometry args={[w, 0.006, d]} /></mesh>
      ))}
      {[1, -1].map(s => <mesh key={'gs' + s} position={[s * (HX + RAIL_W * 0.86), RAIL_H + 0.0, 0]} material={m.gold}><boxGeometry args={[0.012, 0.006, TABLE_L + RAIL_W * 1.45]} /></mesh>)}
      {diamonds.map((d, i) => <mesh key={'d' + i} position={d.p} rotation-y={Math.PI / 4} material={m.pearl}><boxGeometry args={[0.05, 0.008, 0.05]} /></mesh>)}

      {/* cushions: angled profile, nose at the playing face */}
      {[-1, 1].map(s => (
        <mesh key={'sc' + s} geometry={geo.sideC} material={m.cushion} castShadow position={[s * NOSE_X, CLOTH_Y, 0]} rotation-y={s === 1 ? 0 : Math.PI} />
      ))}
      {[-1, 1].map(sz => [-1, 1].map(sx => (
        <mesh key={`lc${sx}${sz}`} geometry={geo.longC} material={m.cushion} castShadow
          position={[sx * (LONG_MIN + LONG_MAX) / 2, CLOTH_Y, sz * NOSE_Z]} rotation-y={sz === 1 ? -Math.PI / 2 : Math.PI / 2} />
      )))}
      {/* rounded cushion ends (pocket jaws) */}
      {jaws.map(([x, z], i) => <mesh key={'j' + i} position={[x, CLOTH_Y + 0.054, z]} material={m.cushion}><cylinderGeometry args={[0.036, 0.036, 0.108, 12]} /></mesh>)}

      {/* pockets: cup, dark opening, brass collar */}
      {POCKET_CENTERS.map(([x, z], i) => (
        <group key={'p' + i} position={[x, CLOTH_Y, z]}>
          <mesh position-y={-0.2} material={m.cup}><cylinderGeometry args={[POCKET_R - 0.01, POCKET_R * 0.8, 0.4, 24, 1, true]} /></mesh>
          <mesh rotation-x={-Math.PI / 2} position-y={-0.38} material={m.hole}><circleGeometry args={[POCKET_R, 24]} /></mesh>
          <mesh rotation-x={-Math.PI / 2} position-y={RAIL_H - 0.035} material={m.gold}><torusGeometry args={[POCKET_R + 0.01, 0.012, 8, 32]} /></mesh>
        </group>
      ))}

      {/* skirt / apron */}
      {[[0, HZ + RAIL_W - 0.01, TABLE_W + RAIL_W * 2, 0.02], [0, -(HZ + RAIL_W - 0.01), TABLE_W + RAIL_W * 2, 0.02]].map(([x, z, w, d], i) => (
        <mesh key={'sk' + i} position={[x, CLOTH_Y - 0.13, z]} material={m.veneer}><boxGeometry args={[w, 0.22, d]} /></mesh>
      ))}
      {[1, -1].map(s => <mesh key={'ss' + s} position={[s * (HX + RAIL_W - 0.01), CLOTH_Y - 0.13, 0]} material={m.veneer}><boxGeometry args={[0.02, 0.22, TABLE_L + RAIL_W * 2]} /></mesh>)}

      {/* turned legs with gold collars */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1]].map(([sx, sz], i) => (
        <group key={'l' + i} position={[sx * (HX - 0.05) + (sx === 0 ? 0 : 0), CLOTH_Y - 0.22, sz * (HZ + 0.05)]}>
          <mesh position={[0, -LEG_H / 2 + 0.1, 0]} material={m.leg} castShadow><cylinderGeometry args={[0.075, 0.095, LEG_H, 18]} /></mesh>
          <mesh position={[0, 0.02, 0]} material={m.leg}><boxGeometry args={[0.22, 0.2, 0.22]} /></mesh>
          <mesh position={[0, -0.08, 0]} material={m.gold}><cylinderGeometry args={[0.105, 0.085, 0.07, 18]} /></mesh>
          <mesh position={[0, -LEG_H * 0.45, 0]} material={m.gold}><torusGeometry args={[0.088, 0.014, 8, 18]} /></mesh>
          <mesh position={[0, -LEG_H + 0.07, 0]} material={m.gold}><cylinderGeometry args={[0.11, 0.12, 0.05, 18]} /></mesh>
        </group>
      ))}
    </group>
  )
})

SnookerTable.displayName = 'SnookerTable'

export default SnookerTable
export { TABLE_W, TABLE_L, CLOTH_Y, POCKET_R, pocketPositions }
