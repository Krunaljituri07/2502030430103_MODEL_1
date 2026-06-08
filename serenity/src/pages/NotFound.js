import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className="notfound-shell">
      <div className="notfound-card">
        <h1>Page not found</h1>
        <p>Looks like the path you followed doesn't exist. Return to the Serenity home page.</p>
        <Link className="btn-primary" to="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
