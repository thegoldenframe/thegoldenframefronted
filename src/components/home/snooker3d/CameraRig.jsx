import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DURATIONS, smooth, tracker } from './shotModel'

/*
 * Cinematic, phase-aware camera:
 *   wide  → the full table, player in the left foreground (the original framing)
 *   shot  → a closer over-the-shoulder angle on the cue, hands and cue ball
 *   break → pulls out to follow the balls as they scatter
 * Transitions are damped so the camera never jumps. The scroll-driven glide is kept.
 */
const CameraRig = React.memo(({ animPhase, animProgress }) => {
  const wide = useMemo(() => ({ pos: new THREE.Vector3(2.5, 3.4, 7.2), look: new THREE.Vector3(-0.2, -0.2, 0.2) }), [])
  const shotCam = useMemo(() => ({ pos: new THREE.Vector3(-0.9, 2.0, 4.9), look: new THREE.Vector3(-2.9, 0.5, 0.05) }), [])
  const breakCam = useMemo(() => ({ pos: new THREE.Vector3(1.4, 3.1, 6.4) }), [])

  const w = useRef({ shot: 0, brk: 0 })
  const scrollP = useRef(0)
  const pos = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const breakLook = useMemo(() => new THREE.Vector3(), [])
  const orbitLook = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    // narrow screens: widen the field of view so the whole table + player stay in frame
    const aspect = state.size.width / Math.max(state.size.height, 1)
    const fov = THREE.MathUtils.clamp(48 * Math.pow(1.55 / aspect, 0.62), 48, 78)
    if (aspect < 1.55 && Math.abs(state.camera.fov - fov) > 0.05) { state.camera.fov = fov; state.camera.updateProjectionMatrix() }
    else if (aspect >= 1.55 && state.camera.fov !== 48) { state.camera.fov = 48; state.camera.updateProjectionMatrix() }
    const phase = animPhase ? animPhase.current : 'idle'
    const ph = animProgress ? animProgress.current * (DURATIONS[phase] || 1) : 0

    // target weights per phase
    let tShot = 0, tBreak = 0
    switch (phase) {
      case 'aim': tShot = 0.9 * smooth(ph / 2.2); break
      case 'pullback': tShot = 1; break
      case 'strike': tShot = 1; break
      case 'roll':
        tShot = 1 - smooth(ph / 0.9)
        tBreak = smooth(ph / 0.9) * (1 - smooth((ph - 3.4) / 2))
        break
      default: break
    }
    const k = 1 - Math.exp(-dt * 2.4)
    w.current.shot += (tShot - w.current.shot) * k
    w.current.brk += (tBreak - w.current.brk) * k

    // scroll-driven glide (kept from the original)
    const sp0 = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.9), 0), 1)
    scrollP.current += (sp0 - scrollP.current) * 0.08
    const sp = scrollP.current

    const orbitSpeed = 0.04, orbitRadius = 0.3
    const breathe = Math.sin(t * 0.25) * 0.08
    const ws = w.current.shot, wb = w.current.brk
    const drift = 1 - Math.min(1, ws + wb)       // idle drift fades while framing the shot

    pos.copy(wide.pos)
      .addScaledVector(pos.clone().set(0, 0, 0).add(shotCam.pos).sub(wide.pos), ws)
      .addScaledVector(pos.clone().set(0, 0, 0).add(breakCam.pos).sub(wide.pos), wb)
    breakLook.set(tracker.focus.x, 0.1, tracker.focus.z)
    look.copy(wide.look)
      .addScaledVector(shotCam.look.clone().sub(wide.look), ws)
      .addScaledVector(breakLook.clone().sub(wide.look), wb)

    // scroll-driven orbit: the camera swings around the table (towards the far end) and sinks a little
    const th = sp * 0.85, cs_ = Math.cos(th), sn_ = Math.sin(th)
    const cx = -1.2, cz = 0.2
    const rx = pos.x + Math.sin(t * orbitSpeed) * orbitRadius * drift - cx
    const rz = pos.z + Math.cos(t * orbitSpeed) * orbitRadius * 0.4 * drift - cz
    state.camera.position.set(
      cx + rx * cs_ + rz * sn_,
      (pos.y + breathe * drift) * (1 - 0.3 * sp),
      cz - rx * sn_ + rz * cs_,
    )
    look.lerp(orbitLook.set(-2.4, 0.2, 0.1), sp * 0.55)
    state.camera.lookAt(look.x + Math.sin(t * 0.05) * 0.08 * drift, look.y, look.z + Math.cos(t * 0.05) * 0.06 * drift)
  })

  return null
})

CameraRig.displayName = 'CameraRig'

export default CameraRig
