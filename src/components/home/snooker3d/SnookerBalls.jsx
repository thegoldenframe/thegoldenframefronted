import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { TABLE_W, CLOTH_Y } from './SnookerTable'
import { BALL_R, CUE_START, CONTACT_P, shot, tracker } from './shotModel'
import { createWorld, launch, advance } from './physics'
import { audio } from '../../../utils/ambientAudio'

/* ── Snooker ball colours ── */
const BALL_COLORS = {
  white:  '#F5F5F0',
  red:    '#CC1122',
  yellow: '#E8D44D',
  green:  '#2B8C4E',
  brown:  '#8B4513',
  blue:   '#2255AA',
  pink:   '#E8829A',
  black:  '#111111',
}

/* ── Standard positions (x/z on the cloth) ── */
function getInitialPositions() {
  const balls = []
  const playW = TABLE_W / 2 - 0.3

  balls.push({ id: 'cue', color: BALL_COLORS.white, x: CUE_START.x, z: CUE_START.z })
  balls.push({ id: 'yellow', color: BALL_COLORS.yellow, x: -playW + 1.4, z: -0.35 })
  balls.push({ id: 'green',  color: BALL_COLORS.green,  x: -playW + 1.4, z: 0.35 })
  balls.push({ id: 'brown',  color: BALL_COLORS.brown,  x: -playW + 1.4, z: 0 })
  balls.push({ id: 'blue',   color: BALL_COLORS.blue,   x: 0, z: 0 })
  balls.push({ id: 'pink',   color: BALL_COLORS.pink,   x: playW - 2.0, z: 0 })
  balls.push({ id: 'black',  color: BALL_COLORS.black,  x: playW - 0.7, z: 0 })

  // 15 reds in a triangle behind the pink
  const triX = playW - 1.65
  const spacing = BALL_R * 2.08
  let idx = 0
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      balls.push({
        id: `red${idx}`, color: BALL_COLORS.red,
        x: triX + row * spacing * 0.866, z: (col - row / 2) * spacing,
      })
      idx++
    }
  }
  return balls
}

/* Glossy phenolic-resin look */
function makeBallMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.12,
    metalness: 0.0,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.3,
  })
}

const ballGeom = new THREE.SphereGeometry(BALL_R, 40, 28)

/* Glowing ribbon that follows the cue ball across the cloth */
const TRAIL_N = 150
function makeTrail() {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL_N * 2 * 3), 3))
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(TRAIL_N * 2 * 3), 3))
  const idx = []
  for (let i = 0; i < TRAIL_N - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) }
  g.setIndex(idx); g.setDrawRange(0, 0)
  return g
}
const TRAIL_RGB = [1.0, 0.56, 0.30]   // bright copper
const easeOutBack = (x) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2) }

