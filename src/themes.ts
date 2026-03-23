export interface ThemeDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** Unlock condition description shown when locked */
  unlockHint: string;
  /** Table number that must be mastered to unlock (0 = always unlocked) */
  unlockTable: number;
  /** Array of emoji icons used in arrays */
  icons: string[];
}

export const THEMES: ThemeDef[] = [
  {
    id: "lizard-lounge",
    name: "Lizard Lounge",
    emoji: "🦎",
    description: "Lizard Linc's personal collection of scaly friends",
    unlockHint: "Available from the start",
    unlockTable: 0,
    icons: ["🦎", "🐊", "🐉", "🦕", "🐸"],
  },
  {
    id: "directors-set",
    name: "Director's Set",
    emoji: "🎬",
    description: "Classic clapperboards, film reels, and popcorn",
    unlockHint: "Available from the start",
    unlockTable: 0,
    icons: ["🍿", "🎥", "🎬", "⭐", "🎭"],
  },
  {
    id: "block-world",
    name: "Block World",
    emoji: "🟩",
    description: "Pixel cubes and blocky builds",
    unlockHint: "Master the ×2 table",
    unlockTable: 2,
    icons: ["🟩", "🟦", "🟨", "🟧", "🟪"],
  },
  {
    id: "brick-builder",
    name: "Brick Builder",
    emoji: "🧱",
    description: "Colourful interlocking bricks",
    unlockHint: "Master the ×5 table",
    unlockTable: 5,
    icons: ["🧱", "🔴", "🔵", "🟡", "🟢"],
  },
  {
    id: "space-epic",
    name: "Space Epic",
    emoji: "🚀",
    description: "Planets, rockets, and stars",
    unlockHint: "Master the ×8 table",
    unlockTable: 8,
    icons: ["🪐", "🚀", "⭐", "🌙", "☄️"],
  },
  {
    id: "monster-movie",
    name: "Monster Movie",
    emoji: "👾",
    description: "Friendly cartoon monsters",
    unlockHint: "Master all 10 tables",
    unlockTable: 0, // special: requires all tables
    icons: ["👾", "👻", "🤖", "👽", "🦖"],
  },
];

export function getThemeDef(id: string): ThemeDef | undefined {
  return THEMES.find((t) => t.id === id);
}

export function getThemeIcons(id: string): string[] {
  return getThemeDef(id)?.icons ?? THEMES[0].icons;
}
