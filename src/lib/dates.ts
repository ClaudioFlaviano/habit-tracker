// Datas são guardadas como 'YYYY-MM-DD' no fuso local do usuário.
// Não usamos toISOString() porque ele converte para UTC e pode mudar o dia à noite.

const pad = (n: number) => String(n).padStart(2, '0');

export function toKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toKey(new Date());
}

export function addDays(key: string, n: number): string {
  const date = fromKey(key);
  date.setDate(date.getDate() + n);
  return toKey(date);
}

/** Últimos n dias, do mais antigo ao mais recente, terminando em `end`. */
export function lastNDays(n: number, end: string = todayKey()): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) days.push(addDays(end, -i));
  return days;
}

const weekdayFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
const longFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

export function weekdayShort(key: string): string {
  return weekdayFmt.format(fromKey(key)).replace('.', '');
}

export function formatLong(key: string): string {
  return longFmt.format(fromKey(key));
}
