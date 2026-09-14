// Web Audio API 432Hz Om / Spanda Drone Synthesizer & Harmonic UI Feedback
class AudioEngine {
  private ctx: AudioContext | null = null;
  private oscillator1: OscillatorNode | null = null;
  private oscillator2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  private initContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      this.isPlaying = false;
      return false;
    } else {
      this.start();
      this.isPlaying = true;
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private start() {
    const ctx = this.initContext();
    if (!ctx) return;

    // 432Hz fundamental (Miracle tone / Shiva cosmic tuning)
    this.oscillator1 = ctx.createOscillator();
    this.oscillator1.type = 'sine';
    this.oscillator1.frequency.setValueAtTime(432, ctx.currentTime);

    // 216Hz sub-octave (Harmonic fifth for warmth and grounding)
    this.oscillator2 = ctx.createOscillator();
    this.oscillator2.type = 'sine';
    this.oscillator2.frequency.setValueAtTime(216, ctx.currentTime);

    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.8);

    this.oscillator1.connect(this.gainNode);
    this.oscillator2.connect(this.gainNode);
    this.gainNode.connect(ctx.destination);

    this.oscillator1.start();
    this.oscillator2.start();
  }

  private stop() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        if (this.oscillator1) {
          try { this.oscillator1.stop(); } catch (_) { /* noop */ }
        }
        if (this.oscillator2) {
          try { this.oscillator2.stop(); } catch (_) { /* noop */ }
        }
      }, 850);
    }
  }

  // Harmonic crystalline UI acoustic feedback
  public playChime(frequency: number = 864, duration: number = 0.3) {
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {
      // Ignore audio context errors on inactive user interactions
    }
  }
}

export const audioEngine = new AudioEngine();
