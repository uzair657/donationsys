'use client';

import { useState } from 'react';
import Donut from '@/app/app/components/Donut';

export default function Dashboard() {
  
  const [peopleCount] = useState(150); 
  const [donationCount] = useState(45); 
  const [totalAmount] = useState(150000); 

  const pct1 = Math.min(100, donationCount % 100);
  const pct2 = Math.min(100, peopleCount % 100);
  const pct3 = Math.min(100, Math.round((totalAmount % 100000) / 1000));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-2 text-sm font-semibold">Total Donations</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{donationCount}</div>
            <Donut percent={pct1} color="#c79bf2" />
          </div>
        </div>

      
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-2 text-sm font-semibold">Total Users</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{peopleCount}</div>
            <Donut percent={pct2} color="#7dd3fc" />
          </div>
        </div>

        
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
