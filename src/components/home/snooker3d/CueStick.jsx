import React from 'react'
import * as THREE from 'three'

/* ── Cue stick dimensions ── */
const CUE_LENGTH = 3.4
const CUE_TIP_R = 0.013
const CUE_BUTT_R = 0.028

const shaftMat = new THREE.MeshStandardMaterial({
  color: '#B8860B',
  roughness: 0.3,
  metalness: 0.1,
})

const buttMat = new THREE.MeshStandardMaterial({
  color: '#2c1810',
  roughness: 0.25,
  metalness: 0.15,
})

const spliceWrapMat = new THREE.MeshStandardMaterial({
  color: '#1a0e06',
  roughness: 0.3,
  metalness: 0.2,
})

const ferruleMat = new THREE.MeshStandardMaterial({
  color: '#D68454',
  roughness: 0.2,
  metalness: 0.85,
})

const tipMat = new THREE.MeshStandardMaterial({
  color: '#3A6B96',
  roughness: 0.55,
  metalness: 0.1,
})

const gripMat = new THREE.MeshStandardMaterial({
  color: '#111111',
  roughness: 0.7,
  metalness: 0.05,
})

const CueStick = React.memo(() => {
  return (
    <group>
      {/* Main shaft — maple/ash (oriented along X-axis, thin end at +X) */}
      <mesh rotation-z={-Math.PI / 2} position-x={CUE_LENGTH * 0.15} castShadow material={shaftMat}>
        <cylinderGeometry args={[CUE_TIP_R, CUE_BUTT_R - 0.008, CUE_LENGTH * 0.7, 14]} />
      </mesh>

      {/* Splice / joint area */}
      <mesh rotation-z={-Math.PI / 2} position-x={-CUE_LENGTH * 0.2} material={spliceWrapMat}>
        <cylinderGeometry args={[CUE_BUTT_R - 0.008, CUE_BUTT_R - 0.004, CUE_LENGTH * 0.12, 14]} />
      </mesh>

      {/* Butt section — dark ebony */}
      <mesh rotation-z={-Math.PI / 2} position-x={-CUE_LENGTH * 0.38} castShadow material={buttMat}>
        <cylinderGeometry args={[CUE_BUTT_R - 0.004, CUE_BUTT_R, CUE_LENGTH * 0.24, 14]} />
      </mesh>

      {/* Grip wrap */}
      <mesh rotation-z={-Math.PI / 2} position-x={-CUE_LENGTH * 0.3} material={gripMat}>
        <cylinderGeometry args={[CUE_BUTT_R - 0.005, CUE_BUTT_R - 0.005, CUE_LENGTH * 0.12, 14]} />
      </mesh>

      {/* Ferrule — brass ring near tip */}
      <mesh rotation-z={-Math.PI / 2} position-x={CUE_LENGTH * 0.49} material={ferruleMat}>
        <cylinderGeometry args={[CUE_TIP_R, CUE_TIP_R + 0.002, 0.04, 14]} />
      </mesh>

      {/* Tip — blue chalk */}
      <mesh position-x={CUE_LENGTH * 0.51} material={tipMat}>
        <sphereGeometry args={[CUE_TIP_R, 12, 8]} />
      </mesh>

      {/* Butt cap — brass */}
      <mesh rotation-z={-Math.PI / 2} position-x={-CUE_LENGTH * 0.5} material={ferruleMat}>
        <cylinderGeometry args={[CUE_BUTT_R + 0.002, CUE_BUTT_R - 0.002, 0.02, 14]} />
      </mesh>

      {/* Joint ring (mid-cue) */}
      <mesh rotation-z={-Math.PI / 2} position-x={-CUE_LENGTH * 0.1} material={ferruleMat}>
        <cylinderGeometry args={[CUE_BUTT_R - 0.006, CUE_BUTT_R - 0.006, 0.015, 14]} />
      </mesh>
    </group>
  )
})

CueStick.displayName = 'CueStick'

export default CueStick
export { CUE_LENGTH }
