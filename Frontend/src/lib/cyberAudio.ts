/*
 * VYUHAM '26 — Cybernetic Web Audio Synthesizer & Procedural Score Engine
 * Zero-dependency real-time algorithmic audio synthesized entirely in code.
 */

"use client";

/* =========================================================
   CORE UI SOUND CONTROLLER
========================================================= */

class CyberAudioController {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("vyuham-audio-muted");
        this.muted = stored === "true";
      } catch {
        this.muted = false;
      }
    }
  }

  public getContext(): AudioContext | null {
    this.init();
    return this.ctx;
  }

  public init(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (this.ctx && this.ctx.state !== "closed") {
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch {
      // AudioContext unavailable
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vyuham-audio-muted", String(this.muted));
        window.dispatchEvent(
          new CustomEvent("vyuham:audio-toggle", {
            detail: { muted: this.muted },
          })
        );
      } catch {}
    }
    if (!this.muted) {
      this.playClick();
    }
    return this.muted;
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vyuham-audio-muted", String(this.muted));
      } catch {}
    }
  }

  /**
   * High-pitch futuristic micro-blip on node hover (~30ms)
   */
  public playHover() {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1180, t);
      osc.frequency.exponentialRampToValueAtTime(1420, t + 0.03);

      gain.gain.setValueAtTime(0.025, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
    } catch {}
  }

  /**
   * Resonant feedback tick on selection / click (~50ms)
   */
  public playClick() {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(480, t);
      osc.frequency.exponentialRampToValueAtTime(840, t + 0.04);

      gain.gain.setValueAtTime(0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.055);
    } catch {}
  }

  /**
   * Hydraulic whoosh when opening HUD drawer
   */
  public playExpand() {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.09);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.11);
    } catch {}
  }

  /**
   * Descending servo sound when closing drawer
   */
  public playCollapse() {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.07);

      gain.gain.setValueAtTime(0.035, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.085);
    } catch {}
  }

  /**
   * Dual frequency telemetry chirp
   */
  public playTelemetry() {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(1320, t + 0.015);

      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
    } catch {}
  }
}

export const cyberAudio = new CyberAudioController();

/* =========================================================
   PROCEDURAL CYBER SYNTH MUSIC SCORE ENGINE
   Generates frame-synchronized musical score in real time
========================================================= */

// Musical scale: Cyber D Minor & Phrygian Dominant
const NOTES = {
  D1: 36.71,
  A1: 55.00,
  D2: 73.42,
  F2: 87.31,
  G2: 98.00,
  A2: 110.00,
  Bb2: 116.54,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.00,
  A3: 220.00,
  Bb3: 233.08,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  C5: 523.25,
  D5: 587.33,
  F5: 698.46,
  A5: 880.00,
};

class CyberMusicScoreEngine {
  private isPlaying: boolean = false;
  private currentFrame: number = 0;

  // Master bus
  private masterGain: GainNode | null = null;
  private masterFilter: BiquadFilterNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  // Cinematic / theater audio bus
  private subFilter: BiquadFilterNode | null = null;
  private presenceFilter: BiquadFilterNode | null = null;
  private reverb: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private stereoDelayL: DelayNode | null = null;
  private stereoDelayR: DelayNode | null = null;
  private stereoGainL: GainNode | null = null;
  private stereoGainR: GainNode | null = null;
  private masterWidth: StereoPannerNode | null = null;
  private saturation: WaveShaperNode | null = null;

