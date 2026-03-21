# MathCut Studio — Product Requirements Document

**Version:** 1.3
**Date:** 21 March 2026
**Author:** Nadia Ellis
**Status:** Draft — Ready for Development
**Changes in v1.2:** Frontend design pass + interactive learning overhaul. Design: replaced generic UI spec with cinematic aesthetic direction (Golden Age Hollywood dark UI), distinctive typography (Bebas Neue + Atkinson Hyperlegible), expanded colour system with gradients/surfaces/spotlights, cinematic animation choreography, film grain/vignette atmosphere, component design language. Learning: arrays are now constructive/interactive (not decorative), added Discovery Pathway scaffolding system (6-level structured support when stuck), added derived fact strategies as core mechanic, visual aids now scale per-fact not per-mode, added "Build It" as primary interaction for new facts
**Changes in v1.1:** Web-only (no native), OpenAI TTS, keypad as first-class input, no demotion on wrong answers, failure-sensitive design, no break reminders, no multi-profile, no lesson structure, separate repo

---

## 1. Executive Summary

MathCut Studio is a voice-first, visually interactive web app designed to help Lincoln ("Lizard Linc"), an 11-year-old twice-exceptional learner, memorise his multiplication tables (1–12). The entire experience is themed around movie directing and film production — Lincoln is the Director building his studio, and each times table is a movie he's producing.

The app is built specifically for a child who is gifted in fluid reasoning and visual-spatial skills but has dyslexia, dysgraphia, and ADHD. Text is minimised. Questions are spoken aloud and can be answered by voice. Every multiplication fact has an interactive visual representation. Sessions are short, progress is celebrated, and wrong answers are never punished.

**Target platform:** Web app (React + Vite), deployed on Netlify — no native/iOS builds
**Target devices:** iPhone 11 (Safari mobile) + Lenovo Yoga 7 laptop (Chrome, touchscreen)
**Target user:** Lincoln, age 11 (hard-coded single profile — no multi-user)
**Scope:** Multiplication tables 1×1 through 12×12 (144 facts)
**Repo:** Separate repository, scaffolded fresh

---

## 2. Problem Statement

Lincoln needs to memorise his multiplication tables for school, but traditional flash cards and worksheets are a poor fit for his learning profile:

- **Dyslexia** means text-heavy interfaces create friction rather than learning
- **Dysgraphia** means writing answers is laborious and demotivating
- **ADHD** means long sessions, unclear progress, and lack of novelty lead to disengagement
- **Limited working memory** (especially auditory) means purely verbal drills don't stick

At the same time, Lincoln has extraordinary strengths — high fluid reasoning, strong visual-spatial skills, excellent long-term memory, and the ability to hyper-focus on things that fascinate him (Minecraft, Roblox, Lego, filmmaking, storytelling).

**The opportunity:** Build a learning tool that works _with_ his brain rather than against it — voice-first so he doesn't have to read, visually rich so he can _see_ multiplication, and themed around his passion for directing so he _wants_ to come back.

---

## 3. User Persona

### Lincoln ("Lizard Linc")

| Attribute | Detail |
|---|---|
| **Age** | 11 |
| **Profile** | Twice-exceptional (2e): intellectually gifted + dyslexic, dysgraphic, ADHD |
| **Cognitive strengths** | Very high fluid reasoning, high visual-spatial skills, strong long-term memory, excellent oral vocabulary |
| **Cognitive challenges** | Slower processing speed, limited working memory (especially auditory), difficulty with reading fluency and written output |
| **Interests** | Movie directing, Minecraft, Roblox, Lego, drama, comics, storytelling, world-building |
| **Dream** | Become a movie director |
| **Learning style** | Visual and kinesthetic; benefits from routines, broken-down steps, and information that stays visible |
| **Motivators** | Creative control, progression/building systems, humour, theatrical framing |
| **Demotivators** | Dense text, timed pressure without choice, punishment for mistakes, boring repetition |

### Secondary User: Parent/Guardian

Needs a simple way to check Lincoln's progress without complex dashboards or accounts. A discreet view showing which tables are mastered and recent activity is sufficient for MVP.

---

## 4. Design Principles

### 4.1 Voice-First

Lincoln doesn't want to read — so the app reads everything for him. All UI text, questions, instructions, feedback, and navigation hints are spoken aloud via natural-sounding TTS. Answers can be given by voice (primary, ~75% prominence) or keypad (first-class alternative, ~25% prominence). All navigation has icon-based alternatives to text labels.

### 4.2 Show, Don't Tell

Every multiplication fact has a visual representation — arrays, groups, animated scenes. Lincoln should be able to _see_ that 3 × 4 means 3 groups of 4 things before he's ever asked to recall the answer.

### 4.3 The Director's Chair

The entire UX is framed around filmmaking:

| Learning concept | Director framing |
|---|---|
| Practice session | "Take" |
| Correct answer | "Nailed the scene!" |
| Wrong answer | "Let's try another take" |
| Mastering a table | "That's a wrap!" |
| All tables mastered | "Premiere night" |
| Review/mixed practice | "Director's Cut" |
| Progress dashboard | "The Studio Lot" |
| Achievements | "Awards" |

### 4.4 ADHD-Friendly by Default

- Sessions are short (5–10 minutes max, 8–12 questions)
- Visual progress is always visible (how many questions left, overall mastery)
- Effort is celebrated, not just accuracy ("Great persistence, Director!")
- Sessions can be paused and resumed at any time
- No punishment for wrong answers — ever. No demotion indicators, no visible box changes, no "you dropped" messaging
- If Lincoln keeps failing the same fact, rotate to different facts rather than repeating it — avoid frustration spirals
- Heavy gamification keeps sessions motivating even when facts are difficult
- Novelty is built in through visual themes and unlockables

### 4.5 Dyslexia-Friendly by Default

- Minimum font size: 18px (24px preferred for primary content)
- OpenDyslexic font available as a toggle
- High contrast colour scheme by default, with additional high-contrast mode
- Icons and visual cues used in place of text labels wherever possible
- No walls of text anywhere in the app

### 4.6 Progress Without Pressure

- Daily streaks are tracked but missing a day has _zero_ negative consequence (no lost streaks, no guilt messaging)
- The studio lot only grows — it never shrinks or deteriorates
- Speed is optional and always framed as "Action Scene" mode that Lincoln opts into

---

## 5. Feature Specifications

### 5.1 Voice System

#### 5.1.1 Text-to-Speech (TTS)

**Description:** All UI text — questions, instructions, feedback, navigation hints, button labels, and screen titles — is spoken aloud using the **OpenAI TTS API** (server-side generation, cached audio files). This is the primary way Lincoln consumes content; he should never need to read anything on screen.

**Why OpenAI TTS:** Natural-sounding voice is critical for engagement. Browser-native Web Speech API sounds robotic and varies across devices. Budget allows ~100 TTS requests/hour, which is well within session usage.

**Implementation:** Pre-written voice lines (see Appendix C) are sent to the OpenAI TTS API and cached. Voice lines are generated ahead of time where possible (questions, feedback variants) and on-demand for dynamic content only.

**Note:** Live conversational AI (dynamic responses, real-time dialogue) is flagged for v2. MVP uses pre-written voice lines delivered via natural TTS.

**Requirements:**

- Every question is spoken automatically when it appears ("What is 7 times 8?")
- All feedback is spoken ("That's a wrap on that one!" / "Not quite — let's try another take")
- All UI text is spoken — screen titles, navigation hints, button purposes on first visit
- A "repeat" button (speaker icon) replays the current audio at any time
- Speech rate is adjustable in settings (0.8×, 1.0×, 1.2×)

**Voice lines — examples:**

| Context | Voice line |
|---|---|
| Question prompt | "Action! What is [x] times [y]?" |
| Correct answer | "Cut! That's a perfect take!" / "Nailed it, Director!" / "Brilliant — that's a wrap on this scene!" |
| Incorrect answer | "Hmm, not quite. The answer is [z]. Let's try another take later." |
| Session start | "Welcome to the set, Director! Ready to roll?" |
| Session complete | "And that's a wrap on today's shoot! Great work, Lizard Linc." |
| Mastered a table | "Ladies and gentlemen, the [n] times table movie is complete! Standing ovation!" |
| Streak milestone | "Director, you've been on set [n] days in a row. The crew is impressed!" |

**Acceptance criteria:**

- [ ] TTS speaks every question without user action
- [ ] TTS speaks all UI text (screen titles, navigation hints, button labels on first visit)
- [ ] TTS works on Chrome (desktop) and Safari (iOS) — the two target browsers
- [ ] OpenAI TTS API integration with audio caching (pre-generate where possible)
- [ ] Speech rate setting persists in localStorage
- [ ] Repeat button replays current audio
- [ ] Voice lines rotate (minimum 5 variants per category to avoid repetition)
- [ ] Graceful degradation if TTS API is unreachable (text shown as fallback)

#### 5.1.2 Speech Recognition (STT)

**Description:** Lincoln can answer questions by speaking the number aloud using the Web Speech API `SpeechRecognition` interface.

**Requirements:**

- A prominent microphone button activates listening
- Visual feedback shows when the app is listening (pulsing mic icon, waveform animation)
- The recognised number is displayed on screen before submission so Lincoln can confirm or retry
- Number parsing handles common child speech patterns:
  - "twelve" → 12
  - "twenty four" → 24
  - "seven two" → 72 (children often say digits separately)
  - "seventy two" → 72
  - "six" → 6
- A 5-second silence timeout ends listening and shows what was heard
- If recognition fails, a friendly message appears: "I didn't catch that — try again or tap the number"

