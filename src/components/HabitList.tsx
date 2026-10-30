import type { Habit } from '../types';
import { HabitCard } from './HabitCard';

interface Props {
  habits: Habit[];
  today: string;
  onToggle: (id: string, day: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onEmoji: (id: string, emoji: string) => void;
}

export function HabitList({ habits, ...rest }: Props) {
  if (habits.length === 0) {
    return (
      <div className="empty card">
        <p className="empty-icon">🌱</p>
        <p>Nenhum hábito ainda. Adicione o primeiro acima!</p>
      </div>
    );
  }
  return (
    <div className="habit-grid">
      {habits.map((h) => (
        <HabitCard key={h.id} habit={h} {...rest} />
      ))}
    </div>
  );
}
