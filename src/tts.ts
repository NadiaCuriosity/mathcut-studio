const correctLines = [
  "That's a take! Beautiful work!",
  "Nailed it! You're a natural!",
  "Perfect scene! The director is impressed!",
  "And cut! That was brilliant!",
  "Star performance! Absolutely right!",
];

const incorrectLines = [
  "Not quite, but every great director learns from each take.",
  "Close! Let's set up for another shot.",
  "The crew believes in you. Let's try the next scene.",
  "That's okay! Even the best need more than one take.",
  "Keep rolling. You're getting closer!",
];

let lastCorrectIdx = -1;
let lastIncorrectIdx = -1;

function pickRandom(lines: string[], lastIdx: number): [string, number] {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * lines.length);
  } while (idx === lastIdx && lines.length > 1);
  return [lines[idx], idx];
}

export function getCorrectLine(): string {
  const [line, idx] = pickRandom(correctLines, lastCorrectIdx);
  lastCorrectIdx = idx;
  return line;
}

export function getIncorrectLine(): string {
  const [line, idx] = pickRandom(incorrectLines, lastIncorrectIdx);
  lastIncorrectIdx = idx;
  return line;
}

// Cache the best available voice
let cachedVoice: SpeechSynthesisVoice | null = null;
let voiceLoaded = false;

function getBestVoice(): SpeechSynthesisVoice | null {
  if (voiceLoaded) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Prefer natural/enhanced voices, English
  const preferred = [
    "Microsoft Aria Online", // Windows 11 neural voice — very natural
    "Microsoft Guy Online",
    "Microsoft Jenny",
    "Google UK English Female",
    "Google UK English Male",
    "Google US English",
    "Samantha", // macOS
    "Daniel",   // macOS
    "Karen",    // macOS
    "Moira",    // macOS
  ];

  for (const name of preferred) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) {
      cachedVoice = match;
      voiceLoaded = true;
      return match;
    }
  }

  // Fallback: any English voice
  const english = voices.find(
    (v) => v.lang.startsWith("en") && !v.name.includes("eSpeak")
  );
  if (english) {
    cachedVoice = english;
    voiceLoaded = true;
    return english;
  }

  voiceLoaded = true;
  cachedVoice = voices[0] ?? null;
  return cachedVoice;
}

// Preload voices (Chrome loads them async)
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    voiceLoaded = false;
    getBestVoice();
  };
}

export function speak(text: string, rate = 1.0): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1.05; // Slightly warmer
    utterance.volume = 0.9;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}
