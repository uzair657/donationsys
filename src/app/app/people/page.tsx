'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import type { Person, Season } from '@/app/types/db';

export default function PeoplePage() {
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState<{ text: string; color: 'red' | 'green' } | null>(null);

  const getActiveSeason = async (): Promise<Season | null> => {
    const { data } = await supabase.from('seasons').select('*').eq('is_active', true).maybeSingle();
    return (data as Season | null) ?? null;
  };

  const findOrCreatePerson = async (): Promise<Person> => {
    const { data: existing } = await supabase.from('people').select('*').eq('cnic', cnic).maybeSingle();
    if (existing) return existing as Person;

    const { data, error } = await supabase
      .from('people')
      .insert({ full_name: fullName, cnic, address })
      .select()
      .single();
    if (error || !data) throw error ?? new Error('Failed to create person');
    return data as Person;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);

    const season = await getActiveSeason();
    if (!season) { setMsg({ text: 'No active season selected.', color: 'red' }); return; }

    try {
      const person = await findOrCreatePerson();

      const { data: exists } = await supabase
        .from('donations')
        .select('id')
        .eq('person_id', person.id)
        .eq('season_id', season.id)
        .maybeSingle();

      if (exists) {
        setMsg({ text: `Already donated in ${season.name} ${season.year}.`, color: 'red' });
        return;
      }

      const { error } = await supabase.from('donations').insert({
        person_id: person.id,
        season_id: season.id,
        amount,
        notes: note,
      });
      if (error) throw error;

      setMsg({ text: 'Saved. New donation recorded.', color: 'green' });
      setFullName(''); setCnic(''); setAddress(''); setAmount(0); setNote('');
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : 'Error', color: 'red' });
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Add person & donation</h2>
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <form onSubmit={submit} className="space-y-2">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input className="rounded-lg border px-3 py-2" placeholder="full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
            <input className="rounded-lg border px-3 py-2" placeholder="cnic" value={cnic} onChange={e=>setCnic(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input className="rounded-lg border px-3 py-2" placeholder="address" value={address} onChange={e=>setAddress(e.target.value)} />
            <input className="rounded-lg border px-3 py-2" type="number" placeholder="amount" value={amount} onChange={e=>setAmount(Number(e.target.value || 0))} />
          </div>
          <input className="w-full rounded-lg border px-3 py-2" placeholder="notes (optional)" value={note} onChange={e=>setNote(e.target.value)} />
          <button className="rounded-lg border px-3 py-2">Save</button>
        </form>
        {msg && <p className={`mt-2 text-sm ${msg.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>}
      </div>
    </div>
  );
}
