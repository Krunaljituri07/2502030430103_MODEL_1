import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p>Sign in to view your wellness progress and personalized routines.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email address
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">Sign In</button>
        </form>
        <p className="auth-foot">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
