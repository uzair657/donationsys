'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import Donut from '@/app/app/components/Donut';

export default function Dashboard() {
  const [peopleCount, setPeopleCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    (async () => {
      const { count: ppl } =
        await supabase.from('people').select('*', { count: 'exact', head: true });
      setPeopleCount(ppl ?? 0);

      const { count: dons } =
        await supabase.from('donations').select('*', { count: 'exact', head: true });
      setDonationCount(dons ?? 0);

      const { data } = await supabase.from('donations').select('amount');
      const sum = (data ?? []).reduce((s, r: any) => s + Number(r.amount || 0), 0);
      setTotalAmount(sum);
    })();
  }, []);

  const pct1 = Math.min(100, donationCount % 100);
  const pct2 = Math.min(100, peopleCount % 100);
  const pct3 = Math.min(100, Math.round((totalAmount % 100000) / 1000));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Donations */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-2 text-sm font-semibold">Total Donations</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{donationCount}</div>
            <Donut percent={pct1} color="#c79bf2" />
          </div>
        </div>

        {/* Total Users (people) */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-2 text-sm font-semibold">Total Users</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{peopleCount}</div>
            <Donut percent={pct2} color="#7dd3fc" />
          </div>
        </div>

        {/* Total Amount Spend */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-2 text-sm font-semibold">Total Amount Spend</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{formatPKR(totalAmount)} PKR</div>
            <Donut percent={pct3} color="#86efac" />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPKR(n: number) {
  try {
    return new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
}
