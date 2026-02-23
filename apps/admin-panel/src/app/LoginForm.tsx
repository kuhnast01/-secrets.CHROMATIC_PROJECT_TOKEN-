import styles from './LoginForm.module.css';
import React, { useState, FormEvent } from 'react';

interface LoginFormProps {
  onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        let message = 'Login failed';
        try {
          message = await res.text();
        } catch {}
        throw new Error(message);
      }
      const data = await res.json();
      if (!data.token) throw new Error('No token returned');
      localStorage.setItem('token', data.token);
      setLoading(false);
      onLogin();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Login failed');
      } else {
        setError('Login failed');
      }
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles['login-form']}
      aria-busy={loading ? true : false}
      aria-describedby={error ? 'login-error' : undefined}
      autoComplete="off"
    >
      <h2>Admin Login</h2>
      <div className={styles['login-form-group']}>
        <label htmlFor="login-username">Username</label>
        <input
          id="login-username"
          name="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className={styles['login-form-input']}
          autoComplete="username"
          disabled={loading}
        />
      </div>
      <div className={styles['login-form-group']}>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={styles['login-form-input']}
          autoComplete="current-password"
          disabled={loading}
        />
      </div>
      {error && (
        <div id="login-error" className={styles['login-form-error']} role="alert">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className={styles['login-form-button']}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
