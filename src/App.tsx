import { useState } from 'react';
import { useHabits, useToday } from './hooks/useHabits';
import { formatLong } from './lib/dates';
import { AddHabitForm } from './components/AddHabitForm';
import { HabitList } from './components/HabitList';
import { Dashboard } from './components/Dashboard';

type Tab = 'hoje' | 'painel';

export default function App() {
  const { habits, addHabit, removeHabit, renameHabit, setEmoji, toggleCompletion } = useHabits();
  const today = useToday();
  const [tab, setTab] = useState<Tab>('hoje');

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>Meus Hábitos</h1>
          <p className="muted date">{formatLong(today)}</p>
        </div>
        <nav className="tabs">
          <button className={tab === 'hoje' ? 'active' : ''} onClick={() => setTab('hoje')}>
            Hoje
          </button>
          <button className={tab === 'painel' ? 'active' : ''} onClick={() => setTab('painel')}>
            Painel
          </button>
        </nav>
      </header>

      <main>
        {tab === 'hoje' ? (
          <>
            <AddHabitForm existingNames={habits.map((h) => h.name)} onAdd={addHabit} />
            <HabitList
              habits={habits}
              today={today}
              onToggle={toggleCompletion}
              onRemove={removeHabit}
              onRename={renameHabit}
              onEmoji={setEmoji}
            />
          </>
        ) : (
          <Dashboard habits={habits} today={today} onToggle={toggleCompletion} />
        )}
      </main>
    </div>
  );
}
