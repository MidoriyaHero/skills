// gen.mjs — synthesize the music bed (120 BPM, 20 s) and a small SFX kit as 16-bit WAVs.
// Zero downloads, fully deterministic. Run: node src/audio/gen.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM;            // 0.5 s
const LEN = 20;                   // seconds
const OUT = new URL("../../public/sfx/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

/** Encode mono float samples (-1..1) as a 16-bit PCM WAV file. */
const wav = (name, samples) => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, 44 + i * 2));
  writeFileSync(OUT + name, buf);
  console.log("wrote", name, (samples.length / SR).toFixed(2) + "s");
};
const silence = (sec) => new Float32Array(Math.round(sec * SR));
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));      // attack then exp decay
const normalize = (buf, peak = 0.9) => { let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v)); return buf.map((v) => (v / m) * peak); };
let seed = 7; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff * 2 - 1; };

/** Add a one-shot into `buf` at time `at`. */
const put = (buf, at, dur, fn) => {
  const start = Math.round(at * SR);
  for (let i = 0; i < dur * SR && start + i < buf.length; i++) buf[start + i] += fn(i / SR);
};

// --- one-shots used by both the track and the SFX kit --------------------
const kick = (t) => Math.sin(2 * Math.PI * (45 + 110 * Math.exp(-t * 28)) * t) * env(t, 0.002, 0.11) * 1.0;
const clap = (t) => rnd() * env(t, 0.001, 0.045) * 0.55;
const hat = (t) => rnd() * env(t, 0.0005, 0.012) * 0.22;
const bassNote = (f) => (t) => (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 6)) * env(t, 0.004, 0.14) * 0.5;
const padNote = (f, dur) => (t) => { const a = Math.min(1, t / 0.6), r = Math.min(1, Math.max(0, (dur - t) / 0.8));
  return (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * 1.004 * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.003 * t)) * a * r * 0.07; };
const pluck = (f) => (t) => Math.sin(2 * Math.PI * f * t + 2.5 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 9)) * env(t, 0.002, 0.09) * 0.22;

// --- music: A minor, 10 bars, builds every 2 bars --------------------------
const A1 = 55, F1 = 43.65, C2 = 65.41, G1 = 49;
const bars = [A1, A1, F1, F1, C2, C2, G1, G1, A1, A1];       // root per bar
const chords = { [A1]: [220, 261.6, 329.6], [F1]: [174.6, 220, 261.6], [C2]: [261.6, 329.6, 392], [G1]: [196, 246.9, 293.7] };
const arp = [440, 523.3, 659.3, 523.3, 880, 659.3, 523.3, 440];
const music = silence(LEN);
bars.forEach((root, bar) => {
  const t0 = bar * 4 * BEAT;
  chords[root].forEach((f) => put(music, t0, 4 * BEAT, padNote(f, 4 * BEAT)));
  for (let b = 0; b < 4; b++) {
    const tb = t0 + b * BEAT;
    put(music, tb, 0.3, kick);
    if (b % 2 === 1) put(music, tb, 0.12, clap);
    for (let e = 0; e < 2; e++) {
      const te = tb + e * BEAT / 2;
      put(music, te, 0.05, hat);
      if (bar >= 1) put(music, te, 0.25, bassNote(e === 0 ? root : root * 1.5));
      if (bar >= 3) put(music, te, 0.2, pluck(arp[(b * 2 + e) % arp.length] * (root === F1 ? 0.794 : root === G1 ? 0.891 : root === C2 ? 1.189 : 1)));
    }
  }
});
// Riser into the proof beat (16 s), then a final impact.
put(music, 14, 2, (t) => rnd() * Math.pow(t / 2, 2.2) * 0.5);
put(music, 16, 0.6, (t) => Math.sin(2 * Math.PI * (30 + 90 * Math.exp(-t * 14)) * t) * env(t, 0.002, 0.3) * 1.2);
// Master fade out over the last second.
for (let i = 0; i < music.length; i++) { const t = i / SR; if (t > LEN - 1) music[i] *= LEN - t; }
wav("music.wav", normalize(music, 0.85));

// --- SFX kit ----------------------------------------------------------------
const whoosh = silence(0.45); put(whoosh, 0, 0.45, (t) => { const p = t / 0.45; return rnd() * Math.sin(Math.PI * p) ** 2 * (0.3 + 0.7 * p); });
wav("whoosh.wav", normalize(lowpass(whoosh, 0.08), 0.8));
const click = silence(0.08); put(click, 0, 0.08, (t) => Math.sin(2 * Math.PI * (600 + 1400 * Math.exp(-t * 90)) * t) * env(t, 0.001, 0.015));
wav("click.wav", normalize(click, 0.8));
const thump = silence(0.5); put(thump, 0, 0.5, (t) => Math.sin(2 * Math.PI * (38 + 120 * Math.exp(-t * 18)) * t) * env(t, 0.002, 0.2));
wav("thump.wav", normalize(thump, 0.9));
const tick = silence(0.03); put(tick, 0, 0.03, (t) => Math.sin(2 * Math.PI * 2400 * t) * env(t, 0.0005, 0.006));
wav("tick.wav", normalize(tick, 0.6));
const shimmer = silence(1.2); [1318.5, 1568, 1975.5, 2637].forEach((f, i) => put(shimmer, i * 0.04, 1.2, (t) => Math.sin(2 * Math.PI * f * t) * env(t, 0.005, 0.35) * 0.3));
wav("shimmer.wav", normalize(shimmer, 0.7));

/** One-pole lowpass; `k` in (0,1], smaller = darker. */
function lowpass(buf, k) { let y = 0; return buf.map((x) => (y += k * (x - y))); }
