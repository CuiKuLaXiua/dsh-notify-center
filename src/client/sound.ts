// 提示音引擎：Web Audio 实时合成（移植自 Zenith scripts/gen-notify-sounds.mjs）。
// classic/soft 两套音色 × message/error/attention 三种提示音，零音频资源。

interface NoteSpec {
  notes: Array<[number, number]>;
  wave: "sine" | "sine2";
  peak: number;
}

const SCHEMES: Record<string, Record<string, NoteSpec>> = {
  classic: {
    message: { notes: [[880, 0.15], [1174.66, 0.17]], wave: "sine", peak: 0.55 },
    error: { notes: [[320, 0.3]], wave: "sine2", peak: 0.55 },
    attention: { notes: [[659.25, 0.17], [880, 0.17], [1108.73, 0.21]], wave: "sine", peak: 0.6 },
  },
  soft: {
    message: { notes: [[440, 0.18], [587.33, 0.2]], wave: "sine", peak: 0.45 },
    error: { notes: [[220, 0.34]], wave: "sine", peak: 0.45 },
    attention: { notes: [[329.63, 0.19], [440, 0.19], [554.37, 0.23]], wave: "sine", peak: 0.5 },
  },
};

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playSound(kind: "message" | "error" | "attention", scheme: string, volume: number): void {
  const ac = getCtx();
  if (!ac) return;
  const table = (SCHEMES as any)[scheme] || SCHEMES.classic;
  const spec: NoteSpec = table[kind] || SCHEMES.classic.message;

  const master = ac.createGain();
  // 感知音量按平方映射（0-100 → 0-0.8 增益）
  const vol = Math.pow(Math.max(0, Math.min(100, Number(volume) || 0)) / 100, 2) * 0.8;
  master.gain.value = vol;
  master.connect(ac.destination);

  const t0 = ac.currentTime;
  let offset = 0;
  for (const [freq, dur] of spec.notes) {
    const start = t0 + offset;
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ac.createGain();
    // 5ms 淡入防爆音 + 指数衰减
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(spec.peak, start + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(start);
    osc.stop(start + dur + 0.02);

    if (spec.wave === "sine2") {
      const osc2 = ac.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2;
      const g2 = ac.createGain();
      g2.gain.setValueAtTime(0.0001, start);
      g2.gain.linearRampToValueAtTime(spec.peak * 0.3, start + 0.005);
      g2.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(start);
      osc2.stop(start + dur + 0.02);
    }
    offset += dur + 0.01;
  }
}