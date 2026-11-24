/* ──────────────────────────────────────────────────────────────
   Synthesised venue ambience (no audio files needed):
   • ball / cushion / pocket sounds driven by the physics events
   • a soft cafe murmur with the odd cup clink
   Muted by default; the browser only allows audio after a click.
────────────────────────────────────────────────────────────── */
let ctx = null, master = null, noiseBuf = null, enabled = false, active = true, clinkTimer = null

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination)
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const d = noiseBuf.getChannelData(0); let last = 0
  for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5 }   // brown-ish noise
  startMurmur()
  return ctx
}

function startMurmur() {
  const mk = (freq, q, gain, lfoHz) => {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q
    const g = ctx.createGain(); g.gain.value = gain
    const lfo = ctx.createOscillator(); lfo.frequency.value = lfoHz
    const lg = ctx.createGain(); lg.gain.value = gain * 0.6
    lfo.connect(lg); lg.connect(g.gain)
    src.connect(bp); bp.connect(g); g.connect(master)
    src.start(); lfo.start()
  }
  mk(380, 0.6, 0.05, 0.13)     // low room tone
  mk(1150, 0.9, 0.022, 0.31)   // chatter
  mk(2400, 1.4, 0.008, 0.19)   // air
}

const now = () => ctx.currentTime
function env(g, t0, peak, dur) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur) }
function ok() { return ctx && enabled && active && ctx.state === 'running' }

function burst({ freq, q = 1.2, dur = 0.06, peak = 0.3, tone = 0, toneDur = 0.05, type = 'bandpass' }) {
  const t0 = now()
  const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.playbackRate.value = 1.5 + Math.random()
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q
  const g = ctx.createGain(); env(g, t0, peak, dur)
  src.connect(f); f.connect(g); g.connect(master); src.start(t0, Math.random() * 1.5, dur + 0.02)
  if (tone) {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(tone * (0.97 + Math.random() * 0.06), t0)
    const og = ctx.createGain(); env(og, t0, peak * 0.7, toneDur)
    o.connect(og); og.connect(master); o.start(t0); o.stop(t0 + toneDur + 0.02)
  }
}

function clink() {
  if (!ok()) return
  const t0 = now()
  for (const [f, p] of [[3100, 0.02], [4700, 0.012], [6200, 0.006]]) {
    const o = ctx.createOscillator(); o.frequency.value = f * (0.98 + Math.random() * 0.04)
    const g = ctx.createGain(); env(g, t0, p, 0.5)
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + 0.55)
  }
}

export const audio = {
  get enabled() { return enabled },
  async enable() {
    const c = ensure(); if (!c) return false
    if (c.state === 'suspended') await c.resume()
    enabled = true
    master.gain.cancelScheduledValues(c.currentTime); master.gain.linearRampToValueAtTime(active ? 0.9 : 0, c.currentTime + 0.6)
    if (!clinkTimer) { const loop = () => { clink(); clinkTimer = setTimeout(loop, 5000 + Math.random() * 9000) }; clinkTimer = setTimeout(loop, 3000) }
    return true
  },
  disable() {
    enabled = false
    if (ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3) }
    clearTimeout(clinkTimer); clinkTimer = null
  },
  /** pause/resume when the hero scrolls out of / into view */
  setActive(v) { active = v; if (ctx && enabled) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(v ? 0.9 : 0, ctx.currentTime + 0.4) } },
  clack(speed = 2) { if (!ok()) return; const k = Math.min(1, speed / 4.5); burst({ freq: 2600, q: 1.6, dur: 0.05, peak: 0.12 + 0.5 * k, tone: 1750, toneDur: 0.045 }) },
  tock()  { if (!ok()) return; burst({ freq: 1500, q: 1.0, dur: 0.07, peak: 0.55, tone: 900, toneDur: 0.07 }) },
  cushion(speed = 2) { if (!ok()) return; const k = Math.min(1, speed / 4); burst({ freq: 520, q: 0.8, dur: 0.09, peak: 0.08 + 0.3 * k, type: 'lowpass', tone: 190, toneDur: 0.08 }) },
  pocket() { if (!ok()) return; burst({ freq: 300, q: 0.7, dur: 0.35, peak: 0.35, type: 'lowpass', tone: 150, toneDur: 0.25 }) },
  chalk()  { if (!ok()) return; burst({ freq: 3800, q: 0.7, dur: 0.1, peak: 0.1, type: 'highpass' }) },
}