**Number parsing rules:**

```
Input speech → Parsed number
"forty two"  → 42
"four two"   → 42  (digit-by-digit pattern)
"four"       → 4
"hundred"    → 100
"one hundred and eight" → 108
"one oh eight" → 108
"twelve"     → 12
"one two"    → 12
```

**Acceptance criteria:**

- [ ] Microphone button activates speech recognition
- [ ] Visual feedback (pulsing animation) shows active listening state
- [ ] Recognised speech is displayed before submission
- [ ] Lincoln can confirm or retry before answer is submitted
- [ ] Number parser correctly handles all patterns in the table above
- [ ] 5-second silence timeout with friendly message
- [ ] Graceful fallback to keypad input if Speech Recognition API unavailable
- [ ] Works on Chrome (Yoga 7) and Safari iOS (iPhone 11); degrades gracefully if SpeechRecognition unavailable

#### 5.1.3 Keypad Input (First-Class Input Method)

**Description:** A large number keypad for answering via tap/click. This is a **first-class input method** (~25% of screen prominence), not a fallback. Voice input gets ~75% prominence (larger mic button, spoken prompts encouraging voice), but the keypad is always visible and fully functional.

**Requirements:**

- Large touch targets (minimum 48px × 48px, recommended 64px × 64px)
- Numbers 0–9, backspace, and submit button
- Current answer displayed prominently as digits are entered
- Can be used alongside or instead of voice input
- Keypad is always visible during question screens (not hidden behind a toggle)

**Acceptance criteria:**

- [ ] Keypad buttons are minimum 48×48px
- [ ] Current entered number is displayed large and clear
- [ ] Backspace removes last digit
- [ ] Submit button confirms answer
- [ ] Keyboard input (physical keyboard number keys + Enter) also works

---

### 5.2 Visual Learning Mode

#### 5.2.1 Interactive Array System

**Description:** Arrays are the core learning mechanic, not illustrations. Every multiplication fact can be explored, constructed, and counted through an interactive array — `a` rows of `b` themed objects. The array is a tool Lincoln uses to *discover* answers, not decoration he looks at while recalling them.

**Pedagogical basis:** The Concrete-Representational-Abstract (CRA) framework — children learn multiplication by constructing and manipulating groups before working with abstract numbers. Research shows digital manipulatives are more effective than passive viewing because they constrain interaction, provide immediate feedback, and reduce cognitive load (critical for ADHD + dysgraphia profiles).

**Core interactions (available in all modes where arrays are visible):**

| Interaction | What happens | Voice line example |
|---|---|---|
| **Tap a row** | Row highlights with a gold glow. Running total updates: "7... 14... 21" | "That's row 3 — 21 so far!" |
| **Skip-count** | Tap rows in sequence. Each tap highlights the next row and the running total animates upward | "7... 14... 21... 28... keep going!" |
| **Tap the full array** | All objects briefly pulse, total count animates in large text | "That's 56 altogether!" |
| **Split the array** | Pinch or tap a split handle to break the array into two colour-coded sections (e.g., 7×8 splits into 5×8 + 2×8). Each section shows its subtotal | "Look — 40 plus 16. That's 56!" |
| **Flip the array** | Tap a rotate button to show the commutative view (7×8 becomes 8×7 — rows and columns swap with animation) | "Same answer, different angle!" |

**Running total display:** A large number in the corner of the array area updates as Lincoln interacts. This connects physical interaction → counting → the answer. The total is always visible but never forces itself — Lincoln can ignore it if he already knows the answer.

**Layout rules:**

- For products ≤ 36: full array, all objects individually rendered and tappable
- For products 37–72: full array with row labels. Objects are rendered but grouped visually (rows are distinct). Tapping a row skip-counts
- For products > 72: abbreviated array — show 3 full rows with objects, remaining rows as labelled placeholders with a "..." indicator. Split interaction is especially useful here (e.g., 12×9 splits into 10×9 + 2×9)

**Array construction ("Build It" mode):**

This is a first-class interaction, not a side feature. When a fact is new (Box 1) or struggling (high `recentMisses`), the default presentation in Rehearsal mode is "Build It" rather than a pre-built array.

- The screen shows an empty grid frame with a row/column structure indicated by faint guidelines
- Lincoln taps to place themed objects row by row (each tap fills one row of `b` objects)
- After each row, the running total updates and TTS speaks the skip-count ("That's one row of 8... two rows of 8, that's 16...")
- When all `a` rows are filled, a celebration: "You built it! [a] times [b] is [product]!"
- Lincoln can also tap a "Fill all" button if he wants to skip construction (never forced)

**Acceptance criteria:**

- [ ] Every multiplication from 1×1 to 12×12 can render an interactive array
- [ ] Objects animate into position (Framer Motion or CSS transitions)
- [ ] Tapping a row highlights it, speaks the skip-count, and updates the running total
- [ ] Skip-counting through rows produces a cumulative spoken count
- [ ] Split interaction divides the array into two colour-coded sections with subtotals
- [ ] Commutative flip rotates the array with smooth animation
- [ ] Running total is always visible and updates in real time
- [ ] "Build It" mode allows row-by-row construction with skip-count audio
- [ ] Layout adapts to screen size (responsive)
- [ ] Visual complexity scales appropriately for large products (abbreviated arrays for products > 72)

#### 5.2.2 Visual Themes

**Description:** Multiple visual themes for the array objects, reflecting Lincoln's interests.

**Themes (MVP — implement at least 3):**

| Theme | Objects | Unlock condition |
|---|---|---|
| **Director's Set** (default) | Clapperboards, film reels, popcorn buckets | Available from start |
| **Block World** | Pixel-art cubes (Minecraft-inspired aesthetic, no trademarked assets) | Master 2× table |
| **Brick Builder** | Colourful interlocking bricks (Lego-inspired, no trademarked assets) | Master 5× table |
| **Space Epic** | Planets, rockets, stars | Master 8× table |
| **Monster Movie** | Friendly cartoon monsters | Master 10× table |

**Important:** Do not use any trademarked names, logos, or direct asset copies. Use _inspired-by_ aesthetics only.

**Acceptance criteria:**

- [ ] Minimum 3 themes available at launch
- [ ] Theme selection persists in localStorage
- [ ] Themes unlock based on mastery milestones
- [ ] Unlock notification is celebratory ("New set unlocked! You've earned the Block World theme!")

#### 5.2.3 Derived Fact Strategies

**Description:** When introducing new facts or helping Lincoln with struggling facts, the app explicitly shows how unknown facts relate to known ones. This is the core learning mechanic — Lincoln learns *strategies for figuring out* facts, not just the facts themselves.

**Pedagogical basis:** Children who use derived fact strategies (building unknown facts from known ones) develop more reliable long-term retrieval than those who rely on rote memorisation. For a visual-spatial thinker like Lincoln, seeing the derivation as an array transformation makes the strategy concrete.

**Strategy types (implemented as array animations):**

| Strategy | When to use | Visual | Voice line example |
|---|---|---|---|
| **Doubling** | 4× from 2×, 8× from 4×, 6× from 3× | Two identical arrays side by side, then merged | "You know 2×7 is 14. Double it! 4×7 is 28." |
| **Add one more group** | 3× from 2×, 6× from 5×, any n× from (n-1)× | Existing array + one new row animates in, highlighted | "5×8 is 40. Add one more row of 8... that's 48!" |
| **Subtract one group** | 9× from 10× | Full 10-row array, then one row fades/crosses out | "10×7 is 70. Take away one row of 7... that's 63!" |
| **Halving** | 5× from 10× | 10-row array splits in half with a dividing line | "10×6 is 60. Half of that? 5×6 is 30!" |
| **Splitting** | 7× as 5×+2×, 12× as 10×+2× | Array splits into two colour-coded sections | "7×8? That's 5×8 plus 2×8. 40 plus 16 is 56!" |

**When strategies appear:**

- **First encounter with a new fact family:** The app introduces the table's relationship to a known table. E.g., when Lincoln starts the 4× table, the first question shows "You already know your 2s. Let's double them!" with the doubling animation
- **During Discovery Pathway (see 5.3.5):** When Lincoln is stuck, the strategy prompt uses a derived fact approach anchored to a fact he knows
- **In the per-table "movie intro":** Each table's intro sequence demonstrates its primary derivation strategy before any questions are asked

**Recommended fact family introduction order** (based on derived fact research):

| Order | Table | Primary strategy | Builds from |
|---|---|---|---|
| 1 | ×1 | Identity (auto-mastered) | — |
| 2 | ×10 | Skip-counting by 10 | — |
| 3 | ×5 | Halving ×10 | ×10 |
| 4 | ×2 | Doubles (most children know from addition) | — |
| 5 | ×4 | Double the ×2 | ×2 |
| 6 | ×8 | Double the ×4 | ×4 |
| 7 | ×3 | ×2 + one more group | ×2 |
| 8 | ×6 | Double the ×3, or ×5 + one more group | ×3 or ×5 |
| 9 | ×9 | ×10 − one group | ×10 |
| 10 | ×7 | ×5 + ×2 (splitting), or ×8 − one group | ×5, ×2, ×8 |
| 11 | ×11 | ×10 + one more group | ×10 |
| 12 | ×12 | ×10 + ×2 (splitting) | ×10, ×2 |

**Note:** Lincoln can explore tables in any order — this is the *recommended* order shown in "Surprise Me" mode and used when auto-selecting the next table to introduce. If Lincoln picks a table out of order, the app still shows derivation strategies using whichever facts he already knows.

**Acceptance criteria:**

