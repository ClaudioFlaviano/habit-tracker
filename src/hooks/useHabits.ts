import { useCallback, useEffect, useState } from 'react';
import type { Habit } from '../types';
import { loadHabits, saveHabits } from '../lib/storage';
import { todayKey } from '../lib/dates';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);

  useEffect(() => saveHabits(habits), [habits]);

  const addHabit = useCallback((name: string, emoji: string, color: string) => {
    setHabits((hs) => [
      ...hs,
      { id: crypto.randomUUID(), name: name.trim(), emoji, color, createdAt: todayKey(), completions: [] },
    ]);
  }, []);

  const setEmoji = useCallback((id: string, emoji: string) => {
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, emoji } : h)));
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((hs) => hs.filter((h) => h.id !== id));
  }, []);

  const renameHabit = useCallback((id: string, name: string) => {
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, name: name.trim() } : h)));
  }, []);

  const toggleCompletion = useCallback((id: string, day: string) => {
    if (day > todayKey()) return; // não permite marcar o futuro
    setHabits((hs) =>
      hs.map((h) => {
        if (h.id !== id) return h;
        const done = h.completions.includes(day);
        return {
          ...h,
          completions: done ? h.completions.filter((d) => d !== day) : [...h.completions, day].sort(),
          // marcar um dia anterior à criação recua a data de criação
          createdAt: !done && day < h.createdAt ? day : h.createdAt,
        };
      }),
    );
  }, []);

  return { habits, addHabit, removeHabit, renameHabit, setEmoji, toggleCompletion };
}

/** Data de hoje que se atualiza sozinha quando o dia vira. */
export function useToday(): string {
  const [today, setToday] = useState(todayKey);
  useEffect(() => {
    const update = () => setToday(todayKey());
    const timer = setInterval(update, 60_000);
    document.addEventListener('visibilitychange', update);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return today;
}
