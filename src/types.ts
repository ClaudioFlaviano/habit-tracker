export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string; // 'YYYY-MM-DD'
  completions: string[]; // datas concluídas, 'YYYY-MM-DD'
}
