# Decide.ai — Architecture Document
> Version 1.0 | Product Architect: Senior AI Session

---

## 1. Platform & Framework

| Layer | Technology |
|---|---|
| Framework | **Expo (React Native)** — managed workflow |
| Target Platforms | iOS 16+ / Android 13+ |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router (file-based, v3+) |

---

## 2. Technical Stack

### UI & Styling
- **NativeWind v4** — Tailwind CSS utility classes for React Native
- **Lucide React Native** — icon system (consistent, lightweight, tree-shakeable)
- **React Native Reanimated v3** — gesture-driven and physics-based animations
- **Expo Haptics** — tactile feedback on key decisions

### Backend & Auth
- **Supabase** — PostgreSQL database, real-time subscriptions, Row-Level Security
- **Supabase Auth** — Apple Sign-In + Google Sign-In (OAuth2)
- **Supabase Edge Functions** — serverless AI processing calls
- **AsyncStorage / MMKV** — local caching for offline decision history

### AI Engine
- **Provider:** OpenAI GPT-4o (via Supabase Edge Function proxy)
- **Fallback:** Anthropic Claude Haiku (cost-optimized fallback)

---

## 3. Visual Identity — "Calm Tech"

> Design philosophy: Reduce cognitive load. Guide the user to clarity through silence and precision.

### Color Palette
```
Background:     #000000  — Pure deep black (OLED-optimized)
Surface:        #0A0A0A  — Card/glass base
Glass overlay:  rgba(255,255,255,0.06) — Glassmorphism layer
Border:         rgba(255,255,255,0.10) — Subtle glass borders
Accent primary: #3B82F6  — Neon blue (Tailwind blue-500)
Accent glow:    #60A5FA  — Soft blue glow for active states
Text primary:   #F9FAFB  — Near white
Text secondary: #6B7280  — Muted gray
Danger:         #EF4444  — Red (for conflicting options)
Success:        #10B981  — Green (for confirmed decision)
```

### Typography
- **Primary font:** SF Pro Display (iOS) / Roboto (Android) via `expo-font`
- **Headings:** SF Pro Display, weight 700, tracked slightly loose
- **Body:** SF Pro Text, weight 400
- **Decision output:** SF Pro Display, weight 800, large — the "verdict" must feel authoritative

### Glassmorphism Recipe
```css
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.10);
backdrop-filter: blur(20px);
border-radius: 24px;
```

---

## 4. AI Engine — Elimination Heuristics

### Philosophy
The AI does NOT present pros and cons. It **eliminates** uncertainty and delivers **one final decision** with psychological reinforcement.

### Processing Pipeline

```
User Input (dilemma text + optional options array)
        ↓
[Stage 1] Context Extraction
  — Identify: emotional weight, time sensitivity, reversibility
        ↓
[Stage 2] Elimination Heuristics
  — Apply: Regret Minimization Framework
  — Apply: 10/10/10 Rule (10 min / 10 months / 10 years impact)
  — Apply: Values Alignment Check (user's stated priorities)
        ↓
[Stage 3] Decision Synthesis
  — Output: Single chosen option (no hedging)
  — Output: 1-sentence psychological affirmation
  — Output: Confidence score (internal, shown as visual intensity)
        ↓
[Stage 4] Delivery
  — Haptic: Heavy impact on verdict reveal
  — Animation: Card flip / glow pulse
  — Copy: "You already knew this. Now you can act."
```

### System Prompt Core (Edge Function)
```
You are Decide.ai — a calm, decisive intelligence. Your only job is to eliminate 
indecision. Analyze the user's dilemma. Apply elimination heuristics. 
Return EXACTLY ONE decision with ONE affirming sentence. Never hedge. 
Never say "it depends." The user needs clarity, not analysis.
```

### Response Schema (JSON)
```json
{
  "decision": "string — the chosen option or action",
  "affirmation": "string — 1 psychological reassurance sentence",
  "confidence": 0.0–1.0,
  "reasoning_hidden": "string — internal reasoning (not shown to user)"
}
```

---

## 5. App Structure (Expo Router)

```
app/
  _layout.tsx          — Root layout, auth gate, theme provider
  index.tsx            — Main screen (Decide screen)
  history.tsx          — Past decisions
  onboarding.tsx       — First-time user flow
  settings.tsx         — Preferences, account

components/
  DecideButton.tsx     — The core CTA button
  DilemmaInput.tsx     — Text input for the dilemma
  VerdictCard.tsx      — Animated result card (glassmorphism)
  OptionPill.tsx       — Optional choice tags

lib/
  supabase.ts          — Supabase client init
  ai.ts                — AI engine call (Edge Function)
  haptics.ts           — Haptic feedback helpers

constants/
  colors.ts            — Full color palette
  typography.ts        — Font scale

hooks/
  useDecision.ts       — Decision state + API logic
  useAuth.ts           — Auth state
```

---

## 6. Key Non-Functional Requirements

| Requirement | Target |
|---|---|
| Cold start time | < 2 seconds |
| AI response time | < 3 seconds (with skeleton loader) |
| Offline support | Last 10 decisions cached locally |
| Accessibility | WCAG AA contrast, haptic alternatives |
| Bundle size | < 5 MB initial JS bundle |
