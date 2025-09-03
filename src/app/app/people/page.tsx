'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

type Person = { id:string; full_name:string; cnic:string; address:string|null; };

export default function PeoplePage() {
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState<{text:string;color:string}|null>(null);

  const getActiveSeason = async () => {
    const { data } = await supabase.from('seasons').select('*').eq('is_active', true).maybeSingle();
    return data;
  };

  const findOrCreatePerson = async (): Promise<Person> => {
    const { data: existing } = await supabase.from('people').select('*').eq('cnic', cnic).maybeSingle();
    if (existing) return existing as any;
    const { data, error } = await supabase.from('people').insert({ full_name: fullName, cnic, address }).select().single();
    if (error) throw error;
    return data as any;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    try {
      const season = await getActiveSeason();
      if (!season) { setMsg({ text:'No active season selected.', color:'crimson' }); return; }

      const person = await findOrCreatePerson();

      // Has already donated in this active season?
      const { data: exists } = await supabase
        .from('donations')
        .select('id')
        .eq('person_id', person.id)
        .eq('season_id', season.id)
        .maybeSingle();

      if (exists) {
        setMsg({ text:`Already donated in ${season.name} ${season.year}.`, color:'crimson' });
        return;
      }

      // Insert donation
      const { error } = await supabase.from('donations').insert({
        person_id: person.id,
        season_id: season.id,
        amount,
        notes: note
      });
      if (error) throw error;

      setMsg({ text:'Saved. New donation recorded.', color:'green' });
      setFullName(''); setCnic(''); setAddress(''); setAmount(0); setNote('');
    } catch (err: any) {
      setMsg({ text: err.message || 'Error', color:'crimson' });
    }
  };

  return (
    <div className="container">
      <h2 className="title">Add person & donation</h2>
      <div className="card">
        <form onSubmit={submit}>
          <div className="row">
            <input className="input" placeholder="full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
            <input className="input" placeholder="cnic" value={cnic} onChange={e=>setCnic(e.target.value)} />
          </div>
          <div className="row">
            <input className="input" placeholder="address" value={address} onChange={e=>setAddress(e.target.value)} />
            <input className="input" type="number" placeholder="amount" value={amount} onChange={e=>setAmount(parseFloat(e.target.value||'0'))} />
          </div>
          <div style={{ margin:'8px 0' }}>
            <input className="input" placeholder="notes (optional)" value={note} onChange={e=>setNote(e.target.value)} />
          </div>
          <button className="btn">Save</button>
        </form>
        {msg && <p style={{ color: msg.color, marginTop: 10 }}>{msg.text}</p>}
      </div>
    </div>
  );
}
