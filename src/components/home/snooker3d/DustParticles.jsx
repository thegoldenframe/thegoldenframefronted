import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const PARTICLE_COUNT = 120

const DustParticles = React.memo(({ opacity = 0.3 }) => {
  const pointsRef = useRef()

  const { positions, alphas, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const alphas = new Float32Array(PARTICLE_COUNT)
    const speeds = new Float32Array(PARTICLE_COUNT)
    const offsets = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12   // x spread
      positions[i * 3 + 1] = Math.random() * 5 - 1        // y (floor to above)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8    // z spread
      alphas[i] = Math.random() * 0.4 + 0.1
      speeds[i] = Math.random() * 0.15 + 0.03
      offsets[i] = Math.random() * Math.PI * 2
    }

    return { positions, alphas, speeds, offsets }
  }, [])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return geom
  }, [positions])

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#D68454',
      size: 0.025,
      transparent: true,
      opacity,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position
    const t = state.clock.elapsedTime

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      // Gentle floating motion
      posAttr.array[i3]     = positions[i3]     + Math.sin(t * speeds[i] + offsets[i]) * 0.5
      posAttr.array[i3 + 1] = positions[i3 + 1] + Math.sin(t * speeds[i] * 0.7 + offsets[i] * 2) * 0.3
      posAttr.array[i3 + 2] = positions[i3 + 2] + Math.cos(t * speeds[i] * 0.5 + offsets[i]) * 0.4
    }

    posAttr.needsUpdate = true

    // Subtle pulsing opacity
    material.opacity = opacity * (0.7 + Math.sin(t * 0.5) * 0.3)
  })

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  )
})

DustParticles.displayName = 'DustParticles'

export default DustParticles