- [ ] Each strategy type has an animated array transformation
- [ ] Strategy animations show the known fact first, then the derivation step, then the new fact
- [ ] Each table has a primary derivation strategy linked to a prerequisite table
- [ ] "Surprise Me" follows the recommended introduction order
- [ ] Derivation strategies are used in the Discovery Pathway (5.3.5) scaffolding
- [ ] TTS narrates each step of the derivation

---

### 5.3 Practice Modes

#### 5.3.1 Rehearsal Mode

**Description:** Low-pressure exploration and practice. No timer, full visual aids, full interactivity. The emphasis is on understanding through construction and discovery — not recall speed.

**Flow:**
1. Lincoln selects which table(s) to practise (or "Surprise me" for auto-selection based on recommended order)
2. **If this is Lincoln's first session with a table:** Play the table's "movie intro" — a 30-second animated sequence showing the derivation strategy for this table (e.g., "The fours are just the twos, doubled!") with array demonstration. Then proceed to questions
3. A question appears and is spoken aloud
4. **If the fact is new (Box 1) or struggling (recentMisses ≥ 2):** Present in "Build It" mode — Lincoln constructs the array row by row with skip-counting before answering
5. **If the fact is familiar (Box 2+):** Show the pre-built array. Lincoln can interact with it (tap rows, skip-count, split) or go straight to answering
6. Lincoln answers by voice or keypad
7. **If correct:** Celebration animation + voice line, brief pause, next question
8. **If incorrect:** Enter the **Discovery Pathway** (see 5.3.5) — a structured scaffolding sequence that helps Lincoln figure out the answer rather than being told it. After discovery, move on to a different fact and queue the missed one for a retry later in the session
9. Session ends after 8–12 questions (configurable in settings) or when Lincoln taps "Wrap"
10. End-of-session summary: visual recap of questions — "scenes nailed" (correct first try), "scenes directed" (correct after discovery), "new scenes learned" (discovered via pathway). No scores, no percentages

**Acceptance criteria:**

- [ ] No timer visible or running
- [ ] Full interactive arrays shown for every question
- [ ] New/struggling facts default to "Build It" mode
- [ ] Familiar facts show pre-built arrays with full interaction available
- [ ] Table intro sequence plays on first encounter
- [ ] Incorrect answers trigger the Discovery Pathway (not "tell and move on")
- [ ] No negative feedback language (no "wrong", "incorrect", "failed")
- [ ] Session length is 8–12 questions by default
- [ ] "Wrap" button ends session early without penalty
- [ ] End-of-session summary uses positive framing with three categories

#### 5.3.2 Take Mode (Progressive Challenge)

**Description:** Structured practice with progressive difficulty. Visual aids and interactivity scale based on **per-fact mastery** (Leitner box of the individual fact), not the mode level. Named "Take 1", "Take 2", etc. — the Take number reflects Lincoln's overall session count, not a difficulty tier.

**Per-fact visual scaling:**

| Fact's Leitner box | Array display | Interactions available | Discovery Pathway |
|---|---|---|---|
| Box 1 (new) | "Build It" mode — Lincoln constructs | Full: skip-count, split, flip | Full pathway (all levels) |
| Box 2 (learning) | Full pre-built array | Full: skip-count, split, flip | Full pathway |
| Box 3 (familiar) | Partial array — row labels + one expanded row showing objects | Tap rows to skip-count | Abbreviated pathway (starts at Level 3) |
| Box 4 (strong) | Minimal hint — small array icon in corner, tappable to expand | Expand to see array if needed | Quick hint only (Level 4–5) |
| Box 5 (mastered) | No array — number only | None (pure recall) | Quick hint only |

**Key principle:** Visual aids fade *per fact*, not per session. In a single Take session, Lincoln might see a full "Build It" array for 6×7 (Box 1) and a number-only question for 3×5 (Box 5). This avoids stripping support from facts that still need it.

**Timer behaviour (unchanged):**

- Timer is a visual progress bar, not a countdown number
- Bar changes colour gently (green → amber) — never red, never alarming
- Running out of time does NOT auto-submit or punish — it just means "take your time, but see if you can beat the bar next time"
- Timer is OFF by default and must be opted into in settings
- Timer only appears for facts at Box 3+ (never pressure new or struggling facts)

**Acceptance criteria:**

- [ ] Visual aid level adapts per-fact based on Leitner box (not per-session)
- [ ] Box 1 facts always get "Build It" mode regardless of session
- [ ] Box 5 facts show number-only regardless of session
- [ ] Discovery Pathway depth scales with fact mastery (full for new, abbreviated for familiar)
- [ ] Timer is optional, defaults to OFF, and only appears for Box 3+ facts
- [ ] Timer is never punitive
- [ ] Session selects facts from appropriate Leitner boxes

#### 5.3.3 Action Scene Mode

**Description:** Fast-paced review of well-known facts. Exciting visuals and sound effects. Lincoln opts in — this is never forced. This mode IS a recall exercise (flashcard-style) and that's fine — it's only for facts Lincoln has already mastered through understanding.

**Requirements:**

- Only presents facts from Box 4–5 (well-mastered facts that have been learned through construction and derivation)
- Quick-fire pacing with exciting visual effects (camera flashes, spotlight sweeps)
- Sound effects: clapperboard snap, audience cheering, dramatic music sting
- Score shown as "Box Office Takings" (e.g., "$120M" for 12 correct)
- Personal best tracking
- If Lincoln gets one wrong: no break in flow, no Discovery Pathway (this is speed mode). The correct answer flashes briefly with a quick voice line, and the fact is silently queued for review in the next Rehearsal or Take session
- If Lincoln gets 3+ wrong in a session: gentle offer to switch modes — "Want to head back to rehearsal for a bit, Director?" (not forced)

**Acceptance criteria:**

- [ ] Only facts rated Box 4 or 5 are presented
- [ ] Exciting visual and audio feedback
- [ ] Personal best displayed and tracked
- [ ] Wrong answers show brief correction without Discovery Pathway
- [ ] 3+ wrong triggers optional mode-switch suggestion
- [ ] Accessible: animations can be reduced via `prefers-reduced-motion`

#### 5.3.4 Director's Cut Mode

**Description:** Mixed review across all tables. The app's spaced repetition algorithm selects which facts most need review. Visual aids and Discovery Pathway scale per-fact (same rules as Take mode).

**Requirements:**

- Draws from all tables Lincoln has practised
- Prioritises: fading facts (mastered but not reviewed in 7+ days), then struggling facts (high `recentMisses`), then random mastered facts
- Visual aids and interactivity adapt per-fact based on that fact's Leitner box (same table as Take mode 5.3.2)
- Session length: 10–15 questions
- End-of-session highlights which facts moved up or were discovered via pathway

**Acceptance criteria:**

- [ ] Fact selection uses spaced repetition algorithm
- [ ] Fading facts (>7 days since review) are prioritised
- [ ] Visual aid level and Discovery Pathway depth match individual fact mastery
- [ ] Summary shows fact progress (promoted facts celebrated — never show demotions)
- [ ] Summary separately celebrates "scenes discovered" (facts learned via pathway)

#### 5.3.5 The Discovery Pathway (Scaffolded "Stuck" System)

**Description:** When Lincoln answers incorrectly or signals he's stuck (a "Help me, crew!" button), the app enters a structured scaffolding sequence instead of simply revealing the answer. The pathway uses Lincoln's visual-spatial strengths and derived fact strategies to help him *figure out* the answer through interaction.

**Pedagogical basis:** Least-to-most prompting research shows that graduating support levels — from a nudge to a guided walkthrough — builds independence better than immediately providing the answer. Each level introduces only one new piece of information (respecting working memory limits). The goal: Lincoln arrives at the answer himself. Even at the most supportive level, he interacts with the array to discover it — the app never just says "the answer is 56" in isolation.

**Discovery Pathway levels:**

The pathway escalates through levels. If Lincoln answers correctly at any level, the pathway ends with celebration. Each level is a separate screen/state with clear visual framing — Lincoln never feels rushed through the sequence.

---

**Level 1 — Strategic Pause (3–5 seconds)**

The app waits. A gentle visual cue (the array subtly pulses, spotlight warms) encourages Lincoln to look at the array and think. Many children, especially those with slower processing speed, just need time.

- TTS: *silence* (no "try again" pressure)
- Visual: Array glow intensifies slightly, "take your time" warmth
- Duration: 5 seconds before auto-advancing to Level 2
- If Lincoln answers correctly during the pause: "That's the one! Sometimes you just need a moment."

---

**Level 2 — Strategy Prompt**

The app nudges Lincoln toward a derived fact strategy without giving content away. A thought-bubble UI element appears near the array.

- TTS: "Do you know a fact that's close to this one?" OR "What's a table you already know that might help?"
- Visual: Related arrays briefly ghost in at 20% opacity (e.g., for 6×8, a faint 5×8 array appears alongside)
- Lincoln can answer the original question OR tap a "show me" button to continue to Level 3
- If Lincoln answers correctly: "You figured out your own strategy! That's what great directors do."

---

**Level 3 — Anchor Fact**

The app provides a specific known fact as a starting point and shows the relationship visually.

- The app selects an anchor fact Lincoln has already mastered (based on his Leitner data). For 6×8: if he knows 5×8=40, that's the anchor
- TTS: "You know that 5 times 8 is 40." (pause) "6 times 8 is just one more row of 8. Can you work it out?"
- Visual: The array splits into two colour-coded sections — the anchor portion (5 rows, gold) with "40" labelled, and the extra portion (1 row, teal) highlighted and pulsing
- Lincoln can answer by voice or keypad
- If Lincoln answers correctly: "Brilliant! You used what you already knew. 40 plus 8 is 48!"

