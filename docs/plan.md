# Plan: MathCut Studio

> Source PRD: `00_Inbox/timestablestudioprd.md` (v1.3, 21 March 2026)

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: `/` (Studio Lot home), `/practice/:mode` (rehearsal, take, action, directors-cut), `/movies` (table grid), `/movies/:table` (per-table detail), `/awards`, `/settings`, `/parent`
- **State management**: React Context + `useReducer` holding `UserProgress` as single source of truth. Zustand only if reducer complexity warrants it
- **Persistence**: localStorage key `mathcut-studio-data`. JSON-serialised `UserProgress`. Written after every question (not end of session)
- **Data models**: `FactRecord`, `SessionRecord`, `QuestionRecord`, `UserProgress`, `UserSettings`, `StreakData` — as defined in PRD Section 5.4.1
- **Styling**: Tailwind CSS + CSS custom properties for all theme tokens (colours, gradients, surfaces from Section 7.1)
- **Typography**: Bebas Neue (display), Atkinson Hyperlegible (body), JetBrains Mono (numbers), OpenDyslexic (toggle override) — all self-hosted via Google Fonts
- **Animation**: Framer Motion for all transitions, celebrations, and micro-interactions
- **Voice TTS**: OpenAI TTS API (server-side generation, cached audio files). Fallback: Web Speech API
- **Voice STT**: Web Speech API `SpeechRecognition`. Fallback: keypad only
- **Build**: Vite + React 18 + TypeScript
- **Deployment**: Netlify (static site) + PWA via vite-plugin-pwa
- **Testing**: Vitest + React Testing Library
- **Repo**: `github.com/NadiaCuriosity/mathcut-studio` (created, empty)

---

## Phase 1: One Fact, End-to-End

**User stories**: Lincoln can answer a multiplication question via keypad, see whether he got it right, hear TTS feedback, and have his progress saved.

### What to build

A single vertical slice through every layer: one multiplication fact (3x4), rendered as a static array on screen, answered via keypad input, with correct/incorrect feedback spoken via OpenAI TTS, Leitner box promotion on correct answer, and the result persisted to localStorage. The app shell uses the cinematic dark UI with all colour tokens and typography from Section 7 — establishing the visual foundation that every subsequent phase builds on.

This phase proves the core loop works: question -> visual -> input -> feedback -> persistence.

### Acceptance criteria

- [ ] Vite + React + TypeScript project scaffolded and deploying to Netlify
- [ ] Single question screen renders with the "Set" layout (question top, array centre, keypad bottom)
- [ ] Static array displays for 3x4 (3 rows of 4 themed objects)
- [ ] Keypad input works (number entry, backspace, submit)
- [ ] Physical keyboard number keys + Enter also work
- [ ] Correct answer triggers TTS celebration voice line + visual feedback
- [ ] Incorrect answer triggers TTS encouragement voice line + gentle visual feedback
- [ ] Leitner box promotes on correct answer, stays on incorrect
- [ ] `UserProgress` with one `FactRecord` saves to localStorage after answer
- [ ] App shell has dark theme with CSS variables from Section 7.1
- [ ] Typography loads correctly (Bebas Neue headings, Atkinson Hyperlegible body, JetBrains Mono keypad)
- [ ] Renders on iPhone 11 Safari and Yoga 7 Chrome

---

## Phase 2: Full Rehearsal Mode

**User stories**: Lincoln can select a table, practise a full session of 8-12 questions with interactive arrays, build new facts row-by-row, and see a session summary.

### What to build

Expand from one fact to all 144 facts with the Leitner-based selection algorithm. Implement Rehearsal mode end-to-end: table selection screen, session flow (8-12 questions), interactive arrays (tappable rows with skip-counting and running total), "Build It" mode for Box 1 facts, film strip progress indicator, and the session summary screen. This is the primary learning mode — it needs to feel complete and polished.

The table intro sequence (first encounter with a new table) is included here since it's part of the Rehearsal flow.

### Acceptance criteria

