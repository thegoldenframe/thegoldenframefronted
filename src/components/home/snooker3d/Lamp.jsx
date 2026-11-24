import React, { useMemo } from 'react'
import * as THREE from 'three'

/* Hanging billiard lamp with a softly glowing hood and a faint light beam over the cloth. */
const Lamp = React.memo(({ theme = 'dark' }) => {
  const light = theme === 'light'
  const mats = useMemo(() => ({
    hood: new THREE.MeshStandardMaterial({ color: light ? '#1d3a2f' : '#0f2a21', roughness: 0.35, metalness: 0.55, side: THREE.DoubleSide }),
    inner: new THREE.MeshBasicMaterial({ color: '#FFE3AE', side: THREE.BackSide, toneMapped: false }),
    glow: new THREE.MeshBasicMaterial({ color: '#FFF3D4', toneMapped: false }),
    trim: new THREE.MeshStandardMaterial({ color: '#D68454', roughness: 0.25, metalness: 0.9 }),
    rod: new THREE.MeshStandardMaterial({ color: '#8a8f8c', roughness: 0.4, metalness: 0.8 }),
    beam: new THREE.MeshBasicMaterial({ color: '#FFE0A8', transparent: true, opacity: light ? 0.035 : 0.06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
  }), [light])
  const H = 0.42
  return (
    <group position={[0, 2.35, 0.1]}>
      {/* hood */}
      <mesh material={mats.hood} scale={[3.0, 1, 1]} rotation-y={Math.PI / 4}><cylinderGeometry args={[0.5, 1.0, H, 4, 1, true]} /></mesh>
      <mesh material={mats.inner} scale={[2.94, 0.98, 0.98]} rotation-y={Math.PI / 4}><cylinderGeometry args={[0.5, 1.0, H, 4, 1, true]} /></mesh>
      {/* glowing lens */}
      <mesh material={mats.glow} position-y={-H / 2 + 0.01} rotation-x={Math.PI / 2}><planeGeometry args={[4.1, 1.38]} /></mesh>
      {/* copper trim around the bottom edge */}
      {[[0, 0.707], [0, -0.707]].map(([x, z], i) => <mesh key={'a' + i} material={mats.trim} position={[x, -H / 2, z]}><boxGeometry args={[4.26, 0.045, 0.045]} /></mesh>)}
      {[2.12, -2.12].map((x, i) => <mesh key={'b' + i} material={mats.trim} position={[x, -H / 2, 0]}><boxGeometry args={[0.045, 0.045, 1.42]} /></mesh>)}
      {/* suspension rods */}
      {[-1.3, 1.3].map((x, i) => <mesh key={'r' + i} material={mats.rod} position={[x, 2.6, 0]}><cylinderGeometry args={[0.014, 0.014, 5.2, 8]} /></mesh>)}
      {/* faint light beam */}
      <mesh material={mats.beam} position-y={-H / 2 - 1.05} scale={[2.35, 1, 0.8]} rotation-y={Math.PI / 4}><coneGeometry args={[1.0, 2.1, 4, 1, true]} /></mesh>
    </group>
  )
})
Lamp.displayName = 'Lamp'
export default Lamp
