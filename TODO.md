# Decide.ai — TODO & Build Checklist

> Tento soubor je tvůj průvodce od nuly k fungující aplikaci.
> Odškrtávej postupně. Nepřeskakuj kroky.

---

## FÁZE 0 — Příprava prostředí

- [ ] Nainstaluj Node.js LTS (v20+): https://nodejs.org
- [ ] Nainstaluj Expo CLI globálně: `npm install -g expo-cli`
- [ ] Nainstaluj aplikaci **Expo Go** na svůj telefon (iOS/Android)
- [ ] Vytvoř účet na https://supabase.com (free tier stačí)
- [ ] Vytvoř účet na https://platform.openai.com (pro API klíč)

---

## FÁZE 1 — Inicializace projektu

- [ ] Otevři terminál ve složce `decide ai`
- [ ] Spusť inicializaci Expo projektu:
  ```bash
  npx create-expo-app@latest .
  ```
  > Vyber šablonu: **Blank (TypeScript)**

- [ ] Spusť projekt a ověř, že běží:
  ```bash
  npx expo start
  ```
  > Naskenuj QR kód v Expo Go aplikaci na telefonu

- [ ] Nainstaluj základní závislosti:
  ```bash
  npx expo install nativewind react-native-reanimated expo-haptics
  npm install lucide-react-native
  npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
  ```

- [ ] Nastav NativeWind v `tailwind.config.js` a `babel.config.js` dle dokumentace

---

## FÁZE 2 — Hlavní obrazovka (App.js / index.tsx)

- [ ] Vytvoř soubor `constants/colors.ts` s celou paletou barev z ARCHITECTURE.md
- [ ] Nastav pozadí aplikace na `#000000`
- [ ] Postav základní layout hlavní obrazovky:
  - [ ] Logo / název "decide." nahoře (small, subtle)
  - [ ] `DilemmaInput` — velké textové pole uprostřed
    - Placeholder: *"What's on your mind?"*
    - Glassmorphism styl, zaoblené rohy 24px
  - [ ] `DecideButton` — dominantní modré tlačítko dole
    - Text: **"DECIDE"**
    - Na stisk: haptic Heavy + animace scale
  - [ ] `VerdictCard` — skrytá, zobrazí se po AI odpovědi
    - Glassmorphism karta s verdiktem a afirmací

---

## FÁZE 3 — Supabase připojení

- [ ] Vytvoř nový projekt v Supabase dashboard
- [ ] Zkopíruj `Project URL` a `anon key` do `.env`:
  ```
  EXPO_PUBLIC_SUPABASE_URL=your_url
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
  ```
- [ ] Vytvoř soubor `lib/supabase.ts` s inicializací klienta
- [ ] Spusť SQL z CLAUDE.md pro vytvoření tabulek `profiles` a `decisions`
- [ ] Nastav Apple Sign-In a Google Sign-In v Supabase Auth > Providers

---

## FÁZE 4 — AI Engine

- [ ] Vytvoř Supabase Edge Function `decide`:
  ```bash
  supabase functions new decide
  ```
- [ ] Implementuj volání OpenAI GPT-4o s system promptem z ARCHITECTURE.md
- [ ] Ošetři JSON response schema (decision, affirmation, confidence)
- [ ] Přidej fallback při chybě AI
- [ ] Nasaď funkci: `supabase functions deploy decide`

---

## FÁZE 5 — Historie rozhodnutí

- [ ] Vytvoř obrazovku `history.tsx`
- [ ] Zobraz seznam posledních rozhodnutí z Supabase
- [ ] Každá položka: datum, zkrácený vstup, výsledný verdikt
- [ ] Offline cache posledních 10 rozhodnutí přes AsyncStorage

---

## FÁZE 6 — Polish & Launch prep

- [ ] Přidej splash screen (Expo Splash Screen)
- [ ] Nastav app ikonu (1024x1024px, `#000000` pozadí, modré logo)
- [ ] Otestuj na fyzickém iOS i Android zařízení
- [ ] Zkontroluj všechny haptic eventy dle CLAUDE.md
- [ ] Build preview: `npx expo build` nebo EAS Build
- [ ] Připrav App Store / Google Play listing

---

## Poznámky

- Vždy pracuj v branchi, nikdy přímo v `main`
- Po každé funkční části commitni: `git commit -m "feat: popis"`
- Pokud si nevíš rady, otevři CLAUDE.md — jsou tam pravidla pro Cursor AI

---

*Poslední aktualizace: nastavení projektu — Fáze 0*
