import React, { Suspense, useRef, useCallback, useEffect, useState, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ── Lazy-loaded 3D components for code splitting ── */
import SnookerTable from './snooker3d/SnookerTable'
import SnookerBalls from './snooker3d/SnookerBalls'
import SnookerPlayer from './snooker3d/SnookerPlayer'
import SceneLighting from './snooker3d/SceneLighting'
import DustParticles from './snooker3d/DustParticles'
import CameraRig from './snooker3d/CameraRig'
import { DURATIONS, PHASE_ORDER, prepareShot } from './snooker3d/shotModel'
import { Floor, BackWall, ThemeRenderer, PALETTE } from './snooker3d/SceneEnvironment'
import { useTheme } from '../../context/ThemeContext'
import Lamp from './snooker3d/Lamp'
import { audio } from '../../utils/ambientAudio'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'

/* ── Animation controller hook ── */
function useAnimationLoop() {
  const animPhase = useRef('idle')   // idle, aim, pullback, strike, roll, reset
  const animProgress = useRef(0)
  const phaseTimer = useRef(0)

  useEffect(() => {
    prepareShot()
    let raf
    let lastTime = performance.now()

    const tick = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      phaseTimer.current += delta
      const currentDuration = DURATIONS[animPhase.current]
      animProgress.current = Math.min(phaseTimer.current / currentDuration, 1)

      if (phaseTimer.current >= currentDuration) {
        // Move to next phase
        const currentIdx = PHASE_ORDER.indexOf(animPhase.current)
        const nextIdx = (currentIdx + 1) % PHASE_ORDER.length
        animPhase.current = PHASE_ORDER[nextIdx]
        if (animPhase.current === 'idle') prepareShot()   // fresh, slightly different shot each cycle
        phaseTimer.current = 0
        animProgress.current = 0
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return { animPhase, animProgress }
}

/* ── WebGL support detection ── */
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch (e) {
    return false
  }
}

/* ── Loading fallback ── */
function LoadingFallback() {
  return (
    <div className="snooker-hero-loading">
      <div className="snooker-hero-loading-spinner" />
      <p className="snooker-hero-loading-text">Loading experience...</p>
    </div>
  )
}

/* ── WebGL not supported fallback ── */
function WebGLFallback() {
  return (
    <div className="snooker-hero-fallback">
      <div className="snooker-hero-fallback-inner">
        <div className="snooker-hero-fallback-icon">🎱</div>
        <h2 className="snooker-hero-fallback-title">THE GOLDEN FRAME</h2>
        <p className="snooker-hero-fallback-subtitle">Premier Snooker & Pool Lounge</p>
      </div>
    </div>
  )
}

/* ── 3D Scene content ── */
function SceneContent({ animPhase, animProgress, modelUrl, theme }) {
  const p = PALETTE[theme]
  return (
    <>
      <CameraRig animPhase={animPhase} animProgress={animProgress} />
      <ThemeRenderer theme={theme} />
      <SceneLighting theme={theme} />
      <Environment preset={p.envPreset} environmentIntensity={p.envIntensity} />

      <Lamp theme={theme} />
      <Floor theme={theme} />
      <BackWall theme={theme} />

      <SnookerTable />
      <SnookerBalls animPhase={animPhase} animProgress={animProgress} />
      <SnookerPlayer animPhase={animPhase} animProgress={animProgress} modelUrl={modelUrl} />
      <DustParticles opacity={p.dust} />
    </>
  )
}

/* ── Main SnookerHero component ── */
const SnookerHero = ({ modelUrl: propModelUrl }) => {
  const { theme } = useTheme()
  const [webglOk] = useState(() => isWebGLSupported())
  const { animPhase, animProgress } = useAnimationLoop()
  const [modelUrl, setModelUrl] = useState(null)
  const [soundOn, setSoundOn] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlModel = params.get('model') || params.get('modelUrl')
    setModelUrl(propModelUrl || urlModel || null)
  }, [propModelUrl])

  // ambient sound only plays while the hero is on screen
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => audio.setActive(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => { io.disconnect(); audio.disable() }
  }, [webglOk])
  const toggleSound = async () => { if (soundOn) { audio.disable(); setSoundOn(false) } else { setSoundOn(await audio.enable()) } }

  if (!webglOk) {
    return <WebGLFallback />
  }

  return (
    <div className="snooker-hero-canvas-wrapper" ref={wrapRef}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: 'high-performance',
          }}
          camera={{
            fov: 48,
            near: 0.1,
            far: 50,
            position: [2.5, 3.4, 7.2],
          }}
          style={{ background: PALETTE[theme].bg }}
        >
          <SceneContent animPhase={animPhase} animProgress={animProgress} modelUrl={modelUrl} theme={theme} />
        </Canvas>
      </Suspense>

      {/* Gradient overlay at bottom to blend into next section */}
      <div className="snooker-hero-bottom-gradient" />

      {/* Subtle vignette */}
      <div className="snooker-hero-vignette" />

      {/* Ambience on/off (muted by default) */}
      <button type="button" onClick={toggleSound} aria-pressed={soundOn} aria-label={soundOn ? 'Mute venue sound' : 'Turn on venue sound'}
        className="absolute left-4 bottom-28 lg:bottom-12 z-20 flex items-center gap-2 px-3.5 py-2.5 border border-gold/40 bg-surface/70 backdrop-blur-md text-gold font-body text-[10px] tracking-[0.2em] uppercase hover:bg-gold hover:text-black transition-all">
        {soundOn ? <FiVolume2 size={14} /> : <FiVolumeX size={14} />}
        <span>{soundOn ? 'Sound on' : 'Sound off'}</span>
      </button>
    </div>
  )
}

export default SnookerHero
