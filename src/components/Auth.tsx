import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';

export function Auth() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [nickname, setNickname] = useState(''); const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage('');
    if (mode === 'signup' && password !== repeatPassword) { setMessage('Пароли не совпадают.'); return; }
    if (mode === 'signup' && (nickname.trim().length < 3 || nickname.trim().length > 20)) { setMessage('Никнейм: от 3 до 20 символов.'); return; }
    if (password.length < 8) { setMessage('Пароль должен быть не короче 8 символов.'); return; }
    setBusy(true);
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { nickname: nickname.trim() } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) { setMessage(result.error.message); return; }
    if (mode === 'signup' && !result.data.session) { setMessage('Account created. Confirm your email, then sign in to choose a career slot.'); return; }
    setLocation('/game');
    setMessage(mode === 'signup' ? 'Аккаунт создан. Подтверди письмо и затем войди.' : 'Вход выполнен! Можно открыть карьеру.');
  }
  async function signInWithGoogle() {
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/game` } });
    if (error) { setMessage(error.message); setBusy(false); }
  }
  return <main className="auth-page"><Link className="brand" href="/">APEX <i>RACING</i></Link><section className="auth-card"><p className="eyebrow">ACCOUNT</p><h1>{mode === 'signin' ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}</h1><button className="google-button" disabled={busy} onClick={signInWithGoogle}><span>G</span> CONTINUE WITH GOOGLE</button><p className="auth-divider">OR USE EMAIL</p><form onSubmit={submit}>{mode === 'signup' && <label>НИКНЕЙМ<input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="например, SpeedFox" required /></label>}<label>EMAIL<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label><label>ПАРОЛЬ<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>{mode === 'signup' && <label>ПОВТОРИ ПАРОЛЬ<input type="password" value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} minLength={8} required /></label>}<button className="action-button" disabled={busy}>{busy ? 'ПОДОЖДИ…' : mode === 'signin' ? 'ВОЙТИ →' : 'СОЗДАТЬ АККАУНТ →'}</button></form>{message && <p className="auth-message">{message}</p>}<button className="auth-switch" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(''); }}>{mode === 'signin' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}</button></section></main>;
}
