export const EMOJIS = [
  '✅', '💧', '🏃', '🧘', '📚', '💪', '🥗', '😴',
  '🦷', '💊', '✍️', '🎸', '🧹', '🚭', '💰', '🌱',
];

const segmenter = new Intl.Segmenter('pt-BR', { granularity: 'grapheme' });

/** Mantém só o último emoji/caractere digitado (um emoji pode ter vários "códigos"). */
function lastGrapheme(text: string): string {
  const parts = [...segmenter.segment(text.trim())];
  return parts.length ? parts[parts.length - 1].segment : '';
}

interface Props {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, onChange }: Props) {
  const isCustom = !EMOJIS.includes(value);
  return (
    <div className="emoji-picker" role="radiogroup" aria-label="Emoji">
      {EMOJIS.map((e) => (
        <button
          key={e}
          type="button"
          role="radio"
          aria-checked={e === value}
          className={`emoji-opt ${e === value ? 'selected' : ''}`}
          onClick={() => onChange(e)}
        >
          {e}
        </button>
      ))}
      <input
        className={`emoji-custom ${isCustom ? 'selected' : ''}`}
        value={isCustom ? value : ''}
        placeholder="Outro"
        aria-label="Digite outro emoji"
        title="Digite ou cole qualquer emoji (no Windows: tecla Windows + .)"
        onChange={(e) => {
          const g = lastGrapheme(e.target.value);
          if (g) onChange(g);
        }}
      />
    </div>
  );
}