- [ ] Table selection screen with movie poster cards for each table (2x-12x) + "Surprise Me"
- [ ] 1x table auto-completed and shown as archived
- [ ] Leitner fact selection algorithm works (priority: fading > struggling > new > learning > familiar > mastered)
- [ ] Maximum 3 new facts introduced per session
- [ ] Session length configurable (8, 10, or 12 questions)
- [ ] Tapping an array row highlights it, speaks skip-count, updates running total
- [ ] Skip-counting through rows produces cumulative spoken count
- [ ] "Build It" mode: empty grid, tap to place rows, running total + TTS skip-count narration
- [ ] "Fill all" shortcut available in Build It (never forced)
- [ ] Box 1 / high recentMisses facts default to Build It; Box 2+ show pre-built arrays
- [ ] Table intro sequence plays on first encounter with a table
- [ ] Film strip progress indicator shows position in session
- [ ] "Wrap" button ends session early without penalty
- [ ] Session summary: "scenes nailed" / "scenes directed" / "new scenes learned" — no scores or percentages
- [ ] Incorrect answers show brief encouragement and move on (Discovery Pathway comes in Phase 3)
- [ ] All 144 FactRecords tracked individually in localStorage
- [ ] Progress saves after every question

---

## Phase 3: Discovery Pathway + Derived Facts

**User stories**: When Lincoln gets stuck, the app guides him to discover the answer himself through scaffolded support — never just tells him.

### What to build

The complete Discovery Pathway (6 levels of scaffolding from Section 5.3.5) and the derived fact strategy system (Section 5.2.3). When Lincoln answers incorrectly, instead of "the answer is X", the app enters the pathway: strategic pause -> strategy prompt with ghosted arrays -> anchor fact with split array -> guided step-by-step derivation -> guided array counting -> full reveal with connection. Also implement the array split and flip interactions, the "Help me, crew!" button, within-session retry logic, and the frustration guard.

This is the pedagogical heart of the app — the thing that makes it not a flashcard app.

### Acceptance criteria

