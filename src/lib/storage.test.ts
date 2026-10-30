import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_EMOJI, loadHabits } from './storage';

const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
} as Storage;

describe('loadHabits', () => {
  beforeEach(() => store.clear());

  it('dá emoji padrão a hábitos salvos antes do emoji existir', () => {
    store.set('habit-tracker:v1', JSON.stringify([
      { id: '1', name: 'Ler', color: '#000', createdAt: '2026-10-01', completions: [] },
      { id: '2', name: 'Correr', emoji: '🏃', color: '#000', createdAt: '2026-10-01', completions: [] },
    ]));
    expect(loadHabits().map((h) => h.emoji)).toEqual([DEFAULT_EMOJI, '🏃']);
  });

  it('ignora dados corrompidos', () => {
    store.set('habit-tracker:v1', '{oops');
    expect(loadHabits()).toEqual([]);
  });
});
