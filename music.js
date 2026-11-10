(() => {
  const cfg = window.DARIA_LOVE;

  class RomanticMusic {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.playing = false;
      this.usingFile = false;
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.preload = "auto";
      this.timer = 0;
      this.step = 0;
      this.volume = 0.55;
    }

    async start() {
      if (this.playing) return;
      const loaded = await this.tryFile();
      if (loaded) {
        this.usingFile = true;
        this.audio.volume = this.volume;
        await this.audio.play();
        this.playing = true;
        return;
      }
      this.ensureEngine();
      if (this.ctx.state === "suspended") await this.ctx.resume();
      this.playing = true;
      this.usingFile = false;
      this.loop();
    }

    async tryFile() {
      try {
        this.audio.src = cfg.musicFile;
        this.audio.volume = this.volume;
        await this.audio.play();
        return true;
      } catch {
        this.audio.removeAttribute("src");
        return false;
      }
    }

    ensureEngine() {
      if (this.ctx) return;
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = this.volume * 0.42;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2400;
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.34;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.28;
      delay.connect(feedback);
      feedback.connect(delay);
      filter.connect(delay);
      filter.connect(master);
      delay.connect(master);
      master.connect(ctx.destination);
      this.ctx = ctx;
      this.master = master;
      this.filter = filter;
    }

    setVolume(v) {
      this.volume = v;
      this.audio.volume = v;
      if (this.master) this.master.gain.value = v * 0.42;
    }

    async toggle() {
      if (!this.playing) {
        await this.start();
        return true;
      }
      if (this.usingFile) {
        this.audio.pause();
      } else if (this.ctx) {
        await this.ctx.suspend();
      }
      this.playing = false;
      return false;
    }

    async resume() {
      if (this.usingFile) {
        await this.audio.play();
      } else if (this.ctx) {
        await this.ctx.resume();
      }
      this.playing = true;
    }

    tone(freq, time, dur, type, gainVal) {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(gainVal, time + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      osc.connect(g);
      g.connect(this.filter);
      osc.start(time);
      osc.stop(time + dur + 0.05);
    }

    loop() {
      if (!this.playing || this.usingFile) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const beat = 0.72;
      const chords = [
        [220.0, 261.63, 329.63, 440.0],
        [174.61, 220.0, 261.63, 349.23],
        [196.0, 246.94, 293.66, 392.0],
        [261.63, 329.63, 392.0, 523.25],
      ];
      const melody = [659.25, 587.33, 523.25, 440.0, 523.25, 587.33, 659.25, 783.99];
      const chord = chords[this.step % chords.length];
      chord.forEach((f, i) => {
        this.tone(f / 2, now, beat * 3.4, "triangle", 0.045);
        this.tone(f, now + i * 0.03, beat * 2.8, "sine", 0.03);
      });
      const note = melody[this.step % melody.length];
      this.tone(note, now + 0.08, beat * 1.6, "sine", 0.07);
      this.tone(note / 2, now + beat, beat * 1.2, "triangle", 0.04);
      this.step += 1;
      this.timer = window.setTimeout(() => this.loop(), beat * 1000 * 2);
    }
  }

  window.romanticMusic = new RomanticMusic();
})();
