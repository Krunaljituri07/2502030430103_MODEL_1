import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Programs.css';

const programList = [
  {
    id: 'morning-reset',
    title: 'Morning Reset',
    description: 'A calming sequence to begin your day with clarity and energy.',
    duration: 12,
    category: 'Focus',
  },
  {
    id: 'evening-release',
    title: 'Evening Release',
    description: 'Ease tension and let go of the day with breathwork and meditation.',
    duration: 18,
    category: 'Relaxation',
  },
  {
    id: 'deep-rest',
    title: 'Deep Rest',
    description: 'A gentle guided meditation for sleep readiness and restoration.',
    duration: 20,
    category: 'Sleep',
  },
  {
    id: 'confidence-rise',
    title: 'Confidence Rise',
    description: 'Gain calm confidence with supportive breathing and focus cues.',
    duration: 14,
    category: 'Mindset',
  },
];

export default function Programs() {
  const { user, authFetch, refreshProfile } = useContext(AuthContext);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null);

  const toggleComplete = async (program) => {
    if (!user) {
      setMessage('Please log in to save your progress.');
      return;
    }
    setBusyId(program.id);
    const data = await authFetch('/api/users/progress', {
      method: 'PUT',
      body: JSON.stringify({
        title: program.title,
        description: `${program.category} session for ${program.duration} minutes`,
        duration: program.duration,
        category: program.category,
      }),
    });
    setBusyId(null);
    if (data.user) {
      setMessage(`Logged ${program.title} to your progress.`);
      refreshProfile();
    } else {
      setMessage(data.message || 'Could not update progress.');
    }
  };

  return (
    <main className="program-shell">
      <section className="program-header">
        <p className="section-label">Programs</p>
        <h1>Choose a guided routine that matches your mood.</h1>
        <p>Complete sessions to build streaks and track your progress automatically.</p>
      </section>

      {message && <div className="program-notice">{message}</div>}

      <section className="program-grid">
        {programList.map((program) => {
          const completed = user?.completedPrograms?.includes(program.id);
          return (
            <article key={program.id} className="program-card">
              <div className="program-top">
                <span>{program.category}</span>
                <strong>{program.duration} min</strong>
              </div>
              <h2>{program.title}</h2>
              <p>{program.description}</p>
              <button
                className={completed ? 'btn-outline disabled' : 'btn-primary'}
                onClick={() => toggleComplete(program)}
                disabled={busyId === program.id || completed}
              >
                {completed ? 'Completed' : busyId === program.id ? 'Saving...' : 'Complete session'}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
