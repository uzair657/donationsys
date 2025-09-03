'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [username,  setUsername]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [busy,      setBusy]      = useState(false);
  const [msg,       setMsg]       = useState<string | null>(null);

  const router = useRouter();

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    // Basic checks
    if (!firstName.trim()) return setMsg('Please enter first name.');
    if (!lastName.trim())  return setMsg('Please enter last name.');
    if (!username.trim())  return setMsg('Please choose a username.');
    if (!email.trim() || !isEmail(email)) return setMsg('Please enter a valid email address.');
    if (password.length < 6) return setMsg('Password must be at least 6 characters.');

    setBusy(true);

    // 1) Create auth user
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      // Save metadata so we still have names even if there's no session yet
      options: {
        data: {
          first_name: firstName.trim(),
          last_name:  lastName.trim(),
          username:   username.trim(),
        },
      },
    });

    if (error) {
      setBusy(false);
      setMsg(error.message || 'Sign up failed.');
      return;
    }

    // 2) If a session exists (email confirmations OFF), upsert into user_public now
    if (data.session && data.user) {
      const { error: upErr } = await supabase.from('user_public').upsert({
        user_id: data.user.id,
        first_name: firstName.trim(),
        last_name:  lastName.trim(),
        username:   username.trim(),
      });
      setBusy(false);
      if (upErr) {
        setMsg(upErr.message);
        return;
      }
      router.push('/app');
      return;
    }

    // 3) If confirmations are ON, there is no session yet
    setBusy(false);
    setMsg('Account created. Please verify your email, then sign in.');
  };

  return (
    <div className="min-h-screen bg-zinc-200 p-6">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-zinc-300 bg-white p-7">
        <h1 className="mb-5 text-center text-2xl font-semibold">Sign Up</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-xl bg-zinc-200 px-4 py-3 outline-none"
            />
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-xl bg-zinc-200 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">User Name</label>
            <input
              placeholder="john657"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl bg-zinc-200 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Enter Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-zinc-200 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-zinc-200 px-4 py-3 outline-none"
            />
          </div>

          <button
            disabled={busy}
            className="mx-auto mt-3 block w-40 rounded-full border border-black bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {busy ? '...' : 'Sign Up'}
          </button>
        </form>

        {msg && <p className="mt-3 text-center text-sm text-red-600">{msg}</p>}
      </div>
    </div>
  );
}
