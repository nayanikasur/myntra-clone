import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { BRAND_NAME } from '../config';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // only allow same-site redirects
  const raw = params.get('redirect') || '/';
  const redirect = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';

  if (user) return <Navigate to={redirect} replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-banner">
          <strong>Flat ₹300 OFF</strong>
          <span>+ Free shipping on 1st order</span>
        </div>
        <form className="login-form" onSubmit={submit}>
          <h2>
            {mode === 'login' ? 'Login' : 'Signup'} <span>or</span>{' '}
            <button type="button" className="link-btn" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Signup' : 'Login'}
            </button>
          </h2>
          {mode === 'signup' && (
            <>
              <input placeholder="Full Name*" value={form.name} onChange={set('name')} required />
              <input placeholder="Mobile Number" value={form.mobile} onChange={set('mobile')} inputMode="numeric" maxLength={10} />
            </>
          )}
          <input type="email" placeholder="Email*" value={form.email} onChange={set('email')} required autoComplete="email" />
          <input
            type="password"
            placeholder="Password*"
            value={form.password}
            onChange={set('password')}
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {error && <p className="error-text">{error}</p>}
          <p className="terms">
            By continuing, I agree to the <b>Terms of Use</b> &amp; <b>Privacy Policy</b> of {BRAND_NAME}
          </p>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'PLEASE WAIT…' : 'CONTINUE'}
          </button>
          <p className="help">
            Have trouble logging in? <b>Get help</b>
          </p>
        </form>
      </div>
    </div>
  );
}
