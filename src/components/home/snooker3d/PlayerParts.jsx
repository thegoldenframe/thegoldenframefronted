import React from 'react'
import * as THREE from 'three'

/* ──────────────────────────────────────────────────────────────
   Detailed body parts for the procedural pool player:
   Head (face with eyes, brows, nose, lips, ears, hair) and Hand
   (palm, 4 fingers × 3 joints, thumb × 3 joints) — all joints are
   exposed through refs so the pose can be animated per frame.
────────────────────────────────────────────────────────────── */

export const mats = {
  skin:   new THREE.MeshStandardMaterial({ color: '#C99568', roughness: 0.6, metalness: 0, emissive: '#3b1d0b', emissiveIntensity: 0.22 }),
  skinSh: new THREE.MeshStandardMaterial({ color: '#B3805A', roughness: 0.7, metalness: 0, emissive: '#2a1408', emissiveIntensity: 0.2 }),
  lip:    new THREE.MeshStandardMaterial({ color: '#A85B50', roughness: 0.45, metalness: 0, emissive: '#3a1410', emissiveIntensity: 0.2 }),
  mouth:  new THREE.MeshStandardMaterial({ color: '#4a211b', roughness: 0.8 }),
  nail:   new THREE.MeshStandardMaterial({ color: '#E3BCA3', roughness: 0.35, emissive: '#3a2418', emissiveIntensity: 0.15 }),
  sclera: new THREE.MeshStandardMaterial({ color: '#F4F0EA', roughness: 0.25, emissive: '#555048', emissiveIntensity: 0.25 }),
  iris:   new THREE.MeshStandardMaterial({ color: '#4A2C17', roughness: 0.25, metalness: 0.1 }),
  pupil:  new THREE.MeshStandardMaterial({ color: '#050403', roughness: 0.2 }),
  glint:  new THREE.MeshBasicMaterial({ color: '#ffffff' }),
  hair:   new THREE.MeshStandardMaterial({ color: '#17100B', roughness: 0.55, metalness: 0.15, emissive: '#0c0805', emissiveIntensity: 0.3 }),
  lash:   new THREE.MeshStandardMaterial({ color: '#150D08', roughness: 0.6 }),
  shirt:  new THREE.MeshStandardMaterial({ color: '#F1EEE7', roughness: 0.55, emissive: '#3a3830', emissiveIntensity: 0.2 }),
  gold:   new THREE.MeshStandardMaterial({ color: '#D68454', roughness: 0.2, metalness: 0.9 }),
}

