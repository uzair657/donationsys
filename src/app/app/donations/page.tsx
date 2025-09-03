'use client';
import { useEffect,  useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

type Person = { id:string; full_name:string; cnic:string; address:string|null };
type DonationRow = { id:string; person:Person; amount:number; notes:string|null };

export default function DonationsPage() {
  const [activeSeason, setActiveSeason] = useState<any>(null);
  const [list, setList] = useState<DonationRow[]>([]);
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState<string>('');

  const loadSeason = async () => {
    const { data } = await supabase.from('seasons').select('*').eq('is_active', true).maybeSingle();
    setActiveSeason(data);
  };

  const loadList = async () => {
    if (!activeSeason) return;
    const { data, error } = await supabase
      .from('donations')
      .select('id, amount, notes, person:people(id, full_name, cnic, address)')
      .eq('season_id', activeSeason.id)
      .order('created_at', { ascending: false });
    if (!error) setList((data as any) ?? []);
  };

  useEffect(() => { loadSeason(); }, []);
  useEffect(() => { loadList(); }, [activeSeason?.id]);

  const addDonation = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    if (!activeSeason) { setMsg('Please set an active season in Seasons page.'); return; }

    // find or create person
    const { data: p } = await supabase.from('people').select('*').eq('cnic', cnic).maybeSingle();
    let personId = p?.id;
    if (!personId) {
      const { data: created, error: createErr } = await supabase
        .from('people')
        .insert({ full_name: fullName, cnic, address })
        .select().single();
      if (createErr || !created) { setMsg(createErr?.message || 'Error saving person'); return; }
      personId = created.id;
    }

    // check duplicate for season
    const { data: exists } = await supabase
      .from('donations').select('id')
      .eq('person_id', personId).eq('season_id', activeSeason.id).maybeSingle();

    if (exists) { setMsg(`Already donated in ${activeSeason.name} ${activeSeason.year}.`); return; }

    const { error } = await supabase
      .from('donations').insert({ person_id: personId, season_id: activeSeason.id, amount, notes });
    if (error) { setMsg(error.message); return; }

    setFullName(''); setCnic(''); setAddress(''); setAmount(0); setNotes('');
    await loadList();
    setMsg('Saved.');
  };

  const delRow = async (id: string) => {
    await supabase.from('donations').delete().eq('id', id);
    loadList();
  };

  const editAmount = async (id: string, value: number) => {
    await supabase.from('donations').update({ amount: value }).eq('id', id);
  };

  return (
    <div className="container">
      <h2 className="title">Donations {activeSeason ? `– ${activeSeason.name} ${activeSeason.year}` : ''}</h2>

      <div className="card">
        <form onSubmit={addDonation}>
          <div className="row">
            <input className="input" placeholder="full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
            <input className="input" placeholder="cnic" value={cnic} onChange={e=>setCnic(e.target.value)} />
          </div>
        <div className="row">
            <input className="input" placeholder="address" value={address} onChange={e=>setAddress(e.target.value)} />
            <input className="input" type="number" placeholder="amount" value={amount}
                   onChange={e=>setAmount(parseFloat(e.target.value||'0'))} />
          </div>
          <input className="input" placeholder="notes" value={notes} onChange={e=>setNotes(e.target.value)} style={{ margin:'8px 0' }} />
          <button className="btn">Save</button>
        </form>
        {msg && <p style={{ color: msg==='Saved.' ? 'green':'crimson', marginTop:8 }}>{msg}</p>}
      </div>

      {list.map(row => (
        <div className="card" key={row.id}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
            <div>
              <b>{row.person.full_name}</b> – {row.person.cnic}
              <div style={{ fontSize:12, color:'#666' }}>{row.person.address}</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <input type="number" className="input" style={{ width:120 }}
                     defaultValue={row.amount}
                     onBlur={(e)=>editAmount(row.id, parseFloat(e.currentTarget.value||'0'))} />
              <button className="btn" onClick={()=>delRow(row.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
