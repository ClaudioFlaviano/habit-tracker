import { describe, expect, it } from 'vitest';
import { addDays, lastNDays, toKey } from './dates';
import { completionRate, currentStreak, longestStreak } from './streaks';

describe('dates', () => {
  it('formata no fuso local', () => {
    expect(toKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
  it('vira mês e ano', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29');
  });
  it('lastNDays termina no dia informado', () => {
    expect(lastNDays(3, '2026-01-01')).toEqual(['2025-12-30', '2025-12-31', '2026-01-01']);
  });
});

describe('currentStreak', () => {
  const today = '2026-10-29';
  it('vazio = 0', () => expect(currentStreak([], today)).toBe(0));
  it('só hoje = 1', () => expect(currentStreak([today], today)).toBe(1));
  it('ontem sem hoje ainda conta', () => {
    expect(currentStreak(['2026-10-27', '2026-10-28'], today)).toBe(2);
  });
  it('dia faltando quebra a sequência', () => {
    expect(currentStreak(['2026-10-26', '2026-10-28', today], today)).toBe(2);
  });
  it('anteontem sem ontem = 0', () => {
    expect(currentStreak(['2026-10-27'], today)).toBe(0);
  });
  it('atravessa virada de ano', () => {
    expect(currentStreak(['2026-12-30', '2026-12-31', '2027-01-01'], '2027-01-01')).toBe(3);
  });
});

describe('longestStreak', () => {
  it('encontra a maior sequência fora de ordem e com duplicatas', () => {
    expect(longestStreak(['2026-10-05', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-02', '2026-10-06'])).toBe(3);
  });
  it('vazio = 0', () => expect(longestStreak([])).toBe(0));
});

describe('completionRate', () => {
  it('ignora dias antes da criação', () => {
    const habit = { id: '1', name: 'x', emoji: '✅', color: '#000', createdAt: '2026-10-28', completions: ['2026-10-28'] };
    expect(completionRate(habit, 7, '2026-10-29')).toBe(0.5);
  });
});
