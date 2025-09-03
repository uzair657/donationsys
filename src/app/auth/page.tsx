'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    const fn = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });
    const { error } = await fn;
    setBusy(false);
    if (error) setMsg(error.message);
    else router.push('/app');
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '60px auto' }}>
        <h2 className="title">{mode === 'login' ? 'Login' : 'Sign up'}</h2>
        <form onSubmit={submit}>
          <div style={{ margin:'8px 0' }}>
            <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div style={{ margin:'8px 0' }}>
            <input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn" disabled={busy}>{busy ? '...' : (mode==='login' ? 'Login' : 'Create account')}</button>
        </form>
        <div style={{ marginTop:12 }}>
          <button className="btn" onClick={()=>setMode(mode==='login'?'signup':'login')}>
            {mode==='login' ? 'Need an account? Sign up' : 'Have an account? Login'}
          </button>
        </div>
        {msg && <p style={{color:'crimson'}}>{msg}</p>}
      </div>
    </div>
  );
}
