# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Meus Hábitos" — a client-only daily habit tracker (React 18 + TypeScript + Vite, tests with Vitest). No backend: all data lives in the browser's `localStorage`. UI text, code comments and test names are in Brazilian Portuguese; keep new ones in Portuguese too.

## Commands

```bash
npm install
npm run dev                                   # dev server at http://localhost:5173
npm test                                      # vitest run (all tests)
npx vitest run src/lib/streaks.test.ts        # single test file
npx vitest run -t "currentStreak"             # tests matching a name
npm run build                                 # tsc -b type-check, then vite build to dist/
```

There is no linter; `tsc -b` (strict, `noUnusedLocals`, `noUnusedParameters`) is the static check and runs as part of `npm run build`.

## Architecture

- **Data model** (`src/types.ts`): a `Habit` stores `completions` as a sorted array of `'YYYY-MM-DD'` strings and `createdAt` in the same format. Days are compared as plain strings (lexical order == chronological order).
- **Dates** (`src/lib/dates.ts`): all day keys are in the user's *local* timezone. Never use `toISOString()` for day keys (it converts to UTC and shifts the day at night) — use `toKey`/`fromKey`/`addDays`/`todayKey`. Display formatting uses `Intl` with `pt-BR`.
- **Pure logic** (`src/lib/streaks.ts`): `currentStreak` counts back from today, but starts from yesterday if today isn't marked yet (a streak only breaks after the day ends). `completionRate` ignores days before `createdAt`. These functions take `today` as a parameter so they stay testable.
- **Persistence** (`src/lib/storage.ts`): single key `habit-tracker:v1`. `loadHabits` validates each entry and silently drops invalid ones; corrupt JSON yields `[]`. When adding a field to `Habit`, make `isHabit` tolerate its absence and backfill a default in `loadHabits` (see how `emoji` falls back to `DEFAULT_EMOJI`) so older saved data still loads.
- **State** (`src/hooks/useHabits.ts`): `useHabits` is the only owner of habit state; it saves to storage on every change. `toggleCompletion` refuses future days and moves `createdAt` back if a day before creation is marked. `useToday` re-checks the date every minute and on tab visibility change, so components should take `today` as a prop rather than calling `todayKey()` themselves.
- **UI** (`src/App.tsx`, `src/components/`): two tabs — "Hoje" (add form + habit list) and "Painel" (dashboard). Components are presentational and receive callbacks from `App`. Styling is plain CSS in `src/index.css`.

## Tests

Tests live next to the code (`*.test.ts`) and cover only `src/lib/`. `storage.test.ts` stubs `globalThis.localStorage` with an in-memory `Map`, since Vitest runs without a DOM environment.
