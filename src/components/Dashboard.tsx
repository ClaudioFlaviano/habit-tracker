import type { CSSProperties } from 'react';
import type { Habit } from '../types';
import { lastNDays, weekdayShort } from '../lib/dates';
import { completionRate, currentStreak } from '../lib/streaks';

interface Props {
  habits: Habit[];
  today: string;
  onToggle: (id: string, day: string) => void;
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function Dashboard({ habits, today, onToggle }: Props) {
  if (habits.length === 0) {
    return (
      <div className="empty card">
        <p className="empty-icon">📊</p>
        <p>Adicione hábitos na aba “Hoje” para ver seu progresso aqui.</p>
      </div>
    );
  }

  const doneToday = habits.filter((h) => h.completions.includes(today)).length;
  const streaks = habits.map((h) => currentStreak(h.completions, today));
  const bestIdx = streaks.indexOf(Math.max(...streaks));
  const weekRate = habits.reduce((sum, h) => sum + completionRate(h, 7, today), 0) / habits.length;
  const days = lastNDays(14, today);

  return (
    <div className="dashboard">
      <section className="stats">
        <div className="card stat">
          <span className="stat-label">Hábitos</span>
          <span className="stat-value">{habits.length}</span>
        </div>
        <div className="card stat">
          <span className="stat-label">Concluídos hoje</span>
          <span className="stat-value">
            {doneToday}/{habits.length}
          </span>
          <div className="bar">
            <div style={{ width: pct(doneToday / habits.length) }} />
          </div>
        </div>
        <div className="card stat">
          <span className="stat-label">Maior sequência atual</span>
          <span className="stat-value">🔥 {streaks[bestIdx]}</span>
          <span className="stat-sub">{streaks[bestIdx] > 0 ? `${habits[bestIdx].emoji} ${habits[bestIdx].name}` : '—'}</span>
        </div>
        <div className="card stat">
          <span className="stat-label">Conclusão (7 dias)</span>
          <span className="stat-value">{pct(weekRate)}</span>
          <div className="bar">
            <div style={{ width: pct(weekRate) }} />
          </div>
        </div>
      </section>

      <section className="card overview">
        <h2>Últimos 14 dias</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="name-col">Hábito</th>
                {days.map((d) => (
                  <th key={d} className={d === today ? 'today' : ''}>
                    <span className="day-name">{weekdayShort(d)[0]}</span>
                    <span>{Number(d.slice(8))}</span>
                  </th>
                ))}
                <th>Sequência</th>
                <th>7 dias</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((h, i) => {
                const done = new Set(h.completions);
                return (
                  <tr key={h.id} style={{ '--habit': h.color } as CSSProperties}>
                    <td className="name-col" title={h.name}>
                      <span className="dot" />
                      <span className="row-emoji">{h.emoji}</span>
                      {h.name}
                    </td>
                    {days.map((d) => (
                      <td key={d}>
                        <button
                          className={`cell ${done.has(d) ? 'done' : ''}`}
                          onClick={() => onToggle(h.id, d)}
                          aria-label={`${h.name} em ${d}`}
                          aria-pressed={done.has(d)}
                        />
                      </td>
                    ))}
                    <td className="num">🔥 {streaks[i]}</td>
                    <td className="num">{pct(completionRate(h, 7, today))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
