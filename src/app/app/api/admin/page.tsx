'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'superadmin'|'admin'|'manager'|'staff'>('staff');
  const [msg, setMsg] = useState('');

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    const res = await fetch('/api/admin/create-user', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const j = await res.json();
    if (!res.ok) setMsg(j.error || 'Error');
    else { setMsg('User created'); setEmail(''); setPassword(''); }
  };

  return (
    <div className="container">
      <h2 className="title">Admin – Create User</h2>
      <div className="card">
        <form onSubmit={createUser} className="row">
          <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <select className="input" value={role} onChange={e=>setRole(e.target.value as any)}>
            <option value="superadmin">superadmin</option>
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="staff">staff</option>
          </select>
          <button className="btn">Create</button>
        </form>
        {msg && <p style={{ color: msg==='User created' ? 'green' : 'crimson' }}>{msg}</p>}
      </div>
    </div>
  );
}
