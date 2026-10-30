import type { Habit } from '../types';
import { addDays, lastNDays } from './dates';

/**
 * Dias consecutivos concluídos terminando hoje. Se hoje ainda não foi marcado,
 * conta a partir de ontem — a sequência só quebra depois que o dia acaba.
 */
export function currentStreak(completions: string[], today: string): number {
  const done = new Set(completions);
  let day = done.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (done.has(day)) {
    count++;
    day = addDays(day, -1);
  }
  return count;
}

export function longestStreak(completions: string[]): number {
  const sorted = [...new Set(completions)].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of sorted) {
    run = prev !== null && addDays(prev, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

/** Fração (0–1) de dias concluídos nos últimos `days` dias, sem contar dias antes da criação. */
export function completionRate(habit: Habit, days: number, today: string): number {
  const window = lastNDays(days, today).filter((d) => d >= habit.createdAt);
  if (window.length === 0) return 0;
  const done = new Set(habit.completions);
  return window.filter((d) => done.has(d)).length / window.length;
}