/* ══════════════ HEAD ══════════════ */
export const Head = React.forwardRef(function Head({ eyesRef }, ref) {
  const eye = (s) => (
    <group position={[s * 0.040, 0.020, 0.088]} ref={el => { if (eyesRef) eyesRef.current[s > 0 ? 1 : 0] = el }}>
      <mesh material={mats.sclera} scale={[1, 0.82, 0.7]}><sphereGeometry args={[0.0175, 18, 14]} /></mesh>
      <mesh material={mats.iris} position={[s * 0.0008, 0, 0.0090]} scale={[1, 1, 0.5]}><sphereGeometry args={[0.0098, 16, 12]} /></mesh>
      <mesh material={mats.pupil} position={[s * 0.0008, 0, 0.0128]} scale={[1, 1, 0.4]}><sphereGeometry args={[0.0048, 12, 10]} /></mesh>
      <mesh material={mats.glint} position={[s * 0.0035 + 0.002, 0.0035, 0.0152]}><sphereGeometry args={[0.0014, 6, 6]} /></mesh>
    </group>
  )
  return (
    <group ref={ref}>
      {/* neck */}
      <mesh position={[0, -0.105, -0.004]} material={mats.skin}><cylinderGeometry args={[0.046, 0.054, 0.1, 16]} /></mesh>

      {/* cranium + face volumes */}
      <mesh position={[0, 0.012, -0.006]} material={mats.skin} scale={[0.93, 1.06, 1.0]} castShadow><sphereGeometry args={[0.112, 28, 22]} /></mesh>
      <mesh position={[0, -0.040, 0.014]} material={mats.skin} scale={[0.86, 0.92, 0.96]} castShadow><sphereGeometry args={[0.1, 24, 18]} /></mesh>
      <mesh position={[0, -0.098, 0.048]} material={mats.skin} scale={[1.05, 0.78, 0.9]}><sphereGeometry args={[0.032, 16, 12]} /></mesh>
      {/* cheekbones + soft shading under them */}
      {[-1, 1].map(s => <mesh key={s} position={[s * 0.056, -0.022, 0.066]} material={mats.skin} scale={[1, 0.8, 0.7]}><sphereGeometry args={[0.02, 14, 10]} /></mesh>)}
      {[-1, 1].map(s => <mesh key={'h' + s} position={[s * 0.07, -0.05, 0.05]} material={mats.skinSh} scale={[0.7, 1.0, 0.7]}><sphereGeometry args={[0.03, 12, 10]} /></mesh>)}
      {/* brow ridge */}
      <mesh position={[0, 0.043, 0.091]} rotation-z={Math.PI / 2} material={mats.skin} scale={[1, 1, 0.8]}><capsuleGeometry args={[0.008, 0.045, 4, 10]} /></mesh>

      {/* eyes: sockets, eyeballs, iris, pupil, lashes, brows */}
      {[-1, 1].map(s => <mesh key={'sk' + s} position={[s * 0.040, 0.020, 0.084]} material={mats.skinSh} scale={[1.1, 0.9, 0.6]}><sphereGeometry args={[0.021, 14, 10]} /></mesh>)}
      {eye(-1)}{eye(1)}
      {[-1, 1].map(s => (
        <React.Fragment key={'lash' + s}>
          <mesh position={[s * 0.040, 0.0345, 0.0955]} rotation-z={s * -0.12} material={mats.lash}><boxGeometry args={[0.036, 0.0035, 0.004]} /></mesh>
          <mesh position={[s * 0.043, 0.057, 0.0975]} rotation-z={Math.PI / 2 + s * 0.13} material={mats.hair} scale={[1, 1, 0.8]}><capsuleGeometry args={[0.0058, 0.034, 4, 8]} /></mesh>
        </React.Fragment>
      ))}
      {/* nose */}
      <mesh position={[0, 0.0, 0.1] } rotation-x={0.42} material={mats.skin}><capsuleGeometry args={[0.0085, 0.032, 6, 10]} /></mesh>
      <mesh position={[0, -0.030, 0.118]} material={mats.skin} scale={[1, 0.85, 0.95]}><sphereGeometry args={[0.0135, 14, 12]} /></mesh>
      {[-1, 1].map(s => <mesh key={'n' + s} position={[s * 0.0115, -0.033, 0.108]} material={mats.skin}><sphereGeometry args={[0.0075, 10, 8]} /></mesh>)}
      {[-1, 1].map(s => <mesh key={'nn' + s} position={[s * 0.007, -0.0405, 0.1195]} material={mats.mouth} scale={[1, 0.6, 1]}><sphereGeometry args={[0.0042, 8, 6]} /></mesh>)}
      {/* lips + mouth line */}
      <mesh position={[0, -0.0655, 0.1005]} rotation-z={Math.PI / 2} material={mats.mouth}><boxGeometry args={[0.0022, 0.037, 0.004]} /></mesh>
      <mesh position={[0, -0.0605, 0.1035]} rotation-z={Math.PI / 2} material={mats.lip} scale={[1, 1, 0.8]}><capsuleGeometry args={[0.0052, 0.028, 4, 10]} /></mesh>
      <mesh position={[0, -0.0715, 0.1015]} rotation-z={Math.PI / 2} material={mats.lip} scale={[1, 1, 0.8]}><capsuleGeometry args={[0.0062, 0.024, 4, 10]} /></mesh>
      {/* ears */}
      {[-1, 1].map(s => (
        <group key={'ear' + s} position={[s * 0.1055, -0.006, -0.004]}>
          <mesh material={mats.skin} scale={[0.38, 1, 0.7]}><sphereGeometry args={[0.032, 14, 12]} /></mesh>
          <mesh material={mats.skinSh} position={[s * 0.004, -0.002, 0.003]} scale={[0.3, 0.6, 0.45]}><sphereGeometry args={[0.03, 10, 8]} /></mesh>
        </group>
      ))}
      {/* hair: crown, back, fringe, temples, sideburns */}
      <mesh position={[0, 0.020, -0.012]} material={mats.hair} scale={[0.97, 1.05, 1.03]} castShadow><sphereGeometry args={[0.1215, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.385]} /></mesh>
      <mesh position={[0, -0.012, -0.05]} material={mats.hair} scale={[0.95, 0.95, 0.8]}><sphereGeometry args={[0.1, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.62]} /></mesh>
      <mesh position={[0, 0.082, 0.07]} rotation-x={0.5} rotation-z={Math.PI / 2} material={mats.hair}><capsuleGeometry args={[0.012, 0.13, 4, 10]} /></mesh>
      {[-1, 1].map(s => (
        <React.Fragment key={'hs' + s}>
          <mesh position={[s * 0.098, 0.045, 0.01]} material={mats.hair} scale={[0.5, 1, 1.2]}><sphereGeometry args={[0.03, 12, 10]} /></mesh>
          <mesh position={[s * 0.097, -0.005, 0.03]} material={mats.hair}><boxGeometry args={[0.006, 0.028, 0.012]} /></mesh>
        </React.Fragment>
      ))}
    </group>
  )
})

