import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const stats = user?.progress || {};
  const sessions = user?.activity || [];

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="section-label">Your dashboard</p>
          <h1>Today's wellness summary</h1>
          <p>See your completed sessions, streak, and recent activity in one place.</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="stat-card">
          <span>{stats.sessions || 0}</span>
          <small>Sessions completed</small>
        </div>
        <div className="stat-card">
          <span>{stats.minutes || 0}</span>
          <small>Total minutes</small>
        </div>
        <div className="stat-card">
          <span>{stats.streak || 0}</span>
          <small>Current streak</small>
        </div>
        <div className="stat-card accent">
          <span>{user?.completedPrograms?.length || 0}</span>
          <small>Programs finished</small>
        </div>
      </section>

      <section className="activity-section">
        <div className="section-heading">
          <p className="section-label">Activity log</p>
          <h2>Recent progress</h2>
        </div>
        <div className="activity-list">
          {sessions.length ? (
            sessions.slice(0, 5).map((item) => (
              <article key={item._id} className="activity-card">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <span>{new Date(item.completedAt).toLocaleDateString()}</span>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">Complete a session to see your history here.</p>
          )}
        </div>
      </section>
    </main>
  );
}