**Anchor fact selection logic:**
1. Check Lincoln's mastered facts (Box 3+) for the same multiplier
2. Prefer the closest known fact (5× for 6×, 10× for 9×, 4× for 8×)
3. Fall back to the table's primary derivation strategy (see 5.2.3 recommended order)
4. If no suitable anchor exists (e.g., very early in learning): skip to Level 5

---

**Level 4 — Guided Derivation**

The app walks Lincoln through the derivation step by step with animated array transformations.

- TTS narrates each step with pauses for Lincoln to follow visually:
  1. "Let's build this together."
  2. "Here's 5 rows of 8. That's 40." (anchor array builds, "40" appears)
  3. "Now let's add one more row of 8." (new row animates in, highlighted)
  4. "40... plus 8... what does that make?" (running total shows "40 + 8 = ?")
- Lincoln enters the final answer (the addition step, not the full multiplication — reducing cognitive load)
- If Lincoln answers correctly: "You've got it! 6 times 8 is 48. You just built it yourself!"
- If Lincoln answers incorrectly: proceed to Level 5

---

**Level 5 — Guided Construction (Array Counting)**

Lincoln physically discovers the answer by interacting with the array. The app never *tells* the answer — Lincoln *counts to it*.

- TTS: "Let's count it out together. Tap each row!"
- Visual: A fresh full array appears (all rows visible but dimmed). As Lincoln taps each row, it lights up, objects animate, and the running total increments:
  - Tap row 1: "8" (total: 8)
  - Tap row 2: "16" (total: 16)
  - Tap row 3: "24" (total: 24)
  - ...continuing until all rows are counted
- After the final row: The total pulses large and gold. TTS: "6 times 8 is 48! You counted every single one."
- Lincoln does NOT need to type the answer — the counting IS the answer. The interaction is the learning
- If Lincoln stops tapping partway: the app waits patiently (no timeout). A gentle nudge after 10 seconds: "Keep going — you're nearly there!"

---

**Level 6 — Full Reveal with Connection (last resort)**

If Lincoln is unresponsive or explicitly taps a "Just tell me" button (always available from Level 3 onward), the app reveals the answer — but ALWAYS connected to the visual and a strategy, never in isolation.

- TTS: "6 times 8 is 48. See? That's 5 eights — 40 — plus one more eight."
- Visual: The split array animates to show the derivation. The answer appears large with the strategy shown below it (e.g., "5×8 = 40, +8 = 48")
- The fact is NOT marked as "correct" — it stays at its current Leitner box and gets flagged for increased review frequency
- A gentler voice line follows: "We'll come back to this one. Every great film needs a few takes."

---

**Pathway behaviour rules:**

- The **"Help me, crew!" button** is always visible during questions (small lifebuoy icon). Tapping it jumps directly to Level 3 (skipping the pause and strategy prompt). This gives Lincoln agency — he can ask for help without failing first
- If Lincoln gets the same fact wrong twice in one session (after Discovery Pathway both times): skip that fact for the rest of the session. Don't create a frustration spiral. Queue it for the next session
- **Discovery Pathway sessions don't count against Lincoln.** A fact learned through the pathway doesn't demote — it stays at its current box and gets extra review. The pathway is learning, not failure
- The pathway adapts to fact mastery (see Take mode table in 5.3.2): new facts get the full Level 1–6 sequence, familiar facts start at Level 3, strong facts get only Level 4–5
- All pathway interactions update the `responseTime` field in the data model but are flagged as `discoveryAssisted: true` so the parent view can distinguish independent recall from guided discovery

**Data model addition:**

```typescript
interface QuestionRecord {
  // ... existing fields ...
  discoveryAssisted: boolean;   // true if Discovery Pathway was used
  discoveryLevel: number | null; // highest level reached (1–6), null if answered independently
  anchorFactUsed: string | null; // e.g., "5×8=40" — which known fact was the scaffold
}
```

**Acceptance criteria:**

- [ ] Incorrect answers trigger Discovery Pathway (not "tell and move on")
- [ ] "Help me, crew!" button is always visible and jumps to Level 3
- [ ] Level 1 pauses for 5 seconds with visual warmth (no "try again" pressure)
- [ ] Level 2 shows strategy prompt with ghosted related arrays
- [ ] Level 3 selects an appropriate anchor fact from Lincoln's mastered facts
- [ ] Level 3 visually splits the array to show the anchor + extra portion
- [ ] Level 4 walks through the derivation step-by-step with TTS narration
- [ ] Level 5 lets Lincoln count through the array by tapping rows, with running total
- [ ] Level 6 reveals the answer connected to the visual model and strategy (never isolated)
- [ ] "Just tell me" button available from Level 3 onward
- [ ] Same fact wrong twice in one session → skip for rest of session
- [ ] Pathway depth scales with fact mastery (full for Box 1–2, abbreviated for Box 3+)
- [ ] `discoveryAssisted` and `discoveryLevel` are recorded in QuestionRecord
- [ ] Parent view can distinguish independent recall from discovery-assisted answers

---

### 5.4 Spaced Repetition System

#### 5.4.1 Leitner Box Algorithm

**Description:** A 5-box system tracks mastery of each individual multiplication fact (144 facts total: 1×1 through 12×12).

**Box definitions:**

| Box | Name | Review interval | Meaning |
|---|---|---|---|
| 1 | "Script reading" | Every session | New or struggling |
| 2 | "Table read" | Every 2 sessions | Learning |
| 3 | "Dress rehearsal" | Every 4 sessions | Familiar |
| 4 | "On camera" | Every 7 days | Strong |
| 5 | "Award winner" | Every 14 days | Mastered |

**Rules:**

