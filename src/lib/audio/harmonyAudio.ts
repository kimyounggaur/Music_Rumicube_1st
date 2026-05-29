import type { Note } from "@/lib/game/types";

export interface AudioAdapter {
  playChord(notes: string[]): Promise<void>;
}

let unlocked = false;
let muted = false;

async function getTone() {
  return import("tone");
}

export function setAudioMuted(value: boolean): void {
  muted = value;
}

export async function unlockAudio(): Promise<void> {
  if (unlocked) {
    return;
  }
  const Tone = await getTone();
  await Tone.start();
  unlocked = true;
}

export async function playChord(soundNotes: string[]): Promise<void> {
  if (muted || soundNotes.length === 0) {
    return;
  }
  const Tone = await getTone();
  await unlockAudio();
  const synth = new Tone.PolySynth(Tone.Synth, {
    volume: -14,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.08, sustain: 0.35, release: 0.8 }
  }).toDestination();

  if (soundNotes.length > 5) {
    soundNotes.forEach((note, index) => {
      synth.triggerAttackRelease(note, "8n", Tone.now() + index * 0.07);
    });
  } else {
    synth.triggerAttackRelease(soundNotes, "2n");
  }
  window.setTimeout(() => synth.dispose(), 1400);
}

export async function playTokenClick(note: Note): Promise<void> {
  if (muted) {
    return;
  }
  const Tone = await getTone();
  await unlockAudio();
  const synth = new Tone.Synth({
    volume: -22,
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.04, sustain: 0.1, release: 0.12 }
  }).toDestination();
  const octave = note === "A" || note === "B" ? "3" : "4";
  synth.triggerAttackRelease(`${note}${octave}`, "16n");
  window.setTimeout(() => synth.dispose(), 350);
}

export async function playVictory(): Promise<void> {
  if (muted) {
    return;
  }
  await playChord(["C4", "E4", "G4", "C5"]);
}
