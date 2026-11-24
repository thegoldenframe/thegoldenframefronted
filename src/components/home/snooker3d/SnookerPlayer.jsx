import React, { useRef, useMemo, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { useFrame, createPortal } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import CueStick, { CUE_LENGTH } from './CueStick'
import { Head, Hand, mats } from './PlayerParts'
import { CLOTH_Y } from './SnookerTable'
import { BALL_R, CUE_START, CUE_ELEVATION, STROKE, CONTACT_P, shot, tracker, stanceBlend, cueGap, smooth, smoother, chalkState, CHALK_RAIL } from './shotModel'
import { audio } from '../../../utils/ambientAudio'

/* ── Materials — professional snooker attire ── */
const skinMat = new THREE.MeshStandardMaterial({
  color: '#D4A574',
  roughness: 0.55,
  metalness: 0.05,
})

const vestMat = new THREE.MeshStandardMaterial({
  color: '#2a2a3e',
  roughness: 0.45,
  metalness: 0.12,
  emissive: '#0d0d18',
  emissiveIntensity: 0.4,
})

const shirtMat = new THREE.MeshStandardMaterial({
  color: '#EEEBE4',
  roughness: 0.55,
  metalness: 0.0,
  emissive: '#3a3830',
  emissiveIntensity: 0.2,
})

const pantsMat = new THREE.MeshStandardMaterial({
  color: '#1c1c28',
  roughness: 0.5,
  metalness: 0.05,
  emissive: '#0a0a12',
  emissiveIntensity: 0.3,
})

const shoeMat = new THREE.MeshStandardMaterial({
  color: '#1a140e',
  roughness: 0.22,
  metalness: 0.2,
  emissive: '#0a0806',
  emissiveIntensity: 0.25,
})

const skinMat2 = mats.skin
const hairMat = new THREE.MeshStandardMaterial({
  color: '#0e0a06',
  roughness: 0.75,
  metalness: 0.0,
})

const bowTieMat = new THREE.MeshStandardMaterial({
  color: '#0a0a0a',
  roughness: 0.4,
  metalness: 0.1,
})

const buttonMat = new THREE.MeshStandardMaterial({
  color: '#D68454',
  roughness: 0.2,
  metalness: 0.9,
})

const beltMat = new THREE.MeshStandardMaterial({
  color: '#1a1008',
  roughness: 0.3,
  metalness: 0.25,
})

/* Scale factor for procedural player */
const S = 1.7

/* ── ErrorBoundary for GLTF Loading ── */
class GLTFErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.warn("GLTF character model failed to load, falling back to procedural player:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

/* ── GLTF character loader with programmatic IK cue rigging ── */
function GLTFCharacter({ modelUrl, animPhase, animProgress }) {
  const { scene, animations } = useGLTF(modelUrl)
  const { actions } = useAnimations(animations, scene)
  const groupRef = useRef()
  const cueRef = useRef()

  // Find the hand bone to attach/track the cue stick
  const rightHandBone = useMemo(() => {
    let bone = null
    scene.traverse((child) => {
      if (child.isBone && (
        child.name.toLowerCase().includes('righthand') || 
        child.name.toLowerCase().includes('hand_r') || 
        child.name.toLowerCase().includes('hand.r') ||
        child.name.toLowerCase().includes('r_hand') ||
        child.name.toLowerCase().includes('wrist_r') ||
        child.name.toLowerCase().includes('item_r')
      )) {
        bone = child
      }
    })
    return bone
  }, [scene])

  // Find the hips or root bone to disable root motion sliding
  const hipsBone = useMemo(() => {
    let bone = null
    scene.traverse((child) => {
      if (child.isBone && (
        child.name.toLowerCase().includes('hips') ||
        child.name.toLowerCase().includes('pelvis') ||
        child.name.toLowerCase().includes('root') ||
        child.name.toLowerCase() === 'bip001'
      )) {
        bone = child
      }
    })
    return bone
  }, [scene])

  // Play animations
  useEffect(() => {
    if (actions) {
      const animNames = Object.keys(actions)
      if (animNames.length > 0) {
        actions[animNames[0]].reset().fadeIn(0.5).play()
      }
    }
    return () => {
      if (actions) {
        Object.values(actions).forEach(a => a.stop())
      }
    }
  }, [actions])

  useFrame(() => {
    if (!groupRef.current || !cueRef.current) return
    const phase = animPhase.current
    const progress = animProgress.current

    // Lock GLTF scene root position to prevent horizontal root motion sliding
    scene.position.x = 0
    scene.position.z = 0

    // Lock the hips/pelvis bone as well for sub-mesh root motion
    if (hipsBone) {
      hipsBone.position.x = 0
      hipsBone.position.z = 0
    }

    // Force update matrix to prevent lagging world positions
    groupRef.current.updateMatrixWorld(true)

    // Get hand world position (from bone or fallback)
    const handWorldPos = new THREE.Vector3()
    if (rightHandBone) {
      rightHandBone.getWorldPosition(handWorldPos)
    } else {
      scene.getWorldPosition(handWorldPos)
      handWorldPos.y += 1.0 // offset upwards if no bone
    }

    // Convert to player group local coordinates
    const localHandPos = groupRef.current.worldToLocal(handWorldPos.clone())

    if (phase === 'idle' || phase === 'reset') {
      // Cue held vertically in hand
      cueRef.current.position.copy(localHandPos)
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0, -Math.PI / 2 + 0.1))
      cueRef.current.quaternion.copy(q)
    } else {
      // Cue ball world target
      const targetWorldPos = new THREE.Vector3(-2.3, CLOTH_Y + 0.075, 0)
      const localTargetPos = groupRef.current.worldToLocal(targetWorldPos.clone())

      // Direction vector from hand to cue ball
      const dir = new THREE.Vector3().subVectors(localTargetPos, localHandPos).normalize()

      // Sliding logic for strike/pullback
      const pullbackOffset = phase === 'pullback' ? Math.sin(progress * Math.PI * 0.5) * 0.45 : 0
      const strikeOffset = phase === 'strike' ? Math.min(progress * 4, 1) * 0.55 : 0
      const rollOffset = phase === 'roll' ? THREE.MathUtils.lerp(0.55, 0.1, progress) : 0
      const slide = -0.85 - pullbackOffset + strikeOffset + (phase === 'roll' ? rollOffset : 0)

      const cuePos = new THREE.Vector3().addVectors(localHandPos, dir.clone().multiplyScalar(slide))
      cueRef.current.position.copy(cuePos)

      // Orient cue stick X-axis to point down the line of the shot
      const defaultDir = new THREE.Vector3(1, 0, 0)
      const q = new THREE.Quaternion().setFromUnitVectors(defaultDir, dir)
      cueRef.current.quaternion.copy(q)
    }
  })

  return (
    <group ref={groupRef} position={[-4.15, CLOTH_Y - 1.7, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.85}>
      <primitive object={scene} />
      <group ref={cueRef}>
        <CueStick />
      </group>
    </group>
  )
}

/* ── Procedural Player ──
   Natural snooker stance, driven by the shared shot model:
   • stance blend: standing (cue held upright) → down on the shot → standing again
   • two-bone IK keeps the back hand on the cue grip and the bridge hand on the cloth
   • the cue is placed in world space along the real line of the shot
   • head tracks the ball, legs step when the player walks in
*/
const FLOOR_Y = CLOTH_Y - 1.7
const IDLE   = { px: -4.75, pz: -0.20, psi: Math.PI / 2, ty: 1.2,  tz: 0.0,  th: 0.04, tau: 0 }
const STANCE = { px: -4.20, pz: -0.35, psi: 1.10,        ty: 1.25, tz: 0.02, th: 1.10, tau: -0.20 }
const ARM_L = 0.32                 // upper-arm and forearm length (torso-local units)
const GRIP_IDLE = 0.6              // distance from cue tip to the hand when held upright (cue rests on the floor)
const GRIP_AIM = 1.6               // distance from cue tip to the back hand on the shot
const CUE_SCALE = 0.70             // 3.4 local units → ~2.4 world units (matches the player's scale)
const TIP_OFFSET = (CUE_LENGTH * 0.51 + 0.013) * CUE_SCALE

/* Hand-local grip points: where the cue axis passes through each hand.
   Cue hand: the cue runs through the curled fingers (along hand X).
   Bridge hand: the cue rests in the V between raised thumb and index finger (along hand −Y). */
const G_CUE = new THREE.Vector3(0, -0.10, -0.027)
const G_BRIDGE = new THREE.Vector3(-0.036, -0.075, 0.032)

/* Finger poses: curls per joint (rad) [index, middle, ring, little], splay, thumb base [rx, ry, rz] + joints */
const POSE = {
  relaxed: { f: [[0.20, 0.28, 0.18], [0.26, 0.34, 0.22], [0.32, 0.40, 0.26], [0.38, 0.46, 0.30]], sp: [0.05, 0, -0.03, -0.08], tb: [0.10, 0.0, 0.45], tj: [0.15, 0.10] },
  grip:    { f: [[1.30, 1.38, 0.95], [1.38, 1.44, 1.0], [1.36, 1.42, 0.98], [1.28, 1.34, 0.9]], sp: [0, 0, 0, 0], tb: [0.55, 0.0, 0.50], tj: [0.50, 0.45] },
  pinch:   { f: [[0.85, 0.95, 0.55], [0.95, 1.05, 0.7], [1.0, 1.1, 0.75], [1.05, 1.1, 0.8]], sp: [0.02, 0, -0.03, -0.06], tb: [0.45, 0.0, 0.35], tj: [0.45, 0.4] },
  bridge:  { f: [[0.30, 0.55, 0.30], [0.62, 0.85, 0.45], [0.66, 0.90, 0.50], [0.70, 0.92, 0.52]], sp: [0.07, 0.10, -0.12, -0.28], tb: [-0.85, 0.0, 0.55], tj: [-0.25, -0.20] },
}
const _pose = { f: [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], sp: [0,0,0,0], tb: [0,0,0], tj: [0,0] }
const _poseB = { f: [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], sp: [0,0,0,0], tb: [0,0,0], tj: [0,0] }
function blendPose(a, b, t, out = _pose) {
  for (let i = 0; i < 4; i++) { for (let j = 0; j < 3; j++) out.f[i][j] = a.f[i][j] + (b.f[i][j] - a.f[i][j]) * t; out.sp[i] = a.sp[i] + (b.sp[i] - a.sp[i]) * t }
  for (let i = 0; i < 3; i++) out.tb[i] = a.tb[i] + (b.tb[i] - a.tb[i]) * t
  for (let i = 0; i < 2; i++) out.tj[i] = a.tj[i] + (b.tj[i] - a.tj[i]) * t
  return out
}
const CHALK_GRIP = new THREE.Vector3(0, -0.075, -0.025)   // where the chalk sits in the left palm (hand-local)
const PUFF_N = 48
function applyHandPose(api, side, pose, k) {
  if (!api) return
  for (let i = 0; i < 4; i++) {
    const g = api.fingers[i]; if (!g[0] || !g[1] || !g[2]) return
    g[0].rotation.x = lerp(g[0].rotation.x, pose.f[i][0], k)
    g[1].rotation.x = lerp(g[1].rotation.x, pose.f[i][1], k)
    g[2].rotation.x = lerp(g[2].rotation.x, pose.f[i][2], k)
    g[0].rotation.z = lerp(g[0].rotation.z, pose.sp[i] * side, k)
  }
  const th = api.thumb; if (!th[0] || !th[1] || !th[2]) return
  th[0].rotation.x = lerp(th[0].rotation.x, pose.tb[0], k)
  th[0].rotation.y = lerp(th[0].rotation.y, pose.tb[1] * side, k)
  th[0].rotation.z = lerp(th[0].rotation.z, pose.tb[2] * side, k)
  th[1].rotation.x = lerp(th[1].rotation.x, pose.tj[0], k)
  th[2].rotation.x = lerp(th[2].rotation.x, pose.tj[1], k)
}

const AXIS_X = new THREE.Vector3(1, 0, 0)
const AXIS_Y = new THREE.Vector3(0, 1, 0)
const _qRub = new THREE.Quaternion()
const AXIS_NEG_Y = new THREE.Vector3(0, -1, 0)
const lerp = THREE.MathUtils.lerp

/* Two-bone IK. Works in torso-local space; upper/lower hang along -Y at rest. */
const _s = new THREE.Vector3(), _t = new THREE.Vector3(), _u = new THREE.Vector3(), _p = new THREE.Vector3()
const _e = new THREE.Vector3(), _h = new THREE.Vector3(), _d1 = new THREE.Vector3(), _d2 = new THREE.Vector3()
const _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _qt = new THREE.Quaternion()
function solveArm(upper, lower, torso, targetW, poleW, torsoQInv, k) {
  _s.copy(upper.position)
  _t.copy(targetW); torso.worldToLocal(_t)
  _u.subVectors(_t, _s)
  const dist = Math.max(_u.length(), 1e-4)
  _u.divideScalar(dist)
  const d = THREE.MathUtils.clamp(dist, 0.1, ARM_L * 2 * 0.995)
  _p.copy(poleW).applyQuaternion(torsoQInv)
  _p.addScaledVector(_u, -_p.dot(_u))
  if (_p.lengthSq() < 1e-6) _p.set(0, 0, -1)
  _p.normalize()
  const cosA = THREE.MathUtils.clamp((ARM_L * ARM_L + d * d - ARM_L * ARM_L) / (2 * ARM_L * d), -1, 1)
  const sinA = Math.sqrt(1 - cosA * cosA)
  _e.copy(_s).addScaledVector(_u, ARM_L * cosA).addScaledVector(_p, ARM_L * sinA)
  _h.copy(_s).addScaledVector(_u, d)
  _d1.subVectors(_e, _s).normalize()
  _d2.subVectors(_h, _e).normalize()
  _q1.setFromUnitVectors(AXIS_NEG_Y, _d1)
  _q2.setFromUnitVectors(AXIS_NEG_Y, _d2)
  _qt.copy(_q1).invert().multiply(_q2)
  upper.quaternion.slerp(_q1, k)
  lower.quaternion.slerp(_qt, k)
}

/* Shoulder cap, upper arm, elbow, rolled forearm sleeve with cuff, wrist and hand */
const ArmRig = ({ side, px, upperRef, lowerRef, handRef, handApi }) => (
  <group ref={upperRef} position={[px, 0.42, 0]}>
    <mesh material={vestMat} position={[0, 0.012, 0]} castShadow><sphereGeometry args={[0.064, 16, 12]} /></mesh>
    <mesh position={[0, -0.15, 0]} material={shirtMat} castShadow><capsuleGeometry args={[0.05, 0.19, 8, 14]} /></mesh>
    <mesh position={[0, -0.32, 0]} material={shirtMat}><sphereGeometry args={[0.046, 14, 10]} /></mesh>
    <group ref={lowerRef} position={[0, -0.32, 0]}>
      <mesh position={[0, -0.125, 0]} material={shirtMat} castShadow><capsuleGeometry args={[0.042, 0.17, 8, 14]} /></mesh>
      <mesh position={[0, -0.248, 0]} material={shirtMat}><cylinderGeometry args={[0.047, 0.041, 0.034, 16]} /></mesh>
      <mesh position={[side * 0.0, -0.248, 0.043]} material={buttonMat}><sphereGeometry args={[0.006, 8, 6]} /></mesh>
      <mesh position={[0, -0.285, 0]} material={skinMat2}><cylinderGeometry args={[0.027, 0.034, 0.05, 14]} /></mesh>
      <group ref={handRef} position={[0, -0.32, 0]} rotation-y={side * -Math.PI / 2}>
        <Hand side={side} api={handApi} />
      </group>
    </group>
  </group>
)

const ProceduralPlayer = React.memo(({ animPhase, animProgress, isPlaceholder }) => {
  const groupRef = useRef()
  const torsoRef = useRef()
  const headRef = useRef()
  const bridgeUpperRef = useRef()   // anatomical LEFT arm  (local +X) — forms the bridge
  const bridgeLowerRef = useRef()
  const cueUpperRef = useRef()      // anatomical RIGHT arm (local -X) — grips the cue
  const cueLowerRef = useRef()
  const cueRef = useRef()
  const cueHandRef = useRef(), bridgeHandRef = useRef()
  const cueHandApi = useRef(null), bridgeHandApi = useRef(null)
  const eyesRef = useRef([])
  const chalkRef = useRef(), puffRef = useRef()
  const puff = useMemo(() => ({ pos: new Float32Array(PUFF_N * 3), col: new Float32Array(PUFF_N * 3), vel: new Float32Array(PUFF_N * 3), life: new Float32Array(PUFF_N), head: 0, blowAcc: 0, lastBlow: 0 }), [])
  const rightLegRef = useRef()
  const leftLegRef = useRef()

  const memo = useMemo(() => ({
    prev: new THREE.Vector2(IDLE.px, IDLE.pz), sway: 0,
    shR: new THREE.Vector3(), shL: new THREE.Vector3(),
    tipI: new THREE.Vector3(), tipA: new THREE.Vector3(), tip: new THREE.Vector3(),
    dirI: new THREE.Vector3(), dirA: new THREE.Vector3(), dir: new THREE.Vector3(),
    hand: new THREE.Vector3(), bridge: new THREE.Vector3(), bridgeI: new THREE.Vector3(), bridgeA: new THREE.Vector3(),
    hI: new THREE.Vector3(), ball: new THREE.Vector3(), look: new THREE.Vector3(),
    poleR: new THREE.Vector3(-0.3, -1, 0.5), poleL: new THREE.Vector3(0.0, -0.45, -1),
    wrist: new THREE.Vector3(), off: new THREE.Vector3(), elb: new THREE.Vector3(), wr: new THREE.Vector3(), fv: new THREE.Vector3(), fp: new THREE.Vector3(),
    tipC: new THREE.Vector3(), dirC: new THREE.Vector3(), fwdV: new THREE.Vector3(), leftV: new THREE.Vector3(), ca: new THREE.Vector3(), cb: new THREE.Vector3(), chalkP: new THREE.Vector3(), chalkRail: new THREE.Vector3(CHALK_RAIL.x, CHALK_RAIL.y, CHALK_RAIL.z),
    nPref: new THREE.Vector3(), bx: new THREE.Vector3(), by: new THREE.Vector3(), bz: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0),
    lq: new THREE.Quaternion(), lqi: new THREE.Quaternion(), qa: new THREE.Quaternion(), qb: new THREE.Quaternion(), qr: new THREE.Quaternion(), mat: new THREE.Matrix4(),
    cueHandQ: new THREE.Quaternion(), bridgeHandQ: new THREE.Quaternion(), restR: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2), restL: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2),
    torsoQ: new THREE.Quaternion(), headPrev: new THREE.Quaternion(), headTarget: new THREE.Quaternion(),
  }), [])

  useFrame((state, delta) => {
    const g = groupRef.current, torso = torsoRef.current, head = headRef.current, cue = cueRef.current
    if (!g || !torso || !head || !cue) return
    const dt = Math.min(delta, 0.05)
    const phase = animPhase.current, p = animProgress.current, t = state.clock.elapsedTime
    const b = stanceBlend(phase, p)            // 0 standing … 1 down on the shot
    const cs = chalkState(phase, p)            // chalking weights (null outside the chalk phase)
    const bb = b + (cs ? 0.30 * cs.w : 0)      // body posture also leans in to reach the chalk
    const breathe = Math.sin(t * 1.6) * 0.012 * (1 - b * 0.8)

    /* ── 1. body placement & posture ── */
    const px = lerp(IDLE.px, STANCE.px, bb), pz = lerp(IDLE.pz, STANCE.pz, bb)
    g.position.set(px, FLOOR_Y, pz)
    g.rotation.y = lerp(IDLE.psi, STANCE.psi, bb) + Math.sin(t * 0.5) * 0.015 * (1 - bb)
    const ty = lerp(IDLE.ty, STANCE.ty, bb) + breathe * 0.5
    torso.position.set(0, ty, lerp(IDLE.tz, STANCE.tz, bb))
    // tiny weight-shift into the ball as the cue accelerates
    const push = phase === 'strike' ? 0.03 * smooth(p / CONTACT_P) : 0
    torso.rotation.set(lerp(IDLE.th, STANCE.th, bb) + breathe + push, lerp(IDLE.tau, STANCE.tau, bb) + Math.sin(t * 0.7) * 0.01 * (1 - bb), 0)

    // legs stay attached to the hips and step while the player walks in/out
    const moved = Math.hypot(px - memo.prev.x, pz - memo.prev.y) / Math.max(dt, 1e-3)
    memo.prev.set(px, pz)
    const swing = Math.sin(t * 8) * Math.min(1, moved * 1.6) * 0.38
    const hipY = ty - 0.17, legS = hipY / 1.292       // legs stretch to keep the soles on the floor
    if (rightLegRef.current) { rightLegRef.current.position.y = hipY; rightLegRef.current.scale.y = legS; rightLegRef.current.rotation.x = lerp(rightLegRef.current.rotation.x, swing - 0.10 * b, 0.35) }
    if (leftLegRef.current)  { leftLegRef.current.position.y  = hipY; leftLegRef.current.scale.y = legS; leftLegRef.current.rotation.x  = lerp(leftLegRef.current.rotation.x, -swing + 0.05 * b, 0.35) }

    g.updateMatrixWorld(true)
    cueUpperRef.current.getWorldPosition(memo.shR)
    bridgeUpperRef.current.getWorldPosition(memo.shL)

    /* ── 2. cue pose (world space) ── */
    const gap = cueGap(phase, p)
    const gp = gap === null ? STROKE.rest : gap
    memo.ball.set(CUE_START.x, CLOTH_Y + BALL_R, CUE_START.z)
    const ce = Math.cos(CUE_ELEVATION), se = Math.sin(CUE_ELEVATION)
    memo.dirA.set(ce * shot.dir.x, -se, ce * shot.dir.z)
    memo.tipA.copy(memo.ball).addScaledVector(memo.dirA, -(BALL_R + gp))

    // upright pose: held at the side like a staff
    memo.hI.copy(memo.shR).add(_t.set(0.30, -0.62, 0.20))
    memo.dirI.set(0.12, 1, 0.0).normalize()
    memo.tipI.copy(memo.hI).addScaledVector(memo.dirI, GRIP_IDLE)
    if (cs) {
      // cue raised in front of the chest so the tip can be chalked
      const sy = Math.sin(g.rotation.y), cy = Math.cos(g.rotation.y)
      memo.fwdV.set(sy, 0, cy); memo.leftV.set(cy, 0, -sy)
      memo.tipC.copy(memo.shR).addScaledVector(memo.leftV, 0.38).addScaledVector(memo.fwdV, 0.5); memo.tipC.y -= 0.10
      memo.dirC.set(0, 0.85, 0).addScaledVector(memo.fwdV, 0.5).addScaledVector(memo.leftV, 0.1).normalize()
      memo.tipI.lerp(memo.tipC, cs.w); memo.dirI.lerp(memo.dirC, cs.w).normalize()
    }

    const ec = smoother(b)
    memo.dir.copy(memo.dirI).lerp(memo.dirA, ec).normalize()
    memo.tip.copy(memo.tipI).lerp(memo.tipA, ec)
    const grip = lerp(GRIP_IDLE, GRIP_AIM, ec)
    memo.hand.copy(memo.tip).addScaledVector(memo.dir, -grip)

    cue.quaternion.setFromUnitVectors(AXIS_X, memo.dir)
    cue.position.copy(memo.tip).addScaledVector(memo.dir, -TIP_OFFSET)

    /* ── 3. bridge hand (rests on the cloth, cue slides through it) ── */
    const hx = shot.dir.x, hz = shot.dir.z
    memo.bridgeA.set(memo.ball.x - hx * 0.5, memo.ball.y + 0.5 * Math.tan(CUE_ELEVATION), memo.ball.z - hz * 0.5)   // point on the cue axis over the bridge
    memo.bridgeI.copy(memo.shL).add(_t.set(0.05, -0.88, -0.10))
    const eb = smoother((b - 0.15) / 0.85)
    memo.bridge.copy(memo.bridgeI).lerp(memo.bridgeA, eb)
    if (cs) {
      // left hand: reach the chalk → carry it to the tip → rub in small circles → put it back
      memo.off.copy(CHALK_GRIP).applyQuaternion(memo.bridgeHandQ).multiplyScalar(S)
      memo.ca.copy(memo.bridge).add(memo.off)                                  // chalk point at rest (hand hanging)
      memo.ca.lerp(memo.chalkRail, cs.reach)
      memo.ca.lerp(memo.tipC, cs.carry)
      const ang = cs.t * 13
      memo.cb.set(Math.cos(ang), 0, Math.sin(ang)).multiplyScalar(0.028 * cs.rub)
      memo.cb.applyQuaternion(_qRub.setFromUnitVectors(AXIS_Y, memo.dirC))
      memo.ca.add(memo.cb)
      memo.bridge.copy(memo.ca).sub(memo.off)
    }

    /* ── 4. arms via IK ── */
    torso.getWorldQuaternion(memo.torsoQ); memo.torsoQ.invert()
    const k = 1 - Math.exp(-dt * 18)
    // the wrist is placed so the grip point of each hand lies exactly on the cue axis
    memo.wrist.copy(memo.hand).sub(memo.off.copy(G_CUE).applyQuaternion(memo.cueHandQ).multiplyScalar(S))
    solveArm(cueUpperRef.current, cueLowerRef.current, torso, memo.wrist, memo.poleR, memo.torsoQ, k)
    memo.wrist.copy(memo.bridge).sub(memo.off.copy(G_BRIDGE).applyQuaternion(memo.bridgeHandQ).multiplyScalar(S * eb))
    solveArm(bridgeUpperRef.current, bridgeLowerRef.current, torso, memo.wrist, memo.poleL, memo.torsoQ, k)

    /* ── 4b. hand orientation + finger poses ── */
    g.updateMatrixWorld(true)
    const kh = 1 - Math.exp(-dt * 14)
    const fwdX = hx, fwdZ = hz
    memo.nPref.set(fwdX * 0.4 + fwdZ * 0.4, -0.9, fwdZ * 0.4 - fwdX * 0.4).normalize()
    // cue hand: fist axis along the cue, fingers continue the forearm
    {
      const low = cueLowerRef.current
      low.getWorldPosition(memo.elb); memo.wr.set(0, -ARM_L, 0); low.localToWorld(memo.wr)
      memo.fv.subVectors(memo.wr, memo.elb).normalize()
      memo.fp.copy(memo.fv).addScaledVector(memo.dir, -memo.fv.dot(memo.dir))
      if (memo.fp.lengthSq() < 1e-3) memo.fp.set(fwdX, -0.4, fwdZ)
      memo.fp.normalize()
      let best = null, bs = -9
      for (const sgn of [1, -1]) {
        memo.bx.copy(memo.dir).multiplyScalar(sgn); memo.by.copy(memo.fp).negate(); memo.bz.crossVectors(memo.bx, memo.by)
        const sc = -memo.bz.dot(memo.nPref)
        if (sc > bs) { bs = sc; best = [memo.bx.clone(), memo.by.clone(), memo.bz.clone()] }
      }
      memo.mat.makeBasis(best[0], best[1], best[2]); memo.qa.setFromRotationMatrix(memo.mat)
      low.getWorldQuaternion(memo.lq); memo.lqi.copy(memo.lq).invert()
      memo.qb.copy(memo.lqi).multiply(memo.qa)
      cueHandRef.current.quaternion.slerp(memo.qb, kh)
      memo.cueHandQ.copy(memo.lq).multiply(cueHandRef.current.quaternion)
      applyHandPose(cueHandApi.current, 1, POSE.grip, kh)
    }
    // bridge hand: palm on the cloth, fingers toward the ball, thumb raised to form the V
    {
      const low = bridgeLowerRef.current
      memo.by.set(-fwdX, 0, -fwdZ); memo.bz.copy(memo.up); memo.bx.crossVectors(memo.by, memo.bz)
      memo.mat.makeBasis(memo.bx, memo.by, memo.bz); memo.qa.setFromRotationMatrix(memo.mat)
      low.getWorldQuaternion(memo.lq); memo.lqi.copy(memo.lq).invert()
      memo.qr.copy(memo.lq).multiply(memo.restL)                 // relaxed: palm toward the thigh
      memo.qb.copy(memo.qr).slerp(memo.qa, eb)                   // → bridge
      memo.qb.premultiply(memo.lqi)
      bridgeHandRef.current.quaternion.slerp(memo.qb, kh)
      memo.bridgeHandQ.copy(memo.lq).multiply(bridgeHandRef.current.quaternion)
      let lp = blendPose(POSE.relaxed, POSE.bridge, eb)
      if (cs) lp = blendPose(lp, POSE.pinch, cs.g, _poseB)
      applyHandPose(bridgeHandApi.current, -1, lp, kh)
    }

    /* ── 4b2. chalk cube (on the rail, or in the left hand) + blown chalk dust ── */
    {
      const ch = chalkRef.current
      if (ch) {
        memo.chalkP.copy(memo.chalkRail)
        if (cs && cs.g > 0.001) {
          const low = bridgeLowerRef.current
          memo.wr.set(0, -ARM_L, 0); low.localToWorld(memo.wr)
          memo.off.copy(CHALK_GRIP).applyQuaternion(memo.bridgeHandQ).multiplyScalar(S)
          memo.ca.copy(memo.wr).add(memo.off)
          memo.chalkP.lerp(memo.ca, cs.g)
        }
        ch.position.copy(memo.chalkP)
        ch.rotation.y = cs && cs.g > 0.5 ? cs.t * 3 : 0.5
      }
      // sound: a short scrape when the rubbing starts, a puff when blowing
      if (cs) {
        if (cs.rub > 0.5 && !puff.rubbed) { puff.rubbed = true; audio.chalk() }
        if (cs.t < 0.2) puff.rubbed = false
      }
      const pf = puffRef.current
      if (pf) {
        const blowing = cs ? cs.blow : 0
        if (blowing > 0.3) {
          puff.blowAcc += dt * 70
          while (puff.blowAcc >= 1) {
            puff.blowAcc -= 1
            const i = puff.head++ % PUFF_N
            puff.pos[i * 3] = memo.tipC.x + (Math.random() - 0.5) * 0.04; puff.pos[i * 3 + 1] = memo.tipC.y + 0.03 + Math.random() * 0.03; puff.pos[i * 3 + 2] = memo.tipC.z + (Math.random() - 0.5) * 0.04
            puff.vel[i * 3] = memo.fwdV.x * 0.55 + (Math.random() - 0.5) * 0.2; puff.vel[i * 3 + 1] = 0.12 + Math.random() * 0.15; puff.vel[i * 3 + 2] = memo.fwdV.z * 0.55 + (Math.random() - 0.5) * 0.2
            puff.life[i] = 1
          }
        }
        for (let i = 0; i < PUFF_N; i++) {
          if (puff.life[i] > 0) {
            puff.life[i] -= dt * 1.3
            puff.pos[i * 3] += puff.vel[i * 3] * dt; puff.pos[i * 3 + 1] += puff.vel[i * 3 + 1] * dt; puff.pos[i * 3 + 2] += puff.vel[i * 3 + 2] * dt
            puff.vel[i * 3] *= 0.97; puff.vel[i * 3 + 2] *= 0.97; puff.vel[i * 3 + 1] -= 0.05 * dt
          }
          const k = Math.max(0, puff.life[i]) * 0.9
          puff.col[i * 3] = 0.55 * k; puff.col[i * 3 + 1] = 0.72 * k; puff.col[i * 3 + 2] = 1.0 * k
        }
        pf.geometry.attributes.position.needsUpdate = true; pf.geometry.attributes.color.needsUpdate = true
      }
    }

    /* ── 4c. blink ── */
    {
      const bt = t % 3.7, bt2 = (t + 1.3) % 6.1
      const blink = Math.max(bt < 0.14 ? Math.sin((bt / 0.14) * Math.PI) : 0, bt2 < 0.12 ? Math.sin((bt2 / 0.12) * Math.PI) : 0)
      const sy = 1 - 0.9 * blink
      for (const e of eyesRef.current) if (e) e.scale.y = sy
    }

    /* ── 5. head tracks the ball ── */
    if (phase === 'roll' && tracker.fired) {
      memo.look.set(lerp(tracker.cue.x, tracker.focus.x, 0.55), 0.1, lerp(tracker.cue.z, tracker.focus.z, 0.55))
    } else if (b > 0.05) {
      memo.look.set(memo.ball.x + hx * 0.5, 0.12, memo.ball.z + hz * 0.5)
    } else {
      memo.look.set(0.5 + Math.sin(t * 0.4) * 0.8, 0.3, Math.sin(t * 0.3) * 0.5)
    }
    if (cs && cs.w > 0.02) memo.look.lerp(memo.tipC, cs.w)
    memo.headPrev.copy(head.quaternion)
    head.lookAt(memo.look)
    memo.headTarget.copy(head.quaternion)
    head.quaternion.copy(memo.headPrev).slerp(memo.headTarget, 1 - Math.exp(-dt * 6))
  })

  return (
    <>
    <group
      ref={groupRef}
      position={[IDLE.px, FLOOR_Y, IDLE.pz]}
      rotation-y={IDLE.psi}
      scale={S}
      visible={!isPlaceholder}
    >
      {/* ── RIGHT LEG ── */}
      <group ref={rightLegRef} position={[0.12, 0.83, 0]}>
        <group position={[0, -0.322, 0]}>
        <mesh material={pantsMat} castShadow>
          <capsuleGeometry args={[0.072, 0.5, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.38, 0]} material={pantsMat}>
          <sphereGeometry args={[0.065, 12, 8]} />
        </mesh>
        <mesh position={[0, -0.5, 0]} material={pantsMat} castShadow>
          <capsuleGeometry args={[0.06, 0.45, 8, 16]} />
        </mesh>
        <group position={[0.03, -0.92, 0.02]}>
          <mesh material={shoeMat} castShadow>
            <boxGeometry args={[0.14, 0.07, 0.22]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} material={beltMat}>
            <boxGeometry args={[0.15, 0.02, 0.24]} />
          </mesh>
        </group>
        </group>
      </group>

      {/* ── LEFT LEG ── */}
      <group ref={leftLegRef} position={[-0.12, 0.83, 0]}>
        <group position={[0, -0.322, 0]}>
        <mesh material={pantsMat} castShadow>
          <capsuleGeometry args={[0.072, 0.5, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.38, 0]} material={pantsMat}>
          <sphereGeometry args={[0.065, 12, 8]} />
        </mesh>
        <mesh position={[0, -0.5, 0]} material={pantsMat} castShadow>
          <capsuleGeometry args={[0.06, 0.45, 8, 16]} />
        </mesh>
        <group position={[0.03, -0.92, 0.02]}>
          <mesh material={shoeMat} castShadow>
            <boxGeometry args={[0.14, 0.07, 0.22]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} material={beltMat}>
            <boxGeometry args={[0.15, 0.02, 0.24]} />
          </mesh>
        </group>
        </group>
      </group>

      {/* ── TORSO ── */}
      <group ref={torsoRef} position={[0, 1.0, 0]}>
        {/* belt, pelvis, shirt belly */}
        <mesh position={[0, -0.02, 0]} material={beltMat} castShadow><cylinderGeometry args={[0.145, 0.14, 0.06, 20]} /></mesh>
        <mesh position={[0, -0.02, 0.14]} material={buttonMat}><boxGeometry args={[0.05, 0.04, 0.01]} /></mesh>
        <mesh material={pantsMat} scale={[1.08, 1, 0.9]} castShadow><capsuleGeometry args={[0.13, 0.14, 8, 16]} /></mesh>
        <mesh position={[0, 0.17, 0]} material={shirtMat} scale={[1.05, 1, 0.85]} castShadow><capsuleGeometry args={[0.135, 0.1, 8, 16]} /></mesh>

        {/* waistcoat: broad chest tapering to the waist, shirt V, buttons, pocket welts */}
        <mesh position={[0, 0.33, 0]} material={vestMat} scale={[1.28, 1, 0.82]} castShadow><capsuleGeometry args={[0.145, 0.22, 8, 18]} /></mesh>
        <mesh position={[0, 0.40, 0.108]} material={shirtMat}><boxGeometry args={[0.07, 0.17, 0.012]} /></mesh>
        {[0.17, 0.235, 0.30].map((y, i) => (
          <mesh key={i} position={[0, y, 0.124]} material={buttonMat}><sphereGeometry args={[0.0105, 10, 8]} /></mesh>
        ))}
        {[-1, 1].map(s => <mesh key={'w' + s} position={[s * 0.1, 0.22, 0.1]} rotation-z={s * -0.12} material={beltMat}><boxGeometry args={[0.07, 0.008, 0.012]} /></mesh>)}

        {/* shoulder line, collar, bow tie */}
        <mesh position={[0, 0.45, 0]} rotation-z={Math.PI / 2} material={vestMat} castShadow><capsuleGeometry args={[0.055, 0.36, 6, 14]} /></mesh>
        <mesh position={[0, 0.52, 0]} material={shirtMat}><cylinderGeometry args={[0.075, 0.1, 0.07, 18]} /></mesh>
        <mesh position={[0.045, 0.545, 0.075]} rotation-z={0.35} material={shirtMat}><boxGeometry args={[0.05, 0.04, 0.02]} /></mesh>
        <mesh position={[-0.045, 0.545, 0.075]} rotation-z={-0.35} material={shirtMat}><boxGeometry args={[0.05, 0.04, 0.02]} /></mesh>
        <group position={[0, 0.53, 0.098]}>
          <mesh position={[0.022, 0, 0]} rotation-z={0.2} material={bowTieMat}><boxGeometry args={[0.04, 0.03, 0.014]} /></mesh>
          <mesh position={[-0.022, 0, 0]} rotation-z={-0.2} material={bowTieMat}><boxGeometry args={[0.04, 0.03, 0.014]} /></mesh>
          <mesh material={bowTieMat}><sphereGeometry args={[0.011, 8, 8]} /></mesh>
        </group>

        {/* ── HEAD ── */}
        <group position={[0, 0.68, 0]}>
          <group ref={headRef}><Head eyesRef={eyesRef} /></group>
        </group>

        {/* ── BRIDGE ARM (anatomical left, local +X) ── */}
        <ArmRig side={-1} px={0.24} upperRef={bridgeUpperRef} lowerRef={bridgeLowerRef} handRef={bridgeHandRef} handApi={bridgeHandApi} />
        {/* ── CUE ARM (anatomical right, local -X) ── */}
        <ArmRig side={1} px={-0.24} upperRef={cueUpperRef} lowerRef={cueLowerRef} handRef={cueHandRef} handApi={cueHandApi} />
      </group>

    </group>

    {/* Cue stick lives in world space (true scale) — placed by the shot model, held by both hands */}
    <group ref={cueRef} scale={CUE_SCALE} visible={!isPlaceholder}>
      <CueStick />
    </group>

    {/* Blue chalk cube: rests on the rail, picked up while chalking */}
    <group ref={chalkRef} visible={!isPlaceholder} position={[CHALK_RAIL.x, CHALK_RAIL.y, CHALK_RAIL.z]}>
      <mesh castShadow><boxGeometry args={[0.07, 0.065, 0.07]} /><meshStandardMaterial color="#2f66b3" roughness={0.9} emissive="#0e2a55" emissiveIntensity={0.35} /></mesh>
      <mesh position={[0, 0.034, 0]}><boxGeometry args={[0.06, 0.004, 0.06]} /><meshStandardMaterial color="#a9c8f0" roughness={1} emissive="#4a6a96" emissiveIntensity={0.3} /></mesh>
    </group>
    {/* Chalk dust blown off the tip */}
    <points ref={puffRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PUFF_N} array={puff.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={PUFF_N} array={puff.col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation toneMapped={false} />
    </points>
    </>
  )
})


ProceduralPlayer.displayName = 'ProceduralPlayer'

/* ── Main SnookerPlayer component ── */
const SnookerPlayer = React.memo(({ animPhase, animProgress, modelUrl }) => {
  if (modelUrl) {
    return (
      <GLTFErrorBoundary fallback={<ProceduralPlayer animPhase={animPhase} animProgress={animProgress} />}>
        <Suspense fallback={<ProceduralPlayer animPhase={animPhase} animProgress={animProgress} isPlaceholder />}>
          <GLTFCharacter modelUrl={modelUrl} animPhase={animPhase} animProgress={animProgress} />
        </Suspense>
      </GLTFErrorBoundary>
    )
  }
  return <ProceduralPlayer animPhase={animPhase} animProgress={animProgress} />
})

SnookerPlayer.displayName = 'SnookerPlayer'

export default SnookerPlayer
export { S }
