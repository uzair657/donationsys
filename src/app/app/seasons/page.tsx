'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

type Season = { id:string; name:string; year:number; is_active:boolean; };

export default function SeasonsPage() {
  const [name, setName] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [items, setItems] = useState<Season[]>([]);

  const load = async () => {
    const { data } = await supabase.from('seasons').select('*').order('year', { ascending: false });
    setItems((data as any) ?? []);
  };

  useEffect(() => { load(); }, []);

  const createSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('seasons').insert({ name, year });
    setName(''); setYear(new Date().getFullYear()); load();
  };

  const setActive = async (id: string) => {
    const { data: all } = await supabase.from('seasons').select('id');
    if (all) {
      const ids = (all as any[]).map(x=>x.id);
      await supabase.from('seasons').update({ is_active: false }).in('id', ids);
    }
    await supabase.from('seasons').update({ is_active: true }).eq('id', id);
    load();
  };

  return (
    <div className="container">
      <h2 className="title">Seasons</h2>
      <div className="card">
        <form onSubmit={createSeason} className="row">
          <input className="input" placeholder="name (e.g., Ramadan)" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" type="number" value={year} onChange={e=>setYear(parseInt(e.target.value||'0',10))} />
          <button className="btn">Add</button>
        </form>
      </div>

      {items.map(s => (
        <div className="card" key={s.id}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div><b>{s.name}</b> – {s.year}</div>
            <div>
              {s.is_active ? <span className="badge">active</span> : <button className="btn" onClick={()=>setActive(s.id)}>Set active</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
