/**
 * Ambient sound engine.
 * ------------------------------------------------------------------
 * Fully procedural (WebAudio) so no media file ships with the build —
 * a low cinematic drone, a slow breathing sub, and filtered noise "air".
 * Never autoplays: the AudioContext is created on the first user gesture.
 * Swap `startAmbience` for an <audio> element later if a scored track is
 * produced for the festival — the toggle API stays identical.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let nodes: { stop: () => void } | null = null;

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext, seconds = 4) {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }
  return buf;
}

export function startAmbience() {
  const c = ensureCtx();
  if (nodes || !master) return;

  const now = c.currentTime;

  // Low drone — two detuned saws through a heavy lowpass
  const droneGain = c.createGain();
  droneGain.gain.value = 0.32;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 220;
  lp.Q.value = 0.6;
  droneGain.connect(lp).connect(master);

  const osc1 = c.createOscillator();
  osc1.type = "sawtooth";
  osc1.frequency.value = 55;
  const osc2 = c.createOscillator();
  osc2.type = "sawtooth";
  osc2.frequency.value = 55.6;
  const osc3 = c.createOscillator();
  osc3.type = "sine";
  osc3.frequency.value = 82.5;
  const o3g = c.createGain();
  o3g.gain.value = 0.25;
  osc1.connect(droneGain);
  osc2.connect(droneGain);
  osc3.connect(o3g).connect(droneGain);

  // Slow LFO breathing on the filter
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.055;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 90;
  lfo.connect(lfoGain).connect(lp.frequency);

  // Air / room tone
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c);
  noise.loop = true;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 900;
  bp.Q.value = 0.4;
  const nGain = c.createGain();
  nGain.gain.value = 0.035;
  noise.connect(bp).connect(nGain).connect(master);

  [osc1, osc2, osc3, lfo].forEach((o) => o.start(now));
  noise.start(now);

  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0.16, now + 2.4);

  nodes = {
    stop: () => {
      const t = c.currentTime;
      master!.gain.cancelScheduledValues(t);
      master!.gain.setValueAtTime(master!.gain.value, t);
      master!.gain.linearRampToValueAtTime(0, t + 0.9);
      window.setTimeout(() => {
        [osc1, osc2, osc3, lfo].forEach((o) => {
          try {
            o.stop();
          } catch {
            /* already stopped */
          }
        });
        try {
          noise.stop();
        } catch {
          /* already stopped */
        }
      }, 1100);
    },
  };
}

export function stopAmbience() {
  nodes?.stop();
  nodes = null;
}

/** Short cinematic transition impact — used sparingly on scene changes. */
export function impact(level = 1) {
  if (!ctx || !master || !nodes) return;
  const c = ctx;
  const t = c.currentTime;

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5 * level, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
  g.connect(master);

  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(32, t + 0.9);
  o.connect(g);
  o.start(t);
  o.stop(t + 1.2);

  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, 1);
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1800;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.09 * level, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  n.connect(hp).connect(ng).connect(master);
  n.start(t);
  n.stop(t + 0.6);
}

export const audioReady = () => !!nodes;