  // Drone oscillators
  private droneOscs: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];

  // Pad synth
  private padOscs: OscillatorNode[] = [];
  private padGain: GainNode | null = null;

  // Clocked Arpeggiator
  private arpTimer: NodeJS.Timeout | null = null;
  private arpNotes: number[] = [NOTES.D3, NOTES.F3, NOTES.A3, NOTES.C4, NOTES.D4, NOTES.F4, NOTES.A4];
  private arpIndex: number = 0;
  private arpRateMs: number = 135; // ~110 BPM 16th notes
  private arpActive: boolean = false;

  public init() {
    cyberAudio.init();
  }

  /**
   * Creates a synthetic cinematic hall impulse response.
   * No external audio file is required.
   */
  private createCinematicReverb(ctx: AudioContext) {
    const duration = 3.8;
    const decay = 3.2;
    const length = Math.floor(ctx.sampleRate * duration);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);

      for (let i = 0; i < length; i++) {
        const time = i / ctx.sampleRate;
        const envelope = Math.pow(1 - time / duration, decay);
        const stereoVariation =
          channel === 0 ? Math.sin(i * 0.011) : Math.cos(i * 0.013);

        data[i] =
          (Math.random() * 2 - 1) *
          envelope *
          (0.65 + stereoVariation * 0.08);
      }
    }

    return impulse;
  }

  /**
   * Starts the procedural music score
   */
  public startScore() {
    if (this.isPlaying) return;
    const ctx = cyberAudio.init();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    try {
      this.isPlaying = true;
      const now = ctx.currentTime;

      // ============================================================
      // CINEMATIC MASTER BUS
      // ============================================================

      this.masterGain = ctx.createGain();

      const initialVol = cyberAudio.isMuted() ? 0.0001 : 0.095;

      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.linearRampToValueAtTime(initialVol, now + 1.8);

      // Master compressor
      this.compressor = ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, now);
      this.compressor.knee.setValueAtTime(14, now);
      this.compressor.ratio.setValueAtTime(4.5, now);
      this.compressor.attack.setValueAtTime(0.008, now);
      this.compressor.release.setValueAtTime(0.28, now);

      // Main cinematic low-pass
      this.masterFilter = ctx.createBiquadFilter();
      this.masterFilter.type = "lowpass";
      this.masterFilter.frequency.setValueAtTime(420, now);
      this.masterFilter.Q.setValueAtTime(1.15, now);

      // Dedicated sub-bass control
      this.subFilter = ctx.createBiquadFilter();
      this.subFilter.type = "lowpass";
      this.subFilter.frequency.setValueAtTime(140, now);
      this.subFilter.Q.setValueAtTime(0.7, now);

      // High-frequency cinematic presence / air
      this.presenceFilter = ctx.createBiquadFilter();
      this.presenceFilter.type = "highshelf";
      this.presenceFilter.frequency.setValueAtTime(5200, now);
      this.presenceFilter.gain.setValueAtTime(1.8, now);

      // Stereo width stage
      this.masterWidth = ctx.createStereoPanner();
      this.masterWidth.pan.setValueAtTime(0, now);

      // Cinematic hall reverb
      this.reverb = ctx.createConvolver();
      this.reverb.buffer = this.createCinematicReverb(ctx);

      this.reverbGain = ctx.createGain();
      this.reverbGain.gain.setValueAtTime(0.16, now);

      // Stereo echo
      this.stereoDelayL = ctx.createDelay();
      this.stereoDelayR = ctx.createDelay();

      this.stereoDelayL.delayTime.setValueAtTime(0.21, now);
      this.stereoDelayR.delayTime.setValueAtTime(0.31, now);

      this.stereoGainL = ctx.createGain();
      this.stereoGainR = ctx.createGain();

      this.stereoGainL.gain.setValueAtTime(0.18, now);
      this.stereoGainR.gain.setValueAtTime(0.14, now);

      // Soft saturation / warmth
      this.saturation = ctx.createWaveShaper();

      const curve = new Float32Array(44100);

      for (let i = 0; i < curve.length; i++) {
        const x = (i * 2) / curve.length - 1;
        curve[i] = Math.tanh(x * 1.35);
      }

      this.saturation.curve = curve;
      this.saturation.oversample = "4x";

      // Main signal chain
      this.masterFilter.connect(this.presenceFilter);
      this.presenceFilter.connect(this.saturation);
      this.saturation.connect(this.compressor);
      this.compressor.connect(this.masterWidth);
      this.masterWidth.connect(this.masterGain);
      this.masterGain.connect(ctx.destination);

      // Reverb bus
      this.reverb.connect(this.reverbGain);
      this.reverbGain.connect(this.masterWidth);

      // Stereo echo bus
      this.stereoDelayL.connect(this.stereoGainL);
      this.stereoDelayR.connect(this.stereoGainR);
      this.stereoGainL.connect(this.masterWidth);
      this.stereoGainR.connect(this.masterWidth);

      // 2. Start Sub-Bass Drone Layer (Root D1 + Detuned D2)
      this.startDrone(ctx, now);

      // 3. Setup Pad Gain
      this.padGain = ctx.createGain();
      this.padGain.gain.setValueAtTime(0.0001, now);
      this.padGain.connect(this.masterFilter);

      // Listen for global mute toggle
      if (typeof window !== "undefined") {
        window.addEventListener("vyuham:audio-toggle", this.handleMuteToggle);
      }
    } catch {
      this.isPlaying = false;
    }
  }

  private handleMuteToggle = (e: Event) => {
    const detail = (e as CustomEvent<{ muted: boolean }>).detail;
    if (!this.masterGain || !this.isPlaying) return;
    const ctx = cyberAudio.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    if (detail?.muted) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, t + 0.1);
    } else {
      this.masterGain.gain.linearRampToValueAtTime(0.085, t + 0.2);
    }
  };

  /**
   * Deep analog-modeled sub-bass drone
   */
  private startDrone(ctx: AudioContext, now: number) {
    const frequencies = [
      NOTES.D1,
      NOTES.D1 * 0.997,
      NOTES.A1,
      NOTES.D2,
    ];

    const waves: OscillatorType[] = [
      "sawtooth",
      "sine",
      "triangle",
      "sine",
    ];

    const gains = [0.045, 0.085, 0.035, 0.025];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waves[i];
      osc.frequency.setValueAtTime(freq, now);

      if (i === 1) osc.detune.setValueAtTime(-4, now);
      if (i === 2) osc.detune.setValueAtTime(5, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gains[i], now + 2.2);

      osc.connect(gain);

      if (this.subFilter && this.masterFilter) {
        gain.connect(this.subFilter);
        this.subFilter.connect(this.masterFilter);
      } else if (this.masterFilter) {
        gain.connect(this.masterFilter);
      }

      osc.start(now);

      this.droneOscs.push(osc);
      this.droneGains.push(gain);
    });
  }

  /**
   * Synthesizes polyphonic harmonic synth chord pads
   */
  private playChord(chordNotes: number[], duration: number = 3.5, filterFreq: number = 850) {
    if (!this.isPlaying) return;
    const ctx = cyberAudio.getContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const now = ctx.currentTime;

      // Stop previous pad oscillators gently
      this.padOscs.forEach((osc) => {
        try {
          osc.stop(now + 0.15);
        } catch {}
      });
      this.padOscs = [];

      chordNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const chordGain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now);

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 1.003, now); // slight chorus detune

        chordGain.gain.setValueAtTime(0.0001, now);
        chordGain.gain.linearRampToValueAtTime(0.022, now + 0.4);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(chordGain);
        osc2.connect(chordGain);

        // Main cinematic signal
        if (this.masterFilter) {
          chordGain.connect(this.masterFilter);
        }

        // Large room reverb
        if (this.reverb) {
          chordGain.connect(this.reverb);
        }

        // Stereo echo
        if (this.stereoDelayL) {
          chordGain.connect(this.stereoDelayL);
        }

        if (this.stereoDelayR) {
          chordGain.connect(this.stereoDelayR);
        }

        osc.start(now);
        osc2.start(now);
        osc.stop(now + duration + 0.1);
        osc2.stop(now + duration + 0.1);

        this.padOscs.push(osc, osc2);
      });

      if (this.masterFilter) {
        this.masterFilter.frequency.exponentialRampToValueAtTime(
          Math.min(6000, filterFreq),
          now + 0.6
        );
      }
    } catch {}
  }

  /**
   * Starts rhythmic cyber arpeggiator clock
   */
  private startArp(rateMs: number = 135) {
    this.arpRateMs = rateMs;
    this.arpActive = true;
    if (this.arpTimer) clearInterval(this.arpTimer);

    this.arpTimer = setInterval(() => {
      if (!this.isPlaying || !this.arpActive) return;
      const ctx = cyberAudio.getContext();
      if (!ctx || ctx.state !== "running") return;

      try {
        const t = ctx.currentTime;
        const note = this.arpNotes[this.arpIndex % this.arpNotes.length];
        this.arpIndex += 1;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = this.currentFrame >= 11 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(note, t);

        const vol = this.currentFrame >= 12 ? 0.024 : 0.015;
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);

        osc.connect(gain);
        if (this.masterFilter) gain.connect(this.masterFilter);
        if (this.delayNode) gain.connect(this.delayNode);

        osc.start(t);
        osc.stop(t + 0.095);
      } catch {}
    }, this.arpRateMs);
  }

  /**
   * Procedural explosive sub-drop on breakthrough climax (Frame 15)
   */
  private playBreakthroughSubDrop() {
    const ctx = cyberAudio.getContext();

    if (!ctx || ctx.state !== "running") return;

    try {
      const now = ctx.currentTime;

      // Cinematic sub drop
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();

      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(155, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 1.05);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.exponentialRampToValueAtTime(0.20, now + 0.06);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

      subOsc.connect(subGain);

      if (this.subFilter && this.masterFilter) {
        subGain.connect(this.subFilter);
        this.subFilter.connect(this.masterFilter);
      } else {
        subGain.connect(ctx.destination);
      }

      subOsc.start(now);
      subOsc.stop(now + 1.2);

      // Cinematic impact
      const impact = ctx.createOscillator();
      const impactGain = ctx.createGain();

      impact.type = "triangle";
      impact.frequency.setValueAtTime(85, now);
      impact.frequency.exponentialRampToValueAtTime(32, now + 0.55);

      impactGain.gain.setValueAtTime(0.12, now);
      impactGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      impact.connect(impactGain);

      if (this.masterFilter) {
        impactGain.connect(this.masterFilter);
      }

      impact.start(now);
      impact.stop(now + 0.75);

      // High energy shimmer
      const blastOsc = ctx.createOscillator();
      const blastGain = ctx.createGain();

      blastOsc.type = "sawtooth";
      blastOsc.frequency.setValueAtTime(1400, now);
      blastOsc.frequency.exponentialRampToValueAtTime(180, now + 0.55);

      blastGain.gain.setValueAtTime(0.0001, now);
      blastGain.gain.exponentialRampToValueAtTime(0.055, now + 0.025);
      blastGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      blastOsc.connect(blastGain);

      if (this.masterFilter) {
        blastGain.connect(this.masterFilter);
      }

      if (this.reverb) {
        blastGain.connect(this.reverb);
      }

      blastOsc.start(now);
      blastOsc.stop(now + 0.7);

      // Massive resolution chord
      this.playChord(
        [
          NOTES.D3,
          NOTES.A3,
          NOTES.D4,
          NOTES.F4,
          NOTES.A4,
          NOTES.D5,
        ],
        5.2,
        5200
      );
    } catch {}
  }

  /**
   * Frame-by-frame music transition
   * Synchronized precisely with the animation marks
   */
  public transitionToFrame(frameIndex: number, timelineTime: number) {
    if (this.currentFrame === frameIndex) return;
    this.currentFrame = frameIndex;

    const ctx = cyberAudio.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (frameIndex) {
      case 1: // INITIAL STATE (0s)
        if (this.masterFilter) {
          this.masterFilter.frequency.setValueAtTime(350, now);
        }
        break;

      case 2: // SIGNAL DETECTED (0.7s)
        // Shimmer harmonic fifth
        this.playChord([NOTES.D4, NOTES.A4], 2.0, 500);
        break;

      case 3: // ENERGY ACCUMULATION (1.75s)
        // First minor triad enters
        this.playChord([NOTES.D3, NOTES.F3, NOTES.A3], 2.8, 650);
        break;

      case 4: // CORE FORMATION (4.56s)
        // Sub bass solidifies, filter expands
        if (this.masterFilter) {
          this.masterFilter.frequency.exponentialRampToValueAtTime(750, now + 0.4);
        }
        break;

      case 5: // RING ASSEMBLY (4.75s)
        // Arpeggiator begins running
        this.arpNotes = [NOTES.D3, NOTES.F3, NOTES.A3, NOTES.C4, NOTES.D4];
        this.startArp(140);
        this.playChord([NOTES.D3, NOTES.A3, NOTES.C4], 3.0, 900);
        break;

      case 7: // SYNCHRONIZATION (8.05s)
        // Dmin9 full chord
        this.arpNotes = [NOTES.D3, NOTES.F3, NOTES.A3, NOTES.C4, NOTES.E4, NOTES.A4];
        this.playChord([NOTES.D3, NOTES.F3, NOTES.A3, NOTES.C4, NOTES.E4], 3.2, 1100);
        break;

      case 9: // SIX LOCKS APPROACH (10.45s)
        // Dramatic harmonic shift to Bb maj7 / D (tension build)
        this.arpNotes = [NOTES.Bb2, NOTES.D3, NOTES.F3, NOTES.A3, NOTES.D4];
        this.playChord([NOTES.Bb2, NOTES.D3, NOTES.F3, NOTES.A3], 3.4, 1300);
        break;

      case 11: // ENERGY LOADING (13.4s)
        // Faster tempo arpeggio, brighter filter
        this.arpNotes = [NOTES.D3, NOTES.G3, NOTES.A3, NOTES.C4, NOTES.D4, NOTES.F4];
        this.startArp(95); // 16th note acceleration
        this.playChord([NOTES.G2, NOTES.D3, NOTES.G3, NOTES.Bb3, NOTES.D4], 3.8, 1800);
        break;

      case 12: // MAXIMUM ENERGY (17.6s)
        // High harmonic tension (A7sus4 / D)
        this.arpNotes = [NOTES.A3, NOTES.C4, NOTES.D4, NOTES.E4, NOTES.G4, NOTES.A4];
        this.startArp(75); // fast pulse
        this.playChord([NOTES.A2, NOTES.E3, NOTES.A3, NOTES.C4, NOTES.D4], 2.2, 2800);
        break;

      case 13: // CORE SATURATION (18.72s)
      case 14: // SYSTEM STRETCH (19.07s)
        // Filter wide open, extreme tension
        if (this.masterFilter) {
          this.masterFilter.frequency.exponentialRampToValueAtTime(4200, now + 0.5);
        }
        break;

      case 15: // BREAKTHROUGH (19.67s)
        // Massive Sub-drop + Triumphant resolution
        this.arpActive = false;
        this.playBreakthroughSubDrop();
        break;

      case 16: // LOGO REVEAL (23.0s)
        // Majestic Celestial D Major 9 resolve (triumph & awe)
        this.arpNotes = [NOTES.D4, NOTES.F4 * 1.06, NOTES.A4, NOTES.D5];
        this.startArp(180); // slow, majestic bell chimes
        this.playChord(
          [NOTES.D3, NOTES.A3, NOTES.D4, 370.0, NOTES.A4, 554.37], // D - A - D - F# - A - C#
          4.5,
          2400
        );
        break;

      case 17: // THE FUTURE AWAITS (25.0s)
        // Gentle peaceful resolve fading out
        this.playChord([NOTES.D3, NOTES.A3, NOTES.D4, NOTES.F4], 3.0, 1200);
        break;
    }
  }

  /**
   * Continuous parameter modulation across timeline frames
   */
  public updateTimeline(time: number, totalDuration: number) {
    if (!this.isPlaying || !this.masterFilter) return;
    const ctx = cyberAudio.getContext();
    if (!ctx) return;

    // Gradual organic filter sweep tied to elapsed time
    const progress = Math.min(1, Math.max(0, time / totalDuration));
    const targetFreq = 400 + progress * progress * 2400;

    try {
      this.masterFilter.frequency.setValueAtTime(targetFreq, ctx.currentTime);
    } catch {}
  }

  /**
   * Graceful score fade-out and cleanup
   */
  public stopScore(fadeDuration: number = 0.5) {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.arpActive = false;

    if (this.arpTimer) {
      clearInterval(this.arpTimer);
      this.arpTimer = null;
    }

    const ctx = cyberAudio.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);
      }

      setTimeout(() => {
        this.droneOscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.droneOscs = [];
        this.droneGains = [];

        this.padOscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.padOscs = [];
      }, fadeDuration * 1000 + 50);
    } catch {}

    if (typeof window !== "undefined") {
      window.removeEventListener("vyuham:audio-toggle", this.handleMuteToggle);
    }
  }

  /**
   * Homepage Section Scroll Harmonic Chime
   */
  public playSectionHarmonic(phase: string) {
    if (cyberAudio.isMuted()) return;

    const ctx = cyberAudio.init();

    if (!ctx || ctx.state !== "running") return;

    try {
      const now = ctx.currentTime;

      const chords: Record<string, number> = {
        hero: NOTES.D4,
        stats: NOTES.F4,
        about: NOTES.A4,
        streams: NOTES.C5,
        schedule: NOTES.D5,
        cta: NOTES.A5,
      };

      const freq = chords[phase] || NOTES.D4;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(
        freq * 1.45,
        now + 0.14
      );

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);

      if (this.masterFilter) {
        gain.connect(this.masterFilter);
      }

      if (this.reverb) {
        gain.connect(this.reverb);
      }

      if (this.stereoDelayL) {
        gain.connect(this.stereoDelayL);
      }

      if (this.stereoDelayR) {
        gain.connect(this.stereoDelayR);
      }

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {}
  }

  /**
   * Fast Speed-Slide Doppler Kinetic Whoosh
   */
  public playSpeedSlideWhoosh() {
    if (cyberAudio.isMuted()) return;

    const ctx = cyberAudio.init();

    if (!ctx || ctx.state !== "running") return;

    try {
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      const pan = ctx.createStereoPanner();

      osc.type = "sawtooth";

      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.42);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(4200, now + 0.12);
      filter.frequency.exponentialRampToValueAtTime(240, now + 0.42);
      filter.Q.setValueAtTime(1.5, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      pan.pan.setValueAtTime(-0.8, now);
      pan.pan.linearRampToValueAtTime(0.8, now + 0.22);
      pan.pan.linearRampToValueAtTime(-0.2, now + 0.42);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(pan);

      if (this.masterFilter) {
        pan.connect(this.masterFilter);
      }

      if (this.reverb) {
        pan.connect(this.reverb);
      }

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }
}

export const cyberMusic = new CyberMusicScoreEngine();
