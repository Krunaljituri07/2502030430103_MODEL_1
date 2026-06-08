import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-shell">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          Serenity
        </Link>
      </div>
      <button className="nav-toggle" onClick={() => setOpen((prev) => !prev)}>
        {open ? 'Close' : 'Menu'}
      </button>
      <nav className={`nav-links ${open ? 'active' : ''}`}>
        <NavLink to="/" end className="nav-link">
          Home
        </NavLink>
        <NavLink to="/programs" className="nav-link">
          Programs
        </NavLink>
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          Profile
        </NavLink>
        {user ? (
          <button className="nav-cta" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="nav-cta">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
