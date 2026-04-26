# Decide.ai — Project Memory for Cursor AI
> This file is the single source of truth for AI-assisted development.
> Read this before writing any code. Follow every rule without exception.

---

## Project Identity

- **App name:** Decide.ai
- **Purpose:** Eliminate decision fatigue. Deliver one clear answer, fast.
- **Framework:** Expo (React Native) + TypeScript + Expo Router
- **Backend:** Supabase (auth + database + edge functions)
- **AI Provider:** OpenAI GPT-4o via Supabase Edge Function

---

## Core Coding Rules

### General
- All code is **TypeScript strict** — no `any`, no implicit types
- Components are **functional only** — no class components
- Every file has a **single responsibility** — one component, one hook, one utility
- Exports are **named** (not default) except for Expo Router screen files
- No inline styles — use **NativeWind classes only**
- All magic numbers go into `constants/` — never hardcode colors, sizes, or timing values

### File Naming
```
Components:    PascalCase.tsx         → DecideButton.tsx
Hooks:         camelCase.ts           → useDecision.ts
Utilities:     camelCase.ts           → haptics.ts
Screens:       lowercase.tsx          → index.tsx (Expo Router convention)
Constants:     camelCase.ts           → colors.ts
```

### Performance Rules
- Use `React.memo()` on all pure display components
- Use `useCallback()` for all event handlers passed as props
- Use `useMemo()` for derived state computations
- Animations run on the **UI thread** — always use `useAnimatedStyle` from Reanimated, never `setNativeProps`
- Avoid re-renders: split state into the smallest possible scope

---

## UI / UX Rules

### The 2-Interaction Rule
> **The user must reach their decision result in maximum 2 interactions.**
> Interaction 1: Enter dilemma (or tap a quick option)
> Interaction 2: Tap DECIDE

No confirmation dialogs. No multi-step wizards. No onboarding gates before first use.

### Haptic Feedback — Required Events
| Event | Haptic Type |
|---|---|
| DECIDE button pressed | `Haptics.impactAsync(Heavy)` |
| Verdict revealed | `Haptics.notificationAsync(Success)` |
| Option pill selected | `Haptics.impactAsync(Light)` |
| Error / conflict | `Haptics.notificationAsync(Error)` |
| Navigation tap | `Haptics.selectionAsync()` |

### Animation Standards
- All transitions: **duration 300–500ms**, easing `Easing.out(Easing.cubic)`
- Verdict reveal: **card flip** or **scale + opacity** entrance — never a plain fade
- Button press: **scale to 0.96** on press-in, back to 1.0 on release
- Skeleton loaders for every async state — no blank screens, no spinners

### Visual Rules
- Dark mode only — no light mode support in v1
- Background is always `#000000` — never deviate
- All cards use glassmorphism (see ARCHITECTURE.md recipe)
- Neon blue accent `#3B82F6` for primary actions only — not decorative

---

## AI Engine Rules

- AI calls are made **server-side only** via Supabase Edge Functions — never expose API keys in the client
- The AI response must be **parsed and validated** against the JSON schema before displaying
- If AI fails: show a graceful fallback — "Take a breath. Try again." — with retry button
- Never show raw AI errors to the user
- Decision history is stored in Supabase `decisions` table with user_id, timestamp, input, and verdict

---

## What Cursor Should NOT Do

- ❌ Do not add light mode styles or theme toggles
- ❌ Do not add "loading..." text — use skeleton components instead
- ❌ Do not use `StyleSheet.create()` — NativeWind only
- ❌ Do not add unnecessary navigation steps to reach the main decision flow
- ❌ Do not add ads, upsells, or rating prompts in v1
- ❌ Do not use `console.log` in production code — use a logger utility
- ❌ Do not hallucinate Supabase schema — always check `lib/supabase.ts` for existing tables

---

## Supabase Schema (Reference)

```sql
-- Users extended profile
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decision history
CREATE TABLE decisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  input_text TEXT NOT NULL,
  options JSONB,
  verdict TEXT NOT NULL,
  affirmation TEXT,
  confidence FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Current Sprint Focus

> When in doubt about what to build next, check TODO.md.
