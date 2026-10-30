import { useState, type CSSProperties } from 'react';
import type { Habit } from '../types';
import { lastNDays, weekdayShort } from '../lib/dates';
import { currentStreak, longestStreak } from '../lib/streaks';
import { EmojiPicker } from './EmojiPicker';

interface Props {
  habit: Habit;
  today: string;
  onToggle: (id: string, day: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onEmoji: (id: string, emoji: string) => void;
}

export function HabitCard({ habit, today, onToggle, onRemove, onRename, onEmoji }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(habit.name);
  const [pickingEmoji, setPickingEmoji] = useState(false);
  const done = new Set(habit.completions);
  const doneToday = done.has(today);
  const streak = currentStreak(habit.completions, today);
  const best = longestStreak(habit.completions);

  function finishRename() {
    const name = draft.trim();
    if (name && name !== habit.name) onRename(habit.id, name);
    else setDraft(habit.name);
    setEditing(false);
  }

  function cancelRename() {
    setDraft(habit.name);
    setEditing(false);
  }

  return (
    <article className="card habit" style={{ '--habit': habit.color } as CSSProperties}>
      <header className="habit-head">
        <button
          className="habit-emoji"
          onClick={() => setPickingEmoji((v) => !v)}
          aria-label="Trocar emoji"
          aria-expanded={pickingEmoji}
          title="Trocar emoji"
        >
          {habit.emoji}
        </button>
        {editing ? (
          <input
            autoFocus
            value={draft}
            maxLength={60}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={finishRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') finishRename();
              if (e.key === 'Escape') cancelRename();
            }}
            aria-label="Novo nome"
          />
        ) : (
          <h3 onDoubleClick={() => setEditing(true)} title="Clique duas vezes para renomear">
            {habit.name}
          </h3>
        )}
        <div className="habit-actions">
          <button className="icon-btn" onClick={() => setEditing(true)} aria-label="Renomear" title="Renomear">
            ✏️
          </button>
          <button
            className="icon-btn"
            aria-label="Excluir"
            title="Excluir"
            onClick={() => {
              if (confirm(`Excluir o hábito "${habit.name}"? O histórico será perdido.`)) onRemove(habit.id);
            }}
          >
            🗑️
          </button>
        </div>
      </header>

      {pickingEmoji && (
        <EmojiPicker
          value={habit.emoji}
          onChange={(e) => {
            onEmoji(habit.id, e);
            setPickingEmoji(false);
          }}
        />
      )}

      <div className="habit-stats">
        <span className={`streak ${streak > 0 ? 'on' : ''}`}>
          🔥 {streak} {streak === 1 ? 'dia' : 'dias'} seguidos
        </span>
        <span className="muted">Melhor: {best}</span>
      </div>

      <div className="week">
        {lastNDays(7, today).map((day) => (
          <button
            key={day}
            className={`day ${done.has(day) ? 'done' : ''} ${day === today ? 'today' : ''}`}
            onClick={() => onToggle(habit.id, day)}
            aria-pressed={done.has(day)}
            aria-label={day}
          >
            <span className="day-name">{weekdayShort(day)}</span>
            <span className="day-num">{Number(day.slice(8))}</span>
          </button>
        ))}
      </div>

      <button
        className={`btn-done ${doneToday ? 'checked' : ''}`}
        onClick={() => onToggle(habit.id, today)}
        aria-pressed={doneToday}
      >
        {doneToday ? '✓ Concluído hoje' : 'Marcar como concluído'}
      </button>
    </article>
  );
}
