import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <main className="home-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-tag">Mindful wellness for every day</span>
          <h1>Serenity helps you slow down, restore energy, and build daily calm.</h1>
          <p>
            Build your personalized meditation journey with guided sessions, breathing exercises, and progress tracking that remembers every step.
          </p>
          <div className="hero-actions">
            <Link className="btn-primary" to={user ? '/dashboard' : '/signup'}>
              Start your journey
            </Link>
            <Link className="btn-secondary" to="/programs">
              Explore programs
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="metrics-card">
            <span className="metric-label">Personal routine</span>
            <strong>Daily calm</strong>
            <p>Track your mood, sessions, and wellness progress in one beautiful place.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <span>30+</span>
              <small>guided sessions</small>
            </div>
            <div className="stat-card">
              <span>120+</span>
              <small>minutes weekly</small>
            </div>
            <div className="stat-card">
              <span>4.9</span>
              <small>user satisfaction</small>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <span className="section-label">Why Serenity</span>
          <h2>Wellness habits that feel effortless and elegant.</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Guided Journeys</h3>
            <p>Follow curated sessions designed for focus, sleep, and emotional balance.</p>
          </article>
          <article className="feature-card">
            <h3>Progress Tracking</h3>
            <p>See your streak, total minutes, and activity history in your profile.</p>
          </article>
          <article className="feature-card">
            <h3>Smart Reminders</h3>
            <p>Stay consistent with prompts and daily reflections tailored to your pace.</p>
          </article>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <h2>Ready to make calm your daily habit?</h2>
          <p>Sign up and begin tracking your wellness with the support of the Serenity community.</p>
        </div>
        <Link className="btn-primary" to={user ? '/dashboard' : '/signup'}>
          Join Serenity
        </Link>
      </section>
    </main>
  );
}
