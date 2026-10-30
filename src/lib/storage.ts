import type { Habit } from '../types';

const KEY = 'habit-tracker:v1';
export const DEFAULT_EMOJI = '✅';

// O emoji é verificado à parte: hábitos salvos antes dele existir recebem o padrão.
function isHabit(value: unknown): value is Omit<Habit, 'emoji'> & { emoji?: unknown } {
  const h = value as Habit;
  return (
    typeof h === 'object' && h !== null &&
    typeof h.id === 'string' && typeof h.name === 'string' &&
    typeof h.color === 'string' && typeof h.createdAt === 'string' &&
    Array.isArray(h.completions) && h.completions.every((c) => typeof c === 'string')
  );
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHabit).map((h) => ({
      ...h,
      emoji: typeof h.emoji === 'string' && h.emoji ? h.emoji : DEFAULT_EMOJI,
    }));
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(habits));
  } catch {
    // Armazenamento cheio ou bloqueado: o app continua funcionando nesta sessão.
  }
}
