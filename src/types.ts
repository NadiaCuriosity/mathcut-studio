export interface FactRecord {
  a: number;
  b: number;
  box: 1 | 2 | 3 | 4 | 5;
  correctStreak: number;
  recentMisses: number;
  totalAttempts: number;
  totalCorrect: number;
  lastAttempted: string;
  lastCorrect: string;
  isFading: boolean;
}

export interface QuestionRecord {
  a: number;
  b: number;
  userAnswer: number | null;
  correct: boolean;
  responseTime: number;
  inputMethod: 'voice' | 'keypad';
  previousBox: number;
  newBox: number;
  discoveryAssisted: boolean;
  discoveryLevel: number | null;
  anchorFactUsed: string | null;
  builtArray: boolean;
}

export interface SessionRecord {
  id: string;
  date: string;
  mode: 'rehearsal' | 'take' | 'action' | 'directors-cut' | 'reshoots';
  factsAttempted: number;
  factsCorrect: number;
  duration: number;
  questions: QuestionRecord[];
}

export interface UserSettings {
  speechRate: number;
  useDyslexicFont: boolean;
  highContrastMode: boolean;
  timerEnabled: boolean;
  sessionLength: number;
  preferredTheme: string;
  voiceInputEnabled: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export interface UserProgress {
  facts: FactRecord[];
  sessions: SessionRecord[];
  studioLevel: number;
  unlockedThemes: string[];
  unlockedAwards: string[];
  settings: UserSettings;
  streak: StreakData;
  tablesIntroduced: number[];
  actionSceneBest: number;
  trickyFacts: { a: number; b: number }[];
}
