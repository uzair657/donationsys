'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

export default function Dashboard() {
  const [peopleCount, setPeopleCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    (async () => {
      const { count: ppl } = await supabase.from('people').select('*', { count: 'exact', head: true });
      setPeopleCount(ppl ?? 0);

      const { count: dons } = await supabase.from('donations').select('*', { count: 'exact', head: true });
      setDonationCount(dons ?? 0);

      const { data } = await supabase.from('donations').select('amount');
      const sum = (data ?? []).reduce((s: number, r: { amount: number | null }) => s + Number(r.amount ?? 0), 0);
      setTotalAmount(sum);
    })();
  }, []);

  // ...rest stays the same
}
