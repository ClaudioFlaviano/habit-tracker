import { useState, type FormEvent } from 'react';
import { EMOJIS, EmojiPicker } from './EmojiPicker';

export const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f97316', '#ec4899', '#14b8a6', '#eab308'];

interface Props {
  existingNames: string[];
  onAdd: (name: string, emoji: string, color: string) => void;
}

export function AddHabitForm({ existingNames, onAdd }: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError('Digite um nome para o hábito.');
    if (existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      return setError('Você já tem um hábito com esse nome.');
    }
    onAdd(trimmed, emoji, color);
    setName('');
    setError('');
    setColor(COLORS[(COLORS.indexOf(color) + 1) % COLORS.length]);
  }

  return (
    <form className="add-form card" onSubmit={submit}>
      <div className="add-row">
        <span className="emoji-preview" aria-hidden="true">{emoji}</span>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Novo hábito (ex.: Beber 2L de água)"
          maxLength={60}
          aria-label="Nome do hábito"
        />
        <button type="submit" className="btn-primary">
          Adicionar
        </button>
      </div>
      <EmojiPicker value={emoji} onChange={setEmoji} />
      <div className="colors" role="radiogroup" aria-label="Cor">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={c === color}
            aria-label={`Cor ${c}`}
            className={`swatch ${c === color ? 'selected' : ''}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
