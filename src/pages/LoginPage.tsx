import { FormEvent, useState } from 'react';
import { Bot, Lock, ShieldCheck } from 'lucide-react';
import { adminApi, USE_MOCKS } from '../services/api';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminApi.login(username, password);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-card">
        <div className="login-brand"><div className="brand-mark"><Bot size={26} /></div><div><strong>Britam Bot Admin</strong><span>Teams AI Control Centre</span></div></div>
        <h1>Admin sign in</h1>
        <p>Login to approve users, manage permissions, monitor agent health, and review bot analytics.</p>
        <form onSubmit={submit} className="login-form">
          <label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" /></label>
          <label>Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" /></label>
          {error && <div className="login-error">{error}</div>}
          <button className="btn primary" disabled={loading}><Lock size={16} /> {loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="login-note"><ShieldCheck size={16} /> {USE_MOCKS ? 'Mock mode is enabled.' : 'Live Django API mode is enabled.'}</div>
      </section>
    </div>
  );
}
