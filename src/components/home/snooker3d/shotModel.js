/* ──────────────────────────────────────────────────────────────
   Shared shot model — single source of truth for the shot timing,
   the line of the cue and the stroke kinematics. The player (cue +
   arms) and the balls (physics) both read from here so the cue tip
   touches the ball at exactly the instant the ball is launched.
────────────────────────────────────────────────────────────── */
export const BALL_R = 0.065

/* Phase durations in seconds (roll is long enough for balls to settle) */
export const DURATIONS = {
  idle:     1.6,
  chalk:    3.8,
  aim:      3.4,
  pullback: 1.3,
  strike:   0.42,
  roll:     6.0,
  reset:    2.2,
}
export const PHASE_ORDER = ['idle', 'chalk', 'aim', 'pullback', 'strike', 'roll', 'reset']

/* Cue ball start (inside the "D") and the line of the shot.
   The line threads the gap between the brown and green and clips the
   side of the red pack, like a real break-off. */
export const CUE_START = { x: -2.3, z: 0.18 }
export const BASE_AIM = 0       // radians about Y (z over x)
export const CUE_ELEVATION = (9 * Math.PI) / 180     // butt raised above the cloth

/* Stroke kinematics — gap = distance from tip to ball surface along the cue */
export const STROKE = {
  rest: 0.22,       // tip hovering before the shot
  pull: 0.46,       // maximum draw-back
  follow: 0.20,     // follow-through past the ball
  k: 2.4,           // strike acceleration curve (p^k)
}
/* Progress through the strike phase at which tip meets ball (gap = 0) */
export const CONTACT_P = Math.pow(STROKE.pull / (STROKE.pull + STROKE.follow), 1 / STROKE.k)

/* Current shot (re-rolled every cycle with tiny natural variation) */
export const shot = {
  aim: BASE_AIM,
  power: 7.0,       // cue-ball launch speed, units/s
  dir: { x: Math.cos(BASE_AIM), z: Math.sin(BASE_AIM) },
}

let seed = 1337
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)

export function prepareShot() {
  shot.aim = BASE_AIM + (rand() - 0.5) * 0.006
  shot.power = 6.6 + rand() * 0.9
  shot.dir.x = Math.cos(shot.aim)
  shot.dir.z = Math.sin(shot.aim)
}

/* ── helpers ── */
export const clamp01 = (x) => Math.min(1, Math.max(0, x))
export const smooth = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t) }
export const smoother = (x) => { const t = clamp01(x); return t * t * t * (t * (t * 6 - 15) + 10) }

/* Stance blend 0 (standing, cue held upright) → 1 (down on the shot) */
export function stanceBlend(phase, progress) {
  const t = progress * DURATIONS[phase]
  switch (phase) {
    case 'idle': return 0
    case 'chalk': return 0
    case 'aim': return smoother(t / 1.5)
    case 'pullback':
    case 'strike': return 1
    case 'roll': return 1 - smoother((t - 2.2) / 2.4)
    default: return 0
  }
}

/* Tip-to-ball gap for each phase (null = cue is not on the shot line) */
export function cueGap(phase, progress) {
  const t = progress * DURATIONS[phase]
  const { rest, pull, follow, k } = STROKE
  switch (phase) {
    case 'aim': {
      // Settle onto the bridge, then 3 smooth practice strokes of growing length
      const settle = smooth(t / 1.5)
      const w = clamp01((t - 1.5) / (DURATIONS.aim - 1.5))
      const amp = 0.07 + 0.11 * w
      const practice = amp * 0.5 * (1 - Math.cos(w * Math.PI * 2 * 3))
      return (0.55 - (0.55 - rest) * settle) + practice * (w > 0 ? 1 : 0)
    }
    case 'pullback': {
      const m = smoother(progress / 0.78)           // slow draw, short pause at the back
      return rest + (pull - rest) * m
    }
    case 'strike': return pull - (pull + follow) * Math.pow(progress, k)
    case 'roll': return -follow + (rest + follow + 0.1) * smoother((t - 0.7) / 1.6)
    default: return null
  }
}

/* Live tracking of the balls (written by SnookerBalls, read by player + camera) */
export const tracker = {
  cue: { x: CUE_START.x, z: CUE_START.z },
  focus: { x: 1.2, z: 0 },     // centroid of moving balls (or the rack when still)
  moving: 0,
  fired: false,
}

/* ── Chalking the cue ──
   Timeline (seconds): reach for the chalk on the rail → carry it to the tip → rub the tip →
   put the chalk back → blow the dust off the tip. All values are smooth 0…1 weights. */
export const CHALK_RAIL = { x: -3.52, y: 0.215, z: -0.62 }   // where the chalk sits on the rail
export function chalkState(phase, progress) {
  if (phase !== 'chalk') return null
  const t = progress * DURATIONS.chalk
  return {
    t,
    w: smooth(t / 0.7) * (1 - smooth((t - 3.2) / 0.55)),                  // overall chalking pose
    reach: smooth(t / 0.8) * (1 - smooth((t - 2.85) / 0.4)),               // left hand goes to the rail
    carry: smooth((t - 0.85) / 0.45) * (1 - smooth((t - 2.4) / 0.45)),     // 0 = rail, 1 = cue tip
    rub: clamp01((t - 1.35) / 0.2) * (1 - clamp01((t - 2.25) / 0.2)),      // rubbing the tip
    g: smooth((t - 0.8) / 0.25) * (1 - smooth((t - 2.55) / 0.3)),          // chalk follows the hand
    blow: smooth((t - 3.0) / 0.15) * (1 - smooth((t - 3.5) / 0.2)),        // blowing on the tip
  }
}
