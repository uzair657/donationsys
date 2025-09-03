'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import type { Person, Season } from '@/app/types/db';

type DonationRow = {
  id: string;
  amount: number;
  notes: string | null;
  person: Person;
};

export default function DonationsPage() {
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [list, setList] = useState<DonationRow[]>([]);
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState<string>('');

  const loadSeason = useCallback(async () => {
    const { data } = await supabase
      .from('seasons')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();
    setActiveSeason((data as Season | null) ?? null);
  }, []);

  const loadList = useCallback(async () => {
    if (!activeSeason) return;
    const { data, error } = await supabase
      .from('donations')
      .select('id, amount, notes, person:people(id, full_name, cnic, address)')
      .eq('season_id', activeSeason.id)
      .order('created_at', { ascending: false });
    if (!error) setList(((data ?? []) as unknown as DonationRow[]));
  }, [activeSeason]);

  useEffect(() => { void loadSeason(); }, [loadSeason]);
  useEffect(() => { void loadList(); }, [loadList]);

  const addDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!activeSeason) { setMsg('Please set an active season in Seasons page.'); return; }

    const { data: existingPerson } = await supabase
      .from('people')
      .select('*')
      .eq('cnic', cnic)
      .maybeSingle();

    let personId = (existingPerson as Person | null)?.id ?? '';

    if (!personId) {
      const { data: created, error: createErr } = await supabase
        .from('people')
        .insert({ full_name: fullName, cnic, address })
        .select()
        .single();
      if (createErr || !created) { setMsg(createErr?.message ?? 'Error saving person'); return; }
      personId = (created as Person).id;
    }

    const { data: exists } = await supabase
      .from('donations')
      .select('id')
      .eq('person_id', personId)
      .eq('season_id', activeSeason.id)
      .maybeSingle();

    if (exists) { setMsg(`Already donated in ${activeSeason.name} ${activeSeason.year}.`); return; }

    const { error } = await supabase
      .from('donations')
      .insert({ person_id: personId, season_id: activeSeason.id, amount, notes });
    if (error) { setMsg(error.message); return; }

    setFullName(''); setCnic(''); setAddress(''); setAmount(0); setNotes('');
    await loadList();
    setMsg('Saved.');
  };

  const delRow = async (id: string) => {
    await supabase.from('donations').delete().eq('id', id);
    await loadList();
  };

  const editAmount = async (id: string, value: number) => {
    await supabase.from('donations').update({ amount: value }).eq('id', id);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Donations {activeSeason ? `– ${activeSeason.name} ${activeSeason.year}` : ''}</h2>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <form onSubmit={addDonation} className="space-y-2">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input className="rounded-lg border px-3 py-2" placeholder="full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
            <input className="rounded-lg border px-3 py-2" placeholder="cnic" value={cnic} onChange={e=>setCnic(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input className="rounded-lg border px-3 py-2" placeholder="address" value={address} onChange={e=>setAddress(e.target.value)} />
            <input className="rounded-lg border px-3 py-2" type="number" placeholder="amount" value={amount} onChange={e=>setAmount(Number(e.target.value || 0))} />
          </div>
          <input className="w-full rounded-lg border px-3 py-2" placeholder="notes" value={notes} onChange={e=>setNotes(e.target.value)} />
          <button className="rounded-lg border px-3 py-2">Save</button>
        </form>
        {msg && <p className={`mt-2 text-sm ${msg === 'Saved.' ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      </div>

      {list.map(row => (
        <div key={row.id} className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <b>{row.person.full_name}</b> – {row.person.cnic}
              <div className="text-xs text-zinc-600">{row.person.address ?? ''}</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                defaultValue={row.amount}
                className="w-28 rounded-lg border px-3 py-2"
                onBlur={(e) => editAmount(row.id, Number(e.currentTarget.value || 0))}
              />
              <button className="rounded-lg border px-3 py-2" onClick={() => delRow(row.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
