import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Signup.css';

export default function Signup() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await register(name, email, password, bio);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p>Sign up and keep track of every step in your wellness routine.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email address
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </label>
          <label>
            Short bio
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Share what motivates you" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">Create account</button>
        </form>
        <p className="auth-foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