/* ── All balls: one physics world, one frame loop ── */
const SnookerBalls = React.memo(({ animPhase, animProgress }) => {
  const data = useMemo(() => getInitialPositions(), [])
  const materials = useMemo(() => data.map(d => makeBallMaterial(d.color)), [data])
  const meshes = useRef([])
  const sim = useRef(null)
  if (!sim.current) {
    sim.current = {
      world: createWorld(data), last: 'idle', fired: false, resetT: 0,
      pop: data.map(() => false), px: data.map(d => d.x), pz: data.map(d => d.z),
    }
  }
  const trailGeom = useMemo(() => makeTrail(), [])
  const trailMat = useMemo(() => new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }), [])
  const trail = useRef({ pts: [], fade: 1, rest: 0 })
  const tmpQ = useMemo(() => new THREE.Quaternion(), [])
  const tmpAxis = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    const s = sim.current
    const phase = animPhase.current
    const dt = Math.min(delta, 0.05)

    /* ── phase transitions ── */
    if (phase !== s.last) {
      if (phase === 'reset') {
        // Re-rack: anything that moved or was potted is placed back and eased in
        s.pop = data.map((d, i) => {
          const b = s.world.balls[i]
          return b.gone || b.sunk > 0 || Math.hypot(b.x - d.x, b.z - d.z) > 0.01
        })
        s.world = createWorld(data)
        s.resetT = 0
        s.px = data.map(d => d.x); s.pz = data.map(d => d.z)
        meshes.current.forEach(m => m && m.quaternion.identity())
        tracker.fired = false
        trail.current.pts.length = 0; trail.current.fade = 1; trail.current.rest = 0; trailGeom.setDrawRange(0, 0)
      }
      if (phase === 'idle') s.fired = false
      s.last = phase
    }

    /* ── the shot: launched exactly when the cue tip reaches the ball ── */
    if (phase === 'strike' && !s.fired && animProgress.current >= CONTACT_P) {
      s.fired = true
      tracker.fired = true
      launch(s.world, 'cue', shot.dir.x, shot.dir.z, shot.power)
      audio.tock()
    }
    if (s.fired && phase !== 'reset' && phase !== 'idle') {
      advance(s.world, dt)
      // physics events → sound, then clear so the list never grows
      for (const e of s.world.events) {
        if (e.type === 'ball') audio.clack(e.speed)
        else if (e.type === 'cushion') audio.cushion(e.speed)
        else if (e.type === 'pocket') audio.pocket()
      }
      s.world.events.length = 0
    }
    if (phase === 'reset') s.resetT += dt

    /* ── update meshes ── */
    let mx = 0, mz = 0, mc = 0
    for (let i = 0; i < data.length; i++) {
      const m = meshes.current[i]
      if (!m) continue
      const b = s.world.balls[i]
      if (b.gone) { m.visible = false; continue }
      m.visible = true

      let y = BALL_R, scale = 1
      if (b.sunk > 0) { const k = Math.min(b.sunk / 0.45, 1); y = BALL_R - k * 0.3; scale = 1 - 0.55 * k }
      if (phase === 'reset' && s.pop[i]) {
        const k = THREE.MathUtils.clamp((s.resetT - 0.35 - i * 0.035) / 0.7, 0, 1)
        scale = Math.max(0.0001, easeOutBack(k))
      }
      m.position.set(b.x, CLOTH_Y + y, b.z)
      m.scale.setScalar(scale)

      // Rolling without slipping: rotate about the axis perpendicular to travel
      const dx = b.x - s.px[i], dz = b.z - s.pz[i]
      const dist = Math.hypot(dx, dz)
      if (dist > 1e-5) {
        tmpAxis.set(dz, 0, -dx).normalize()
        tmpQ.setFromAxisAngle(tmpAxis, dist / BALL_R)
        m.quaternion.premultiply(tmpQ)
      }
      s.px[i] = b.x; s.pz[i] = b.z

      if (b.vx !== 0 || b.vz !== 0) { mx += b.x; mz += b.z; mc++ }
    }

    /* ── glowing cue-ball trail ── */
    {
      const T = trail.current, cb0 = s.world.balls[0]
      const cueMoving = cb0.vx !== 0 || cb0.vz !== 0
      if (s.fired && phase !== 'reset') {
        const last = T.pts[T.pts.length - 1]
        if (cueMoving && (!last || Math.hypot(cb0.x - last[0], cb0.z - last[1]) > 0.02)) {
          T.pts.push([cb0.x, cb0.z]); if (T.pts.length > TRAIL_N) T.pts.shift()
        }
        T.rest = cueMoving ? 0 : T.rest + dt
        T.fade = T.rest > 0.4 ? Math.max(0, 1 - (T.rest - 0.4) / 2.0) : 1
      }
      const n = T.pts.length
      if (n < 2 || T.fade <= 0) trailGeom.setDrawRange(0, 0)
      else {
        const pos = trailGeom.attributes.position.array, col = trailGeom.attributes.color.array
        for (let i = 0; i < n; i++) {
          const p = T.pts[i], q = T.pts[Math.min(i + 1, n - 1)], o = T.pts[Math.max(i - 1, 0)]
          let dx = q[0] - o[0], dz = q[1] - o[1]; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l
          const u = i / (n - 1), hw = 0.004 + 0.02 * u
          const k = Math.pow(u, 1.4) * T.fade
          pos.set([p[0] - dz * hw, CLOTH_Y + 0.008, p[1] + dx * hw], i * 6)
          pos.set([p[0] + dz * hw, CLOTH_Y + 0.008, p[1] - dx * hw], i * 6 + 3)
          for (let c = 0; c < 2; c++) { col[i * 6 + c * 3] = TRAIL_RGB[0] * k; col[i * 6 + c * 3 + 1] = TRAIL_RGB[1] * k; col[i * 6 + c * 3 + 2] = TRAIL_RGB[2] * k }
        }
        trailGeom.attributes.position.needsUpdate = true; trailGeom.attributes.color.needsUpdate = true
        trailGeom.setDrawRange(0, (n - 1) * 6)
      }
    }

    /* ── publish for camera + player ── */
    const cb = s.world.balls[0]
    tracker.cue.x = cb.x; tracker.cue.z = cb.z
    tracker.moving = mc
    if (mc > 0) { tracker.focus.x = THREE.MathUtils.lerp(tracker.focus.x, mx / mc, 0.08); tracker.focus.z = THREE.MathUtils.lerp(tracker.focus.z, mz / mc, 0.08) }
    else { tracker.focus.x = THREE.MathUtils.lerp(tracker.focus.x, 1.2, 0.03); tracker.focus.z = THREE.MathUtils.lerp(tracker.focus.z, 0, 0.03) }
  })

  return (
    <group>
      <mesh geometry={trailGeom} material={trailMat} renderOrder={2} frustumCulled={false} />
      {data.map((d, i) => (
        <mesh
          key={d.id}
          ref={el => { meshes.current[i] = el }}
          geometry={ballGeom}
          material={materials[i]}
          position={[d.x, CLOTH_Y + BALL_R, d.z]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  )
})

SnookerBalls.displayName = 'SnookerBalls'

export default SnookerBalls
export { BALL_R, getInitialPositions, BALL_COLORS }
