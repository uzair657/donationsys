'use client';
import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [identifier, setIdentifier] = useState(''); // email or username
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const resolveEmail = async (id: string) => {
    if (id.includes('@')) return id;
    // look up by username (allowed by policy)
    const { data, error } = await supabase
      .from('user_public').select('user_id').eq('username', id).maybeSingle();
    if (error || !data) throw new Error('User not found');
    const { data: user } = await supabase.auth.admin.getUserById!(data.user_id as any); // not available on client
    return null;
  };
  // Simpler approach: require email in production. For now, we’ll allow username like this:
  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setBusy(true);
    let emailToUse = identifier;
    if (!identifier.includes('@')) {
      // fallback: ask the DB for the email via an RPC (public), or ask user to type email.
      setBusy(false); setMsg('Please enter email (username lookup disabled for client-only).');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
    setBusy(false);
    if (error) setMsg(error.message);
    else router.push('/app');
  };

  return (
    <div style={{ background:'#eeeaea', minHeight:'100vh', padding:'40px 12px' }}>
      <div style={{ maxWidth: 520, margin:'0 auto', background:'#fff', border:'1px solid #ddd',
                    borderRadius:24, padding:28 }}>
        <h1 style={{ textAlign:'center', margin:'6px 0 20px' }}>Sign In</h1>

        <form onSubmit={signIn}>
          <label style={label}>Email/Username</label>
          <input className="input" placeholder="Email" value={identifier}
                 onChange={e=>setIdentifier(e.target.value)} style={inputFull} />

          <label style={label}>Enter Password</label>
          <input className="input" type="password" placeholder="Password" value={password}
                 onChange={e=>setPassword(e.target.value)} style={inputFull} />

          <button className="btn" disabled={busy}
                  style={{ width:200, margin:'22px auto 6px', display:'block',
                           background:'#000', color:'#fff', borderRadius:28 }}>
            {busy ? '...' : 'Signin'}
          </button>
        </form>

        {msg && <p style={{ color:'crimson', textAlign:'center' }}>{msg}</p>}
      </div>
    </div>
  );
}
const label = { display:'block', margin:'14px 0 6px' };
const inputFull = { width:'100%', background:'#e9e9e9', borderRadius:12, border:'none', padding:'12px 14px' };