/* ══════════════ HAND ══════════════ */
/* Hand frame: wrist at origin, fingers along -Y, palm faces -Z, back of hand +Z.
   side = +1 → right hand (thumb on +X), side = -1 → left hand (thumb on -X). */
const FINGERS = [
  { x: 0.031,  y: -0.100, r: 0.0108, len: [0.041, 0.027, 0.022] },   // index
  { x: 0.0105, y: -0.104, r: 0.0113, len: [0.045, 0.030, 0.023] },   // middle
  { x: -0.0105, y: -0.101, r: 0.0106, len: [0.041, 0.028, 0.022] },  // ring
  { x: -0.0305, y: -0.095, r: 0.0094, len: [0.032, 0.021, 0.019] },  // little
]
const THUMB = { pos: [0.041, -0.034, -0.004], len: [0.040, 0.032, 0.026], r: [0.0128, 0.0118, 0.0106] }

const Seg = ({ len, r, nail }) => (
  <>
    <mesh position={[0, -len / 2, 0]} material={mats.skin} castShadow>
      <capsuleGeometry args={[r, len, 4, 10]} />
    </mesh>
    {nail && <mesh position={[0, -len * 0.62, r * 0.78]} material={mats.nail} scale={[1, 1.5, 0.28]}><sphereGeometry args={[r * 0.62, 8, 6]} /></mesh>}
  </>
)

/* api.current = { root, fingers: [[g0,g1,g2] ×4], thumb: { base, j: [g1,g2] } } */
export const Hand = ({ side = 1, api }) => {
  const reg = useRegistry(api)
  return (
    <group ref={reg.root}>
      {/* wrist + palm (ellipsoid) + thenar pad */}
      <mesh position={[0, 0.006, 0]} material={mats.skin}><cylinderGeometry args={[0.025, 0.028, 0.034, 14]} /></mesh>
      <mesh position={[0, -0.054, -0.001]} material={mats.skin} scale={[0.86, 1, 0.30]} castShadow><sphereGeometry args={[0.052, 20, 14]} /></mesh>
      <mesh position={[side * 0.030, -0.042, -0.010]} material={mats.skin} scale={[0.9, 1.2, 0.8]}><sphereGeometry args={[0.019, 12, 10]} /></mesh>
      {/* knuckle bumps on the back of the hand */}
      {FINGERS.map((f, i) => <mesh key={'k' + i} position={[f.x * side, f.y + 0.004, 0.012]} material={mats.skin}><sphereGeometry args={[0.0085, 8, 6]} /></mesh>)}

      {FINGERS.map((f, i) => (
        <group key={i} position={[f.x * side, f.y, 0.003]} ref={el => reg.finger(i, 0, el)}>
          <Seg len={f.len[0]} r={f.r} />
          <group position={[0, -f.len[0], 0]} ref={el => reg.finger(i, 1, el)}>
            <Seg len={f.len[1]} r={f.r * 0.95} />
            <group position={[0, -f.len[1], 0]} ref={el => reg.finger(i, 2, el)}>
              <Seg len={f.len[2]} r={f.r * 0.9} nail />
            </group>
          </group>
        </group>
      ))}

      <group position={[THUMB.pos[0] * side, THUMB.pos[1], THUMB.pos[2]]} ref={el => reg.thumb(0, el)}>
        <Seg len={THUMB.len[0]} r={THUMB.r[0]} />
        <group position={[0, -THUMB.len[0], 0]} ref={el => reg.thumb(1, el)}>
          <Seg len={THUMB.len[1]} r={THUMB.r[1]} />
          <group position={[0, -THUMB.len[1], 0]} ref={el => reg.thumb(2, el)}>
            <Seg len={THUMB.len[2]} r={THUMB.r[2]} nail />
          </group>
        </group>
      </group>
    </group>
  )
}

function useRegistry(api) {
  return React.useMemo(() => {
    const data = { root: null, fingers: [[], [], [], []], thumb: [] }
    api.current = data
    return {
      root: el => { data.root = el },
      finger: (i, j, el) => { data.fingers[i][j] = el },
      thumb: (j, el) => { data.thumb[j] = el },
    }
  }, [api])
}
