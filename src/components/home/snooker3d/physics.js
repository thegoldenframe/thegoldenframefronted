/* ──────────────────────────────────────────────────────────────
   Lightweight 2D billiards physics (x/z plane) used by the hero.
   Fixed sub-steps, equal-mass elastic ball–ball collisions, cushion
   segments with pocket mouths, jaw knuckles, rolling friction and
   pocket capture.
────────────────────────────────────────────────────────────── */
export const R = 0.065

const E_BALL = 0.95        // ball–ball restitution
const E_CUSHION = 0.74     // cushion restitution (normal)
const T_CUSHION = 0.96     // tangential retention on cushion
const ROLL_DECEL = 0.95    // constant rolling deceleration (units/s²)
const DRAG = 0.10          // speed-proportional drag (1/s)
const STOP_SPEED = 0.03
const SUBSTEP = 1 / 240

const FACE_X = 3.25 - R    // ball-centre limit against the short cushions
const FACE_Z = 1.60 - R    // ball-centre limit against the long cushions
const SIDE_END = 1.475     // short cushion half-length
const LONG_MIN = 0.175     // long cushions start after the middle pocket
const LONG_MAX = 3.225
const HARD_X = 3.30, HARD_Z = 1.70

/* Pocket centres and capture radii */
export const POCKETS = [
  { x: -3.38, z: -1.73, r: 0.2 }, { x: 3.38, z: -1.73, r: 0.2 },
  { x: -3.38, z: 1.73, r: 0.2 },  { x: 3.38, z: 1.73, r: 0.2 },
  { x: 0, z: -1.77, r: 0.17 },    { x: 0, z: 1.77, r: 0.17 },
]
/* Cushion end "knuckles" (jaws) */
const JAWS = []
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  JAWS.push({ x: sx * 3.25, z: sz * SIDE_END })
  JAWS.push({ x: sx * LONG_MAX, z: sz * 1.60 })
  JAWS.push({ x: sx * LONG_MIN, z: sz * 1.60 })
}
const JAW_R = 0.035

export function createWorld(initial) {
  return {
    t: 0, acc: 0,
    balls: initial.map(b => ({ id: b.id, x: b.x, z: b.z, vx: 0, vz: 0, sunk: 0, gone: false, moving: false, dist: 0, hits: 0 })),
    events: [],
  }
}

export function launch(world, id, dx, dz, speed) {
  const b = world.balls.find(q => q.id === id)
  if (!b) return
  b.vx = dx * speed; b.vz = dz * speed
}

export function isSettled(world) {
  return world.balls.every(b => b.gone || b.sunk > 0 || (b.vx === 0 && b.vz === 0))
}

function collideBalls(world) {
  const bs = world.balls
  for (let i = 0; i < bs.length; i++) {
    const a = bs[i]; if (a.gone || a.sunk > 0) continue
    for (let j = i + 1; j < bs.length; j++) {
      const b = bs[j]; if (b.gone || b.sunk > 0) continue
      const dx = b.x - a.x, dz = b.z - a.z
      const d2 = dx * dx + dz * dz, min = 2 * R
      if (d2 >= min * min || d2 === 0) continue
      const d = Math.sqrt(d2), nx = dx / d, nz = dz / d
      // positional correction
      const pen = (min - d) / 2
      a.x -= nx * pen; a.z -= nz * pen; b.x += nx * pen; b.z += nz * pen
      const vn = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz
      if (vn <= 0) continue
      const j2 = ((1 + E_BALL) / 2) * vn
      a.vx -= j2 * nx; a.vz -= j2 * nz
      b.vx += j2 * nx; b.vz += j2 * nz
      world.events.push({ type: 'ball', a: a.id, b: b.id, speed: vn, t: world.t })
    }
  }
}

function reflect(b, nx, nz, world) {
  const vn = b.vx * nx + b.vz * nz
  if (vn >= 0) return
  const tx = b.vx - vn * nx, tz = b.vz - vn * nz
  b.vx = tx * T_CUSHION - E_CUSHION * vn * nx
  b.vz = tz * T_CUSHION - E_CUSHION * vn * nz
  world.events.push({ type: 'cushion', a: b.id, speed: -vn, t: world.t })
}

function collideCushions(world, b) {
  const ax = Math.abs(b.x), az = Math.abs(b.z)
  // short cushions (x faces)
  if (ax > FACE_X && az < SIDE_END) {
    const s = Math.sign(b.x); b.x = s * FACE_X; reflect(b, -s, 0, world)
  }
  // long cushions (z faces)
  if (az > FACE_Z && ax > LONG_MIN && ax < LONG_MAX) {
    const s = Math.sign(b.z); b.z = s * FACE_Z; reflect(b, 0, -s, world)
  }
  // jaw knuckles
  for (const j of JAWS) {
    const dx = b.x - j.x, dz = b.z - j.z, m = R + JAW_R, d2 = dx * dx + dz * dz
    if (d2 < m * m && d2 > 0) {
      const d = Math.sqrt(d2), nx = dx / d, nz = dz / d
      b.x = j.x + nx * m; b.z = j.z + nz * m
      reflect(b, nx, nz, world)
    }
  }
  // hard limits (wooden rails) — only reachable through a pocket mouth
  if (ax > HARD_X) { b.x = Math.sign(b.x) * HARD_X; b.vx *= -0.3 }
  if (az > HARD_Z) { b.z = Math.sign(b.z) * HARD_Z; b.vz *= -0.3 }
}

function stepOnce(world, dt) {
  world.t += dt
  for (const b of world.balls) {
    if (b.gone) continue
    if (b.sunk > 0) { b.sunk += dt; b.vx *= 0.9; b.vz *= 0.9; if (b.sunk > 0.45) b.gone = true; continue }
    const sp = Math.hypot(b.vx, b.vz)
    if (sp > 0) {
      const ns = Math.max(0, sp - (ROLL_DECEL + DRAG * sp) * dt)
      if (ns < STOP_SPEED) { b.vx = 0; b.vz = 0 } else { b.vx *= ns / sp; b.vz *= ns / sp }
      b.x += b.vx * dt; b.z += b.vz * dt
      b.dist += Math.hypot(b.vx, b.vz) * dt
    }
  }
  collideBalls(world)
  for (const b of world.balls) {
    if (b.gone || b.sunk > 0) continue
    collideCushions(world, b)
    for (let i = 0; i < POCKETS.length; i++) {
      const p = POCKETS[i]
      if (Math.hypot(b.x - p.x, b.z - p.z) < p.r) {
        b.sunk = 0.0001; world.events.push({ type: 'pocket', a: b.id, t: world.t }); break
      }
    }
  }
}

/* Advance by real time using fixed sub-steps */
export function advance(world, dt) {
  world.acc += Math.min(dt, 0.1)
  let n = 0
  while (world.acc >= SUBSTEP && n < 40) { stepOnce(world, SUBSTEP); world.acc -= SUBSTEP; n++ }
  if (n === 40) world.acc = 0
}