- [ ] Incorrect answers trigger Discovery Pathway (replacing Phase 2's brief encouragement)
- [ ] Level 1: 5-second strategic pause with visual warmth, no "try again" pressure
- [ ] Level 2: Strategy prompt with ghosted related arrays at 20% opacity
- [ ] Level 3: Anchor fact selected from Lincoln's mastered facts (Box 3+), array splits into colour-coded sections with labelled subtotals
- [ ] Level 4: Step-by-step guided derivation with animated array transformations and TTS narration
- [ ] Level 5: Guided construction — Lincoln taps rows to count through, running total increments, no typing needed
- [ ] Level 6: Full reveal always connected to visual model and strategy, never isolated
- [ ] "Help me, crew!" button always visible, jumps to Level 3
- [ ] "Just tell me" button available from Level 3 onward
- [ ] Same fact wrong twice in one session -> skip for rest of session (frustration guard)
- [ ] Within-session retry: missed fact reappears 3+ questions later in Build It mode
- [ ] Pathway depth scales with fact mastery (full for Box 1-2, abbreviated for Box 3+)
- [ ] 5 derived fact strategies implemented with array animations: doubling, add one group, subtract one group, halving, splitting
- [ ] Each table has a primary derivation strategy linked to prerequisite table
- [ ] "Surprise Me" follows the recommended 12-table introduction order
- [ ] Array split interaction (pinch/tap to divide into colour-coded sections with subtotals)
- [ ] Array flip interaction (commutative view with rotation animation)
- [ ] `discoveryAssisted`, `discoveryLevel`, `anchorFactUsed`, `builtArray` recorded in QuestionRecord
- [ ] Discovery Pathway voice line variants rotate (minimum 5 per level)

---

## Phase 4: Voice System

**User stories**: Lincoln can use the app entirely by voice — questions are spoken, he answers by speaking, and all UI is narrated.

### What to build

Full voice integration: OpenAI TTS API client with audio caching (pre-generate question and feedback voice lines, on-demand for dynamic content), speech recognition input via Web Speech API with the number parser, and audio ducking (lower effects when TTS speaks). The mic button gets ~75% visual prominence alongside the keypad at ~25%. Voice line variants rotate across all categories (correct, incorrect, session start/end, discovery pathway — minimum 5-8 per category).

### Acceptance criteria

- [ ] OpenAI TTS API integration with audio file caching
- [ ] All questions spoken automatically when they appear
- [ ] All feedback spoken (correct, incorrect, discovery pathway, session start/end)
- [ ] All UI text spoken (screen titles, navigation hints, button labels on first visit)
- [ ] Speech rate adjustable in settings (0.8x, 1.0x, 1.2x) and persisted
- [ ] Repeat button replays current audio
- [ ] Voice line variants rotate (minimum 5 per category, no consecutive repeats)
- [ ] Mic button activates speech recognition with pulsing gold ring animation
- [ ] Recognised speech displayed before submission (confirm/retry)
- [ ] Number parser handles: "forty two", "four two", "twelve", "one two", "hundred", "one oh eight"
- [ ] 5-second silence timeout with friendly message
- [ ] Audio ducking: sound effects reduce to 30% when TTS is speaking
- [ ] Graceful degradation: if TTS API unreachable, fall back to Web Speech API; if STT unavailable, hide mic
- [ ] Works on Chrome (Yoga 7) and Safari iOS (iPhone 11)

---

## Phase 5: Studio Lot + Navigation + Progress

**User stories**: Lincoln has a home screen that grows as he masters tables, can browse his movies, and sees his streak.

### What to build

The Studio Lot home screen (SVG/Canvas illustrated scene with 10 progression levels), the bottom navigation bar (4 icon-only tabs), per-table movie tracker with poster cards and production status, and streak tracking. The app now has structure: a home, navigation between screens, and a sense of the "world" Lincoln is building.

### Acceptance criteria

- [ ] Studio Lot renders as animated scene reflecting current progress level (0-10)
- [ ] Level transitions have celebration animations
- [ ] Buildings are tappable and show associated table info
- [ ] Lot never visually regresses
- [ ] Bottom navigation bar with 4 icon tabs (Studio Lot, Start Shooting, My Movies, Awards)
- [ ] Active tab highlighted with gold underline
- [ ] React Router v6 navigation between all screens
- [ ] Per-table movie cards with poster art, production status, progress bar
- [ ] Movie detail view shows per-fact mastery breakdown
- [ ] "Surprise Me" card on table selection uses recommended introduction order
- [ ] Streak counter on home screen ("Days on set")
- [ ] Missing a day resets counter silently — warm welcome back message
- [ ] Longest streak tracked separately
- [ ] Screen transitions use "curtain rise" entrance animation
- [ ] Renders well on iPhone 11 and Yoga 7

---

## Phase 6: Take + Action Scene + Director's Cut

**User stories**: Lincoln has all four practice modes available, each serving a different purpose in his learning journey.

### What to build

The remaining three practice modes. Take mode with per-fact visual scaling (Build It for Box 1, full array for Box 2, partial for Box 3, minimal hint for Box 4, number-only for Box 5). Action Scene mode for Box 4-5 facts only (quick-fire, exciting effects, "Box Office Takings" score, personal best). Director's Cut mixed review across all tables with spaced repetition prioritisation. Optional timer bar (off by default, Box 3+ only, never punitive).

### Acceptance criteria

- [ ] Take mode: visual aid level adapts per-fact based on Leitner box
- [ ] Take mode: Box 1 always gets Build It, Box 5 always number-only
- [ ] Take mode: Discovery Pathway depth scales with fact mastery
- [ ] Action Scene: only presents Box 4-5 facts
- [ ] Action Scene: minimum 10 qualifying facts required, otherwise blocked with message
- [ ] Action Scene: exciting visual/audio feedback (camera flashes, spotlight sweeps)
- [ ] Action Scene: "Box Office Takings" score display
- [ ] Action Scene: personal best tracked and displayed
- [ ] Action Scene: wrong answers show brief correction, no Discovery Pathway
- [ ] Action Scene: 3+ wrong offers optional mode switch
- [ ] Director's Cut: draws from all practised tables
- [ ] Director's Cut: prioritises fading (>7 days), then struggling, then random mastered
- [ ] Director's Cut: visual aids and pathway depth match individual fact mastery
- [ ] Director's Cut: 10-15 questions, spread across 3+ tables
- [ ] Director's Cut: summary celebrates discovered facts separately
- [ ] Timer: optional, off by default, only Box 3+ facts
- [ ] Timer: visual progress bar (green -> amber), never red, never auto-submits
- [ ] Mode selection screen with all four options (Action Scene greyed if insufficient Box 4+ facts)

---

## Phase 7: Awards, Themes + Cinematic Polish

**User stories**: Lincoln earns awards, unlocks visual themes, and every interaction feels cinematic.

### What to build

The awards system (10+ awards with trigger logic and trophy shelf), visual theme system (minimum 3 themes with unlock milestones), and the full cinematic motion design: clapperboard wipe between questions, spotlight sweep on correct answers, premiere celebration sequence for table mastery, trophy rise animation for award unlocks, construction dust for studio lot level-ups. Film grain overlay, vignette, spotlight atmospheric effects. All celebration sequences.

### Acceptance criteria

- [ ] 10+ awards with defined trigger conditions (First Take, Opening Weekend, Box Office Hit, etc.)
- [ ] Award unlock triggers trophy rise animation + voice announcement
- [ ] Awards are permanent, never revoked
- [ ] Award shelf viewable from navigation (trophy cabinet with shelf texture)
- [ ] 3+ visual themes for array objects (Director's Set default + 2 unlockable)
- [ ] Themes unlock based on mastery milestones
- [ ] Theme selection persists in localStorage
- [ ] Clapperboard wipe transition between questions
- [ ] Spotlight sweep animation on correct answers
- [ ] "That's a wrap" clapperboard animation on session complete
- [ ] Premiere sequence on table mastery (spotlights, gold confetti, marquee banner)
- [ ] Studio lot level-up: construction dust + warm light
- [ ] Film grain overlay (opacity 0.03, disabled for reduced-motion and high-contrast)
- [ ] Curtain vignette on all screens
- [ ] Spotlight warm gradient behind focal content
- [ ] Loading state: film reel rotation with projector flicker
- [ ] `prefers-reduced-motion`: all particles disabled, celebrations use opacity fades, transitions become crossfades

---

## Phase 8: Parent View + PWA + Ship

**User stories**: Parents can check Lincoln's progress. The app works offline, installs to home screen, and is fully polished for daily use.

### What to build

Parent/guardian view (accessed via long-press on studio logo — no PIN) showing mastery overview, per-table progress, recent sessions, struggling facts, and time spent. JSON export/import for backup. Settings screen (speech rate, OpenDyslexic toggle, high contrast, timer, session length, theme, voice input toggle). PWA configuration (service worker, offline support, add-to-home-screen, app icon). Sound effects for all events. Responsive polish pass for both target devices. Accessibility audit against Section 8 requirements.

### Acceptance criteria

- [ ] Parent view accessed via long-press (800ms) or triple-tap on studio logo
- [ ] Parent view shows: overall mastery %, per-table progress, recent sessions, streak, time spent, struggling facts
- [ ] Struggling facts highlighted (Box 1 for 3+ sessions)
- [ ] Parent view is read-only
- [ ] JSON export/import for data backup
- [ ] Settings screen: speech rate, OpenDyslexic toggle, high contrast, timer on/off, session length, theme, voice input toggle
- [ ] OpenDyslexic toggle replaces all fonts when enabled
- [ ] High contrast mode: black bg, white text, yellow accents, gradients/textures disabled
- [ ] PWA manifest with clapperboard icon
- [ ] Service worker: app works fully offline after first load
- [ ] Add-to-home-screen prompt on second visit
- [ ] Sound effects for all events (clapperboard snap, cheer, chime, fanfare, etc.)
- [ ] All sounds mutable via speaker icon toggle
- [ ] Ambient projector hum option (off by default, 10-15% volume)
- [ ] Sound effects: MP3 + OGG fallback, all under 100KB
- [ ] WCAG 2.1 AA: 4.5:1 contrast, 48px touch targets, focus indicators, semantic HTML, aria-labels
- [ ] Dyslexia: no justified text, 1.5 line height, 0.05em letter spacing, no italics, 60-char max line
- [ ] Responsive: tested on iPhone 11 Safari + Yoga 7 Chrome touchscreen
- [ ] No scrolling during practice (everything above the fold)
- [ ] Error states handled per Appendix B (browser compat, offline, localStorage full, etc.)