- All facts start in Box 1
- Correct answer: promote to next box (max Box 5)
- **Incorrect answer: NO demotion.** The fact stays in its current box. Instead, the session moves on to a different (easier) fact and circles back to the missed one later in the same session. This is critical — Lincoln takes failure hard, and visible demotion is demotivating.
- If a fact is answered incorrectly multiple times across sessions, it remains in its box but gets flagged for increased review frequency (appears more often in future sessions)
- A fact in Box 5 not reviewed for 7+ days enters "fading" state and is prioritised in Director's Cut
- A fact in Box 5 not reviewed for 14+ days demotes to Box 4 (this is time-based decay, not failure-based — it's invisible to Lincoln)

**Data model (TypeScript):**

```typescript
interface FactRecord {
  a: number;             // multiplicand (1–12)
  b: number;             // multiplier (1–12)
  box: 1 | 2 | 3 | 4 | 5;
  correctStreak: number; // consecutive correct answers
  recentMisses: number;  // missed count without demotion — increases review frequency
  totalAttempts: number;
  totalCorrect: number;
  lastAttempted: string; // ISO date
  lastCorrect: string;  // ISO date
  isFading: boolean;
}

interface SessionRecord {
  id: string;
  date: string;          // ISO date
  mode: 'rehearsal' | 'take' | 'action' | 'directors-cut';
  factsAttempted: number;
  factsCorrect: number;
  duration: number;      // seconds
  questions: QuestionRecord[];
}

interface QuestionRecord {
  a: number;
  b: number;
  userAnswer: number | null;
  correct: boolean;
  responseTime: number;         // milliseconds
  inputMethod: 'voice' | 'keypad';
  previousBox: number;
  newBox: number;
  discoveryAssisted: boolean;   // true if Discovery Pathway was used
  discoveryLevel: number | null; // highest level reached (1–6), null if answered independently
  anchorFactUsed: string | null; // e.g., "5×8=40" — which known fact scaffolded the discovery
  builtArray: boolean;          // true if Lincoln used "Build It" construction
}

interface UserProgress {
  facts: FactRecord[];   // 144 entries
  sessions: SessionRecord[];
  studioLevel: number;   // 0–10
  unlockedThemes: string[];
  unlockedAwards: string[];
  settings: UserSettings;
  streak: StreakData;
}

interface UserSettings {
  speechRate: number;          // 0.8, 1.0, or 1.2
  useDyslexicFont: boolean;
  highContrastMode: boolean;
  timerEnabled: boolean;
  sessionLength: number;       // 8, 10, or 12
  preferredTheme: string;
  voiceInputEnabled: boolean;
  // No PIN — parent view accessed via long-press/triple-tap on studio logo
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;     // ISO date
}
```

**Acceptance criteria:**

- [ ] All 144 facts tracked individually
- [ ] Box promotion follows rules above (no demotion on incorrect answers)
- [ ] Fading detection works correctly
- [ ] Progress saves to localStorage after every question (not just end of session)
- [ ] Data model can be serialised/deserialised from localStorage

---

### 5.5 Progress & Motivation

#### 5.5.1 The Studio Lot (Main Progress View)

**Description:** A visual "movie studio" that evolves as Lincoln masters his tables. This is the home screen of the app.

**Progression levels:**

| Level | Trigger | Visual |
|---|---|---|
| 0 | Start | Empty dirt lot with a "Coming Soon" sign |
| 1 | First session completed | Construction site, foundation laid |
| 2 | 1 table at Box 3+ | Small soundstage appears |
| 3 | 3 tables at Box 3+ | Studio gate and parking lot |
| 4 | 5 tables at Box 3+ | Multiple soundstages, water tower |
| 5 | 7 tables at Box 3+ | Backlot with outdoor sets |
| 6 | 9 tables at Box 3+ | Post-production building, screening room |
| 7 | All 12 tables at Box 3+ | Full studio with everything |
| 8 | 6 tables fully mastered (Box 5) | Gold star on the studio gate |
| 9 | 9 tables fully mastered | Studio lit up at night, spotlight beams |
| 10 | All 12 tables fully mastered | Red carpet premiere with crowds and fireworks |

**Requirements:**

- Studio lot is an illustrated/animated scene (SVG or Canvas)
- Each level transition has a brief celebration animation
- Tapping buildings on the lot shows which table they represent
- The lot NEVER downgrades — once a building appears, it stays

**Acceptance criteria:**

- [ ] Studio lot visually reflects current progress level
- [ ] Level transitions are animated and celebratory
- [ ] Buildings are tappable and show associated table info
- [ ] Lot never visually regresses
- [ ] Renders well on iPhone 11 and Yoga 7 laptop

#### 5.5.2 Per-Table Movie Tracker

**Description:** Each times table (2× through 12×) is represented as a "movie" Lincoln is producing.

**Requirements:**

- Movie poster card for each table showing:
  - Movie title (fun generated names, e.g., "The Sevens Saga", "Operation Eighty-One" for the 9× table)
  - Production status: Pre-production → Filming → Post-production → Premiere → Award Winner
  - Progress bar showing percentage of facts at Box 3+
  - Visual poster art that evolves with progress
- Tapping a movie card shows detail: which facts are mastered, which need work
- 1× table is auto-completed (trivial) and shown as "Classic Film — already in the archives"

**Acceptance criteria:**

- [ ] All 12 tables have movie cards
- [ ] Production status updates based on fact mastery
- [ ] Detail view shows per-fact mastery
- [ ] 1× table treated as pre-mastered

#### 5.5.3 Awards System

**Description:** Achievements framed as movie industry awards.

**Award examples:**

| Award | Trigger |
|---|---|
| "First Take" | Complete first ever session |
| "Opening Weekend" | Master first table |
| "Box Office Hit" | Get 10 correct in a row |
| "Method Actor" | Use voice input for an entire session |
| "Marathon Director" | 7-day streak |
| "Blockbuster" | Master 5 tables |
| "Franchise Builder" | Master all tables in a group (e.g., all even tables) |
| "Lifetime Achievement" | Master all 12 tables |
| "Speed Demon" | Complete an Action Scene with 100% accuracy |
| "Comeback Kid" | Re-master a fading fact |

**Requirements:**

- Awards displayed as trophy/statuette icons on a shelf
- New award triggers a celebration animation + voice announcement
- Awards are permanent — never revoked
- Award shelf viewable from main menu

**Acceptance criteria:**

- [ ] Minimum 10 awards available at launch
- [ ] Award unlock triggers celebration (animation + audio)
- [ ] Awards persist in localStorage
- [ ] Award shelf accessible from navigation

#### 5.5.4 Streak Tracking

**Description:** Track consecutive days of practice.

**Requirements:**

- "Days on set" counter shown on home screen
- Missing a day resets the counter but with NO negative messaging
- Longest streak is tracked separately ("Your record: 14 days on set")
- Streak milestones trigger awards
- A "rest day" is fine — the message is "The crew took a break. Back on set today!"

**Acceptance criteria:**

- [ ] Streak increments for any session completed in a calendar day
- [ ] Missing a day resets current streak silently
- [ ] Longest streak persists
- [ ] Returning after a break gets a warm welcome, not guilt

---

### 5.6 Parent/Guardian View

**Description:** A simple, discreetly accessed view for parents to check Lincoln's progress. No PIN — Lincoln is the only user and there's nothing sensitive to protect. The access method just prevents accidental navigation.

**Requirements:**

- Accessed via a long-press (800ms) on the studio logo on the home screen, or triple-tap. A small "Crew Only" label appears briefly on successful activation — no lock icon, no PIN flow
- Shows:
  - Overall mastery percentage
  - Per-table progress
  - Recent sessions (date, mode, facts practised, accuracy)
  - Current streak
  - Time spent (per session and total)
  - Which facts are struggling (Box 1 for 3+ sessions)
- No editing capabilities — view only
- Simple, clean layout (this view CAN use more text since it's for adults)
- JSON export/import button for data backup

**Acceptance criteria:**

- [ ] Long-press or triple-tap on studio logo opens parent view
- [ ] All progress data is displayed clearly
- [ ] Struggling facts are highlighted
- [ ] View-only (no ability to modify data)
- [ ] JSON export/import works

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18+ with TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Voice (TTS) | OpenAI TTS API (natural voice, cached audio) |
| Voice (STT) | Web Speech API — SpeechRecognition |
| State management | React Context + useReducer (Zustand if complexity warrants) |
| Persistence | localStorage (JSON serialisation) |
| Routing | React Router v6 |
| Deployment | Netlify (static site) |
| PWA | Vite PWA plugin (vite-plugin-pwa) |
| Audio | Howler.js or HTML5 Audio for sound effects |
| Testing | Vitest + React Testing Library |

### 6.2 Project Structure

```
mathcut-studio/
├── public/
│   ├── sounds/               # Sound effects only (chimes, cheers — voice via OpenAI TTS)
│   │   ├── clapperboard.mp3
│   │   ├── cheer.mp3
│   │   ├── correct.mp3
│   │   ├── fanfare.mp3
│   │   └── ...
│   ├── manifest.json         # PWA manifest
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Header.tsx
│   │   ├── voice/
│   │   │   ├── SpeechProvider.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   ├── TTSOutput.tsx          # OpenAI TTS playback
│   │   │   ├── ttsService.ts          # OpenAI TTS API client + cache
│   │   │   └── NumberParser.ts
│   │   ├── visual/
│   │   │   ├── ArrayDisplay.tsx
│   │   │   ├── BlockGroup.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── themes/
│   │   │       ├── DirectorTheme.tsx
│   │   │       ├── BlockWorldTheme.tsx
│   │   │       ├── BrickTheme.tsx
│   │   │       ├── SpaceTheme.tsx
│   │   │       └── MonsterTheme.tsx
│   │   ├── practice/
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── Keypad.tsx
│   │   │   ├── AnswerFeedback.tsx
│   │   │   ├── SessionSummary.tsx
│   │   │   └── TimerBar.tsx
│   │   ├── progress/
│   │   │   ├── StudioLot.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── AwardShelf.tsx
│   │   │   └── StreakCounter.tsx
│   │   ├── parent/
│   │   │   ├── PinEntry.tsx
│   │   │   ├── ParentDashboard.tsx
│   │   │   └── FactBreakdown.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Icon.tsx
│   │       ├── Modal.tsx
│   │       └── AccessibilityToggle.tsx
│   ├── hooks/
│   │   ├── useTTS.ts                  # OpenAI TTS hook
│   │   ├── useSpeechRecognition.ts
│   │   ├── useProgress.ts
│   │   ├── useSession.ts
│   │   └── useLeitner.ts
│   ├── engine/
│   │   ├── leitner.ts         # Spaced repetition logic
│   │   ├── factSelector.ts    # Question selection algorithm
│   │   ├── sessionManager.ts  # Session lifecycle
│   │   ├── discoveryPathway.ts # Scaffolded hint/discovery system
│   │   ├── derivedFacts.ts    # Anchor fact selection + derivation strategies
│   │   └── awards.ts          # Award trigger logic
│   ├── data/
│   │   ├── voiceLines.ts      # All voice line variants
│   │   ├── movieTitles.ts     # Fun titles for each table
│   │   └── awardDefinitions.ts
│   ├── storage/
│   │   └── localStorage.ts    # Serialisation/deserialisation
│   ├── types/
│   │   └── index.ts           # All TypeScript interfaces
│   ├── styles/
│   │   └── fonts.css          # Bebas Neue, Atkinson Hyperlegible, JetBrains Mono, OpenDyslexic
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 6.3 Data Persistence

- All user data stored in `localStorage` under key `mathcut-studio-data`
- Data is JSON-serialised `UserProgress` object
- **Write after every question** (not just end of session) to prevent data loss from browser close
- Version field in stored data for future migration support
- Export/import function available in parent view (JSON download/upload) as backup

### 6.4 PWA Configuration

- Service worker for offline support (app works without internet after first load)
- Add-to-home-screen prompt on second visit
- App icon: clapperboard with a multiplication sign
- Splash screen with studio logo

---

## 7. UI/UX Guidelines

### 7.0 Aesthetic Direction

**Concept: Golden Age Hollywood meets modern dark UI.** The app should feel like stepping onto a real movie set — warm pools of light against dark surroundings, the glamour of a premiere, the tactile physicality of studio equipment. Think art deco marquee signage, velvet curtain textures, brass and gold hardware, spotlights cutting through darkness.

This is NOT a flat, bright, primary-colour kids' app. It's a rich, atmospheric, cinematic world that respects Lincoln's intelligence and taste. Dark backgrounds create focus. Gold accents create prestige. Every screen should feel like a scene Lincoln is directing.

### 7.1 Colour Palette

#### Core colours

| Colour | Hex | CSS Variable | Usage |
|---|---|---|---|
| Midnight | `#0d0d1a` | `--colour-bg-deep` | Deepest background (body, immersive scenes) |
| Deep Navy | `#1a1a2e` | `--colour-bg-primary` | Primary surface background |
| Studio Dark | `#232342` | `--colour-bg-elevated` | Cards, elevated surfaces, modals |
| Backstage Grey | `#2e2e4a` | `--colour-bg-raised` | Keypad buttons, input areas, hover states |
| Warm Gold | `#e6b422` | `--colour-accent-gold` | Primary accent — awards, highlights, CTAs, borders |
| Champagne | `#f5e6a3` | `--colour-accent-gold-light` | Gold hover/glow states, subtle highlights |
| Soft White | `#f5f5f0` | `--colour-text-primary` | Primary text on dark backgrounds |
| Silver Screen | `#b8b8cc` | `--colour-text-secondary` | Secondary text, captions, muted labels |
| Coral Spotlight | `#ff6b6b` | `--colour-cta` | Primary call-to-action buttons |
| Coral Glow | `#ff8a8a` | `--colour-cta-hover` | CTA hover state |
| Director's Teal | `#4ecdc4` | `--colour-success` | Correct answers, success states, progress |
| Amber Stage Light | `#f59e0b` | `--colour-gentle-alert` | Timer bar, gentle nudges (never alarming) |

#### Gradients

| Name | Definition | Usage |
|---|---|---|
| Stage Floor | `linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 100%)` | Body background |
| Spotlight Warm | `radial-gradient(ellipse at 50% 30%, rgba(230,180,34,0.08) 0%, transparent 70%)` | Subtle warm glow behind focal content |
| Spotlight Cool | `radial-gradient(ellipse at 50% 50%, rgba(78,205,196,0.06) 0%, transparent 60%)` | Success state ambient glow |
| Curtain Vignette | `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)` | Edge darkening on immersive screens |
| Gold Shimmer | `linear-gradient(135deg, #e6b422 0%, #f5e6a3 50%, #e6b422 100%)` | Award icons, celebration elements |

#### Surface elevation system

Depth is created through layered backgrounds, not drop shadows alone. Each elevation level uses a progressively lighter background:

- **Level 0** (body): `--colour-bg-deep` with Stage Floor gradient
- **Level 1** (main content area): `--colour-bg-primary`
- **Level 2** (cards, panels): `--colour-bg-elevated` + `1px solid rgba(230,180,34,0.12)` border
- **Level 3** (modals, popovers): `--colour-bg-raised` + `0 8px 32px rgba(0,0,0,0.5)` shadow

#### High-contrast mode

`#000000` background, `#ffffff` text, `#ffff00` accents, `#00ff00` success. All gradients and textures disabled. Borders become 2px solid for visibility.

### 7.2 Typography

**Font stack:** All fonts via Google Fonts, self-hosted in the PWA bundle for offline use.

| Role | Font | Fallback | Why |
|---|---|---|---|
| **Display / headings** | **Bebas Neue** | Impact, sans-serif | Bold condensed uppercase — evokes vintage cinema marquees, movie title cards, and theatre signage. High legibility at large sizes. |
| **Body / questions** | **Atkinson Hyperlegible** | Verdana, sans-serif | Designed by the Braille Institute specifically for maximum legibility. Distinct letterforms (capital I, lowercase l, number 1 are all visually different). Excellent for dyslexic readers without being a "dyslexia font". |
| **Keypad / numbers** | **JetBrains Mono** | Menlo, monospace | Tabular figures ensure numbers align cleanly. Large x-height, distinct 0/O and 1/l differentiation. |
| **Override toggle** | **OpenDyslexic** | — | Available as a user toggle. When enabled, replaces ALL fonts above. Stored in settings, persisted in localStorage. |

| Element | Font | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Screen titles | Bebas Neue | 40–48px | 400 (regular for Bebas) | 0.05em |
| Question display ("7 × 8") | Bebas Neue | 56–72px | 400 | 0.02em |
| Body text / instructions | Atkinson Hyperlegible | 22–26px | 400 | 0.02em |
| Feedback voice lines (on-screen text) | Atkinson Hyperlegible | 24–28px | 700 | 0.01em |
| Keypad numbers | JetBrains Mono | 36–40px | 500 | 0 |
| Answer display (entered number) | JetBrains Mono | 48–56px | 700 | 0 |
| Labels / captions | Atkinson Hyperlegible | 18–20px | 400 | 0.03em |
| Minimum anywhere | — | 18px | — | — |

**Typography rules:**
- Line height: minimum 1.5 for body, 1.2 for display headings
- Maximum line length: 60 characters (per dyslexia guidelines in Section 8.2)
- Never use italics for emphasis — use bold or gold colour
- Left-aligned always — never justified or centred for body text (headings may centre)
- Numbers in questions always rendered in Bebas Neue at display size for maximum visual impact

### 7.3 Layout & Spatial Composition

#### Core layout rules

- Maximum content width: 800px centred for text-heavy screens (settings, parent view)
- **Practice screens and Studio Lot break the container** — these are edge-to-edge immersive experiences
- Generous whitespace — never cramped. Minimum 24px padding on all screen edges
- One primary action per screen — everything else recedes
- No scrolling during practice (everything above the fold)

#### Navigation

- **Mobile/tablet:** Bottom bar with 4 icon-only tabs (Studio Lot, Start Shooting, My Movies, Awards). Active tab highlighted with gold underline. Tab bar background: `--colour-bg-elevated` with a subtle top border in gold
- **Desktop (Yoga 7):** Same bottom bar (not a side rail) for consistency between Lincoln's devices

#### Screen composition — "The Set"

The practice screen is designed as a film set, with clear spatial zones:

```
┌─────────────────────────────────────┐
│  [Wrap]          ● ● ● ● ○ ○ ○ ○  [🔊]  │  ← Film strip: progress shown as
│                                             │    perforated strip with lit/unlit frames
│            ┌──────────────┐                 │
│            │   7  ×  8    │                 │  ← The Scene: question in Bebas Neue,
│            │              │                 │    displayed on a "screen" surface
│            └──────────────┘                 │    with Spotlight Warm gradient behind
│                                             │
│        ┌─── visual array ───┐              │  ← The Stage: array objects animate
│        │  🎬 🎬 🎬 🎬       │              │    into position under warm light
│        │  🎬 🎬 🎬 🎬       │              │
│        │  🎬 🎬 🎬 🎬       │              │
│        └────────────────────┘              │
│                                             │
│         ┌── answer: 56 ──┐                 │  ← Display in JetBrains Mono, large
│         └────────────────┘                 │
│  ┌──────────────────────────────────┐      │
│  │  [🎤 SPEAK]    │ 1 │ 2 │ 3 │    │      │  ← The Console: mic button prominent
│  │                │ 4 │ 5 │ 6 │    │      │    (~75%), keypad always visible (~25%)
│  │                │ 7 │ 8 │ 9 │    │      │    Dark raised surface, gold key borders
│  │                │ ⌫ │ 0 │ ✓ │    │      │
│  └──────────────────────────────────┘      │
└─────────────────────────────────────┘
```

#### Immersive screens

- **Studio Lot (home):** Full-bleed illustrated scene. No container constraint. Curtain Vignette gradient around edges. Tappable buildings glow with Spotlight Warm on hover/focus
- **Movie cards:** Displayed as physical poster cards — `--colour-bg-elevated` background, 8px border-radius, subtle `perspective(800px) rotateY(-2deg)` tilt at rest, straightens on hover with a gold border glow. Feels like browsing posters in a lobby
- **Award shelf:** Rendered as a physical trophy cabinet — horizontal wooden shelf texture (CSS gradient), trophies sit on it with soft downward shadow, a warm backlight glow behind each trophy

### 7.4 Animation & Cinematic Motion

**Framer Motion** is the primary animation library. All timings are suggestions — the key is that motion feels **cinematic and intentional**, not bouncy or app-like.

#### Screen transitions

| Transition | Animation | Timing |
|---|---|---|
| Screen entrance | "Curtain rise" — content slides up from bottom with slight overshoot, opacity 0→1 | 400ms, `ease: [0.22, 1, 0.36, 1]` (custom cubic-bezier) |
| Screen exit | Fade down + slight scale (1.0→0.97) | 250ms ease-in |
| Between questions | Clapperboard wipe — a dark bar sweeps horizontally across (like a clapperboard closing), brief hold (100ms), new question revealed | 500ms total |

#### Micro-interactions

| Moment | Animation | Details |
|---|---|---|
| Question appears | Question text types in character-by-character (Bebas Neue, gold colour) while TTS speaks | 60ms per character, staggered |
| Visual array loads | Objects fall/float into position in staggered sequence (first row, then second, etc.) | 50ms delay between each object, 300ms per object (spring physics) |
| Correct answer | Spotlight sweep — a bright radial gradient sweeps across the screen L→R, then the answer display pulses teal with a brief scale-up (1.0→1.05→1.0) | 600ms sweep, 300ms pulse |
| Incorrect answer | Gentle camera shake (2px horizontal wobble, 2 cycles) — subtle, not aggressive | 300ms, ease-out |
| Keypad button press | Button depresses (translateY +2px, shadow reduces), brief gold flash on border | 100ms down, 100ms up |
| Mic listening | Pulsing gold ring around mic button, expanding/contracting. Subtle waveform bars animate inside the button | Continuous loop, 1.5s cycle |

#### Celebrations

| Moment | Animation | Details |
|---|---|---|
| Session complete | "That's a wrap" — clapperboard snaps shut centre-screen (SVG animation), holds 500ms, opens to reveal summary | 1.2s total |
| Table mastered | Premiere sequence — spotlight beams sweep, gold confetti particles rain down, a marquee banner unfurls with the movie title | 2.5s, layered sequence |
| Award unlocked | Trophy rises from below screen, spotlight illuminates it, gold particle burst radiates outward, then trophy settles onto shelf | 2s |
| Studio lot level-up | New building fades in with a construction dust effect (particle puff), then a warm light turns on inside | 1.5s per building |

#### Loading states

- Film reel: a circular SVG reel rotates with intermittent flicker (opacity dips to 0.7 every 400ms, simulating old projector)
- Never a generic spinner

#### `prefers-reduced-motion` behaviour

When enabled: all particle effects disabled, celebrations use simple opacity fades, screen transitions become instant crossfades (200ms opacity), clapperboard wipe replaced with simple fade. Micro-interactions reduced to colour changes only (no movement). The app still feels rewarding — just quieter.

### 7.5 Sound Design

| Event | Sound | Duration |
|---|---|---|
| Question appears | Soft clapperboard snap | 0.5s |
| Correct answer | Cheerful chime + brief crowd cheer | 1.5s |
| Incorrect answer | Gentle "cut" buzzer (warm tone, not harsh) | 0.5s |
| Session complete | Cinematic fanfare (brass + strings) | 2s |
| Award unlock | Orchestral sting + sustained applause | 3s |
| Action Scene question | Dramatic bass sting | 0.5s |
| Button tap | Soft mechanical click (typewriter-esque) | 0.1s |
| Keypad press | Tactile "clack" (distinct from button tap — heavier, lower pitch) | 0.1s |
| Studio lot level-up | Construction sounds (brief hammer, saw) then a "ding" of completion | 2s |

**Audio rules:**

- Voice lines generated via OpenAI TTS API. Sound effects are separate royalty-free audio assets
- **Audio ducking:** When TTS is speaking, all sound effects reduce to 30% volume. TTS always takes priority
- **Ambient option (off by default):** Subtle projector room hum — a warm, low-frequency loop that plays softly in the background during practice. Toggle in settings. Volume: barely perceptible (10–15% of effect volume)
- All sounds mutable via a speaker icon toggle in the header
- Sound effect files: MP3 with OGG fallback, all under 100KB each
- Use royalty-free sound effects for all non-voice audio

### 7.6 Backgrounds & Atmosphere

The cinema theme should be felt, not just referenced in text. Every screen has atmospheric depth.

#### Film grain overlay

A subtle noise texture overlays all screens to evoke the look of projected film:

```css
.film-grain::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* tiny noise SVG */
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: overlay;
}
```

- Opacity: 0.03 (barely perceptible — felt more than seen)
- Disabled when `prefers-reduced-motion` is active
- Disabled in high-contrast mode

#### Vignette

All screens have a soft edge darkening using the Curtain Vignette gradient (see 7.1). This draws the eye inward and reinforces the "looking at a screen/stage" feeling.

#### Spotlight effects

- The active content area (question, array) sits under a warm Spotlight Warm gradient — a soft elliptical glow that makes the focal point feel lit
- On correct answers, the spotlight briefly intensifies and shifts teal
- The Studio Lot scene uses multiple small spotlights on buildings to create depth

#### Texture elements

- Dividers between sections: a subtle gold rule with slight gradient fade at the ends (not a flat line)
- Card borders: 1px with `rgba(230,180,34,0.12)` — just enough gold to catch the eye
- The keypad area ("The Console") has a slightly different background (`--colour-bg-raised`) to feel like a separate physical surface — as if Lincoln is operating real equipment

### 7.7 Component Design Language

Every component should feel like it belongs on a movie set — tactile, purposeful, slightly dramatic.

#### Buttons

- **Primary CTA ("Start Shooting", "Submit"):** `--colour-cta` background, rounded (12px border-radius), slightly raised with `box-shadow: 0 4px 0 #cc4444, 0 6px 16px rgba(0,0,0,0.3)`. On press: shadow collapses, button shifts down 4px. Gold 1px border. Text in Bebas Neue uppercase
- **Secondary ("Wrap", "My Movies"):** Ghost style — transparent background, 1px gold border, gold text. On hover: fill with `rgba(230,180,34,0.1)`
- **Keypad buttons:** `--colour-bg-raised` background, 1px gold border at 20% opacity, 8px border-radius. Numbers in JetBrains Mono. On press: brief gold flash on border (opacity 0.2→0.6→0.2). Minimum 64×64px touch targets
- **Microphone button:** Oversized circle (80px diameter), `--colour-cta` background, pulsing gold ring when listening. Contains a mic icon. Positioned left of the keypad to give it ~75% visual weight

#### Cards (Movie Posters, Awards)

- Background: `--colour-bg-elevated`
- Border: 1px `rgba(230,180,34,0.12)`
- Border-radius: 12px
- Inner padding: 20px
- Subtle inner glow: `box-shadow: inset 0 1px 0 rgba(245,230,163,0.05)`
- Hover/focus: gold border brightens to 40% opacity, card lifts with `translateY(-2px)` and increased shadow

#### Progress indicators

- **Session progress (film strip):** Horizontal row of small rectangles (12×16px) resembling film strip frames. Completed frames are filled with `--colour-accent-gold`, upcoming frames are `--colour-bg-raised` with a subtle border. The strip has "perforation" dots (tiny circles) above and below, like real film
- **Mastery progress bars:** Rounded bars, `--colour-bg-raised` track, `--colour-success` fill. No percentage number shown — the visual fill is enough. The bar has a subtle animated shimmer on the filled portion (a moving highlight)

#### Icons

- Line-art style, 2px stroke weight, `--colour-text-secondary` default colour
- Cinema-themed wherever possible: clapperboard for sessions, film reel for loading, spotlight for focus, megaphone for voice, star for awards, curtain for wrap
- Active/selected states: icon colour shifts to `--colour-accent-gold`
- All icons have `aria-label` attributes for accessibility

#### The Console (Keypad Area)

The keypad is styled as a director's control panel:

- Distinct surface: `--colour-bg-raised` background with a 1px top border in gold (10% opacity) — visually separating it as a different "piece of equipment"
- Keys arranged in a 3×4 grid + mic button to the left
- Subtle recessed look: `box-shadow: inset 0 2px 4px rgba(0,0,0,0.2)` on the container
- The submit key (✓) uses `--colour-success` background to stand out
- The backspace key (⌫) is muted — same styling as number keys, not highlighted

---

## 8. Accessibility Requirements

### 8.1 Core Requirements (WCAG 2.1 AA where applicable)

- Colour contrast ratio: minimum 4.5:1 for text, 3:1 for large text
- All interactive elements have minimum 48×48px touch target
- Focus indicators visible on all interactive elements (keyboard navigation)
- All images/icons have descriptive `aria-label` attributes
- Skip-to-content link for keyboard users
- Semantic HTML throughout (`<main>`, `<nav>`, `<button>`, `<h1>`–`<h3>`)

### 8.2 Dyslexia-Specific

- OpenDyslexic font toggle (stored in settings, persisted)
- No justified text — always left-aligned
- Line spacing minimum 1.5
- Letter spacing minimum 0.05em
- No italics for emphasis (use bold or colour instead)
- Maximum line length: 60 characters

### 8.3 ADHD-Specific

- Minimal visual clutter on question screens
- Clear visual hierarchy — one thing demands attention at a time
- Progress indicator always visible (how many questions left)
- No autoplay background animations that compete with the task

### 8.4 Motor Accessibility

- Large touch targets (64px recommended)
- No drag-and-drop required for core functionality (optional in "Build it" mode only)
- No fine motor precision needed
- Long-press not required for any action

---

## 9. MVP Scope vs Future Iterations

### 9.1 MVP (Version 1.0)

**Must have:**

- [ ] Voice system (OpenAI TTS + STT with keypad as first-class input)
- [ ] Visual array display with Director's Set theme
- [ ] Rehearsal mode
- [ ] Take mode (progressive challenge)
- [ ] Leitner box spaced repetition engine
- [ ] Studio lot home screen (static illustrations, 3–4 levels minimum)
- [ ] Per-table movie tracker
- [ ] 5 awards
- [ ] Streak tracking
- [ ] Settings: speech rate, OpenDyslexic font toggle, high contrast
- [ ] Parent view (long-press access, no PIN)
- [ ] localStorage persistence
- [ ] Responsive design (iPhone 11 Safari + Yoga 7 Chrome touchscreen)
- [ ] PWA manifest and service worker
- [ ] Netlify deployment configuration

**Should have (MVP stretch):**

- [ ] Action Scene mode
- [ ] Director's Cut mode
- [ ] 2 additional visual themes
- [ ] 10 awards
- [ ] Sound effects
- [ ] Studio lot with all 10 levels animated
- [ ] Data export/import in parent view

### 9.2 Version 2.0 (Future)

- **Conversational AI voice:** Replace pre-written voice lines with live AI-generated responses for a more dynamic, conversational experience (Option B from scoping)
- Custom avatar/character builder ("Create your director character")
- Record your own voice for questions
- Multiplayer challenge mode ("Box office showdown" — compare progress)
- Parent email notifications for milestones
- AI-generated story problems using movie scenarios ("You're filming a scene with 7 actors. Each actor needs 6 costumes...")
- Division mode ("The Sequel" — reverse multiplication)
- Additional facts beyond 12×12 for advanced learners
- Cloud sync (optional account creation)

---

## 10. Success Metrics

### 10.1 Engagement Metrics (tracked in localStorage, visible in parent view)

| Metric | Target |
|---|---|
| Sessions per week | 3+ |
| Average session duration | 5–8 minutes |
| Return rate (sessions in 7-day window) | 3+ |
| Streak length | 5+ days average |
| Voice input usage | >50% of answers |

### 10.2 Learning Metrics

| Metric | Target |
|---|---|
| Facts reaching Box 3+ within 2 weeks | 50+ |
| Facts reaching Box 5 within 6 weeks | 80+ |
| Fading rate (Box 5 facts demoting) | <15% |
| Time per fact (Box 4+) | <5 seconds |
| Accuracy in Action Scene mode | >85% |

### 10.3 Qualitative Success

- Lincoln voluntarily opens the app (not asked to)
- Lincoln talks about his "studio" or "movies" to others
- Lincoln's school reports improvement in multiplication recall
- Lincoln uses voice input comfortably (the default, not the fallback)

---

## Appendix A: Screen-by-Screen Walkthrough

### A.1 First Launch

1. **Welcome screen:** "Welcome to MathCut Studio!" (spoken aloud). Animated studio gate opening. Two buttons: large "Start Directing" icon-button. (Parent view accessed via long-press on studio logo — no visible button needed.)
2. **Name confirmation:** "Hey there, Lizard Linc! Ready to build your studio?" (spoken). This is hard-coded for Lincoln — no name input needed.
3. **Microphone permission:** "A great director needs to be heard! Can I turn on your microphone?" Friendly illustration of a microphone. System permission prompt triggered.

4. **Quick tutorial:** 3-screen walkthrough (swipeable, auto-advancing with voice narration):
   - "I'll ask you questions — out loud!" (shows speaker icon)
   - "You can answer with your voice or tap the numbers" (shows mic + keypad)
   - "Watch the blocks to see how multiplication works" (shows sample array)
5. **Studio lot (empty):** "Here's your studio lot. It's empty now, but as you master your times tables, you'll build an amazing studio. Ready for your first take?"

### A.2 Home Screen (Studio Lot)

- Animated studio lot illustration (current level)
- Streak counter top-left ("Day 5 on set")
- Settings gear icon top-right
- "Start Shooting" primary CTA button (large, centre-bottom)
- "My Movies" button (grid of table cards)
- "Awards" button (trophy icon)
- Parent view: long-press studio logo (no visible button)

### A.3 Mode Selection

After tapping "Start Shooting":
- "Which movie are you working on today?" (spoken)
- Grid of movie poster cards (one per table, 2×–12×)
- Each card shows production status icon
- "Surprise Me" card (auto-selects based on spaced repetition)
- After selecting table(s): "How do you want to shoot today?"
  - Rehearsal icon (clapperboard with "easy" badge)
  - Take icon (clapperboard with take number)
  - Action Scene icon (explosion graphic) — greyed out if no Box 4+ facts in selected table
  - Director's Cut icon (film reel) — always available after 3+ sessions

### A.4 Practice Screen

- **Top:** Progress dots (• • • ● • • • •) showing position in session
- **Centre-top:** Question in large text + spoken ("7 × 8")
- **Centre:** Visual array (animated in)
- **Centre-bottom:** Answer display area (shows recognised speech or keypad input)
- **Bottom:** Microphone button (large, ~75% prominence) + Keypad (compact but always visible, ~25% prominence)
- **Top-right:** "Wrap" button (end session) + volume toggle

### A.5 Session Summary

- "That's a wrap on today's shoot!" (spoken)
- Recap cards showing each question:
  - Green glow = correct first time
  - Gold glow = correct on a retry
  - Blue glow = learned something new (shown the answer)
- No red. No "wrong" count. No percentage score displayed.
- "Scenes completed: 10" and "New personal bests: 3"
- "Back to Studio" button
- If milestone reached: celebration animation before summary

---

## Appendix B: Error States

| Situation | Handling |
|---|---|
| **Browser doesn't support SpeechRecognition** | Hide mic button, show keypad prominently, display small icon-tooltip "Voice input unavailable on this browser" |
| **OpenAI TTS API unreachable** | Fall back to Web Speech API (browser-native TTS) as degraded experience. Show text in larger font if both fail. |
| **Microphone permission denied** | Friendly message: "No worries! You can answer by tapping instead." Hide mic button. Show settings option to try again. |
| **Speech recognition returns no result** | "I didn't catch that — try again or tap the number" (spoken + shown) |
| **Speech recognition returns wrong number** | Show recognised number and ask "Did you say [number]?" with yes/no buttons |
| **localStorage full** | Show warning in parent view. Offer data export (JSON) before clearing old sessions. Never auto-delete. |
| **localStorage unavailable (private browsing)** | App works but with session-only memory. Warning: "You're in private mode — your progress won't be saved between sessions." |
| **Offline (no internet)** | App works fully (PWA). Show small "offline" indicator. |
| **Screen too small (<320px wide)** | Warning message: "Your screen is a bit small for the studio. Try a bigger device for the best experience." |

---

## Appendix C: Voice Line Variants

Each category should have at minimum 5–8 variants to prevent repetition fatigue. Examples:

### Correct answer variants:
1. "Cut! That's a perfect take!"
2. "Nailed it, Director!"
3. "Brilliant — moving on to the next scene!"
4. "And that's how it's done. Next!"
5. "The audience is going to love that!"
6. "Absolutely perfect. You're on fire today!"
7. "That's a keeper! Print it!"
8. "Standing ovation for that one!"

### Incorrect answer variants:
1. "Hmm, not quite. It's actually [answer]. We'll come back to this scene."
2. "Close! The answer is [answer]. Let's try another take later."
3. "That's okay — [answer] is the one we're looking for. Even the best directors need multiple takes."
4. "The script says [answer]. Don't worry, we'll rehearse this one again."
5. "Let me check the script... it's [answer]. No stress, Director."

### Session start variants:
1. "Welcome to the set, Director! Ready to roll?"
2. "Lights, camera... let's go, Lizard Linc!"
3. "The crew is ready. Action!"
4. "Another day at the studio! Let's make some movie magic."
5. "Alright Director, the camera's rolling!"

### Discovery Pathway variants:

**Level 2 — Strategy prompt:**
1. "Do you know a fact that's close to this one?"
2. "Think about a table you already know — could it help?"
3. "Is there a shortcut hiding in this one?"
4. "What do you already know that might get you there?"
5. "Think like a director — what's your angle on this one?"

**Level 3 — Anchor fact:**
1. "You know that [anchor]. Can you work it out from there?"
2. "Here's a clue: [anchor]. What's one more group?"
3. "[anchor] — you've got that nailed. Now just add [extra]."
4. "Start from [anchor] and build up."
5. "Your [table]s are solid. Use them!"

**Level 4 — Guided derivation:**
1. "Let's build this together. Watch the blocks."
2. "Step by step, Director. First: [anchor fact]..."
3. "Here's how the crew would do it..."
4. "Let me show you the trick for this one."
5. "Follow along — this one's easier than it looks."

**Level 5 — Guided counting:**
1. "Let's count it out together. Tap each row!"
2. "Count with me, Director. Tap the first row."
3. "One row at a time — you've got this."
4. "Tap and count. The blocks will do the rest."
5. "Let's walk through it. Start at the top!"

**Level 5 — Completion:**
1. "You counted every single one. [a] times [b] is [product]!"
2. "And there it is! [product]. You figured it out."
3. "That's a wrap! [product] — and you found it yourself."
4. "[product]! See? You didn't need me to tell you."
5. "Director, you just directed that answer into existence. [product]!"

**Level 6 — Full reveal:**
1. "[a] times [b] is [product]. See how it breaks down? [derivation]."
2. "The answer is [product]. Here's why: [derivation]."
3. "[product]. And now you know the trick — [strategy description]."
4. "It's [product]. We'll rehearse this one again — every great scene takes a few takes."
5. "[product]. Don't worry, Director — this one'll click next time."

**Discovery success (answered correctly during pathway):**
1. "That's the one! You figured it out."
2. "Brilliant detective work, Director!"
3. "See? You had it in you all along."
4. "You used what you already knew. That's how the pros do it."
5. "Now THAT'S a director who solves their own problems!"

---

## Appendix D: Fact Selection Algorithm

### For Rehearsal and Take modes (single table selected):

```
1. Get all facts for selected table (e.g., 7×1 through 7×12)
2. Sort by priority:
   a. Facts in "fading" state (Box 5 but >7 days since review)
   b. Facts with high recentMisses (struggling but NOT demoted)
   c. Facts in Box 1 (new) — limit to 3 new facts per session
   d. Facts in Box 2
   e. Facts in Box 3
   f. Facts in Box 4–5 (maintenance review)
3. Select [sessionLength] facts from sorted list
4. Shuffle selected facts (don't present in order)
5. Ensure no fact appears twice consecutively
6. PRESENTATION MODE per fact:
   - Box 1 or recentMisses ≥ 2: "Build It" mode (Lincoln constructs the array)
   - Box 2: Full pre-built array with all interactions
   - Box 3: Partial array with skip-count interaction
   - Box 4: Minimal hint (small expandable array icon)
   - Box 5: Number only
7. WITHIN-SESSION RETRY: If a fact triggers the Discovery Pathway, move on
   to a different (easier) fact. Queue the missed fact for a retry at least
   3 questions later (giving the pathway time to settle in memory). On
   retry, start with the array in "Build It" mode regardless of box level.
8. FRUSTRATION GUARD: If the same fact triggers Discovery Pathway twice in
   one session, skip it for the rest of the session. Queue for next session
   with increased review frequency (recentMisses++).
```

### For Director's Cut mode (all tables):

```
1. Get all 144 facts
2. Filter to only facts that have been attempted at least once
3. Sort by priority:
   a. Fading facts (any table)
   b. Box 1 facts (struggling across all tables)
   c. Box 2 facts
   d. Random sampling from Box 3–5 (weighted: Box 3 = 3×, Box 4 = 2×, Box 5 = 1×)
4. Select 12–15 facts ensuring spread across at least 3 different tables
5. Shuffle and present
```

### For Action Scene mode:

```
1. Get all facts in Box 4 or Box 5
2. If fewer than 10 facts qualify: show message "You need to master more facts first!"
3. Randomly select 15–20 facts
4. Present in random order with 8-second response window
5. Track response time for personal best calculation
```

---

_End of document. This PRD is ready for development._
