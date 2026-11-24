import React from 'react'
import { PALETTE } from './SceneEnvironment'

/* Sharper, softer shadows on desktop; lighter maps on small screens */
const SHADOW = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches ? 1024 : 2048

const SceneLighting = React.memo(({ theme = 'dark' }) => {
  const p = PALETTE[theme]
  return (
    <>
      {/* ── Ambient fill — warm, subtle ── */}
      <ambientLight color="#FFF5E0" intensity={p.ambient} />
      <hemisphereLight args={[p.hemiSky, p.hemiGround, p.hemi]} />

      {/* ── Main overhead table light — wide, warm ── */}
      <rectAreaLight
        position={[0, 3.2, 0]}
        rotation-x={-Math.PI / 2}
        width={5.5}
        height={3}
        color="#FFF5E0"
        intensity={5}
      />

      {/* ── Primary shadow-casting directional light ── */}
      <directionalLight
        position={[-4, 5, 3]}
        intensity={p.key}
        color="#FFF8E7"
        castShadow
        shadow-mapSize-width={SHADOW}
        shadow-mapSize-height={SHADOW}
        shadow-radius={3}
        shadow-normalBias={0.02}
        shadow-camera-far={20}
        shadow-camera-near={0.5}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
      />

      {/* ── Overhead lamp: warm pool of light on the cloth with soft, directional shadows ── */}
      <spotLight
        position={[0, 2.2, 0.2]}
        angle={0.85}
        penumbra={0.95}
        intensity={p.lamp}
        decay={2}
        distance={14}
        color="#FFE9BF"
        castShadow
        shadow-mapSize-width={SHADOW / 2}
        shadow-mapSize-height={SHADOW / 2}
        shadow-radius={5}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />

      {/* ── Soft front fill so the player's face and hands read clearly (no shadows) ── */}
      <pointLight position={[-3.2, 2.4, 3.8]} intensity={p.fill} distance={14} decay={2} color="#FFF1DC" />

      {/* ── Rim light from behind table — cinematic depth ── */}
      <directionalLight
        position={[5, 3, -4]}
        intensity={0.3}
        color="#D68454"
      />

      {/* ── Subtle gold-tinted fill from below ── */}
      <pointLight
        position={[0, -0.5, 0]}
        intensity={0.12}
        color="#D68454"
        distance={6}
        decay={2}
      />

      {/* ── KEY PLAYER LIGHT — bright spotlight aimed at the player ── */}
      <spotLight
        position={[-3, 4.5, 4]}
        angle={0.4}
        penumbra={0.7}
        intensity={3}
        color="#FFF5E0"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0005}
      />

      {/* ── Secondary player fill — from opposite side ── */}
      <pointLight
        position={[-4, 2, 3]}
        intensity={0.6}
        color="#FFF8E7"
        distance={8}
        decay={2}
      />

      {/* ── Ceiling spotlights (subtle visual fixtures) ── */}
      {/* Spot 1 — over player area */}
      <group position={[-2.5, 4.8, 2]}>
        {/* Fixture housing */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.15, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Warm glow disc */}
        <mesh position={[0, -0.08, 0]} rotation-x={Math.PI}>
          <circleGeometry args={[0.06, 12]} />
          <meshStandardMaterial color="#FFF5E0" emissive="#FFF5E0" emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Spot 2 — over table center */}
      <group position={[0, 4.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.15, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.08, 0]} rotation-x={Math.PI}>
          <circleGeometry args={[0.06, 12]} />
          <meshStandardMaterial color="#FFF5E0" emissive="#FFF5E0" emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Spot 3 — over far end of table */}
      <group position={[2.5, 4.8, -1.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.15, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.08, 0]} rotation-x={Math.PI}>
          <circleGeometry args={[0.06, 12]} />
          <meshStandardMaterial color="#FFF5E0" emissive="#FFF5E0" emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* ── Low-profile overhead lamp (replaces the large yellow rings) ── */}
      {/* A dark rectangular shade — classic snooker table lamp look */}
      <group position={[0, 3.5, 0]}>
        {/* Long rectangular shade */}
        <mesh>
          <boxGeometry args={[4, 0.12, 1.8]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Inner glow surface */}
        <mesh position={[0, -0.06, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[3.8, 1.6]} />
          <meshStandardMaterial
            color="#FFF5E0"
            emissive="#FFF5E0"
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
          />
        </mesh>
        {/* Support rods to ceiling */}
        {[[-1.5, 0], [1.5, 0]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.9, z]}>
            <cylinderGeometry args={[0.01, 0.01, 1.7, 6]} />
            <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.5} />
          </mesh>
        ))}
      </group>
    </>
  )
})

SceneLighting.displayName = 'SceneLighting'

export default SceneLighting
