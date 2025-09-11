'use client';

import { useState } from 'react';

export default function DonationsPage() {
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState<string>('');

  // Placeholder data for donation list
  const donationList = [
    { id: '1', fullName: 'Meesam Mehdi', cnic: '35202-1234', amount: 1000, notes: 'First donation' },
    { id: '2', fullName: 'Ali Mehdi', cnic: '35202-4321', amount: 2000, notes: 'Second donation' },
  ];

  const addDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !cnic || !address || !amount) {
      setMsg('Please fill in all fields');
      return;
    }

    setMsg('Donation added successfully!');
    setFullName('');
    setCnic('');
    setAddress('');
    setAmount(0);
    setNotes('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Add Donation</h2>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <form onSubmit={addDonation} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-lg border px-4 py-3 bg-zinc-100"
            />
            <input
              type="text"
              placeholder="CNIC"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              className="rounded-lg border px-4 py-3 bg-zinc-100"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-lg border px-4 py-3 bg-zinc-100"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="rounded-lg border px-4 py-3 bg-zinc-100"
            />
          </div>
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 bg-zinc-100"
          ></textarea>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-black text-white disabled:opacity-60"
          >
            Save Donation
          </button>
        </form>
        {msg && <p className={`mt-3 text-sm ${msg === 'Donation added successfully!' ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      </div>

      <h3 className="text-lg font-semibold">Donation List</h3>
      {donationList.map((donation) => (
        <div key={donation.id} className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <div><b>{donation.fullName}</b> – {donation.cnic}</div>
              <div className="text-sm text-gray-600">{donation.notes}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-semibold">{donation.amount} PKR</div>
              <button
                onClick={() => setMsg(`Donation with ID ${donation.id} deleted`)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
