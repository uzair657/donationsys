'use client';

import { useState } from 'react';

export default function PeoplePage() {
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState<{ text: string; color: 'red' | 'green' } | null>(null);

  // Mock data for active season and donations
  const activeSeason = { name: 'Winter 2025', year: 2025 };
  const donationList = [
    { id: '1', fullName: 'John Doe', cnic: '12345-6789', amount: 1000, notes: 'First donation' },
    { id: '2', fullName: 'Jane Smith', cnic: '98765-4321', amount: 2000, notes: 'Second donation' },
  ];

  // Simulate adding a donation
  const addDonation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !cnic || !address || !amount) {
      setMsg({ text: 'Please fill in all fields', color: 'red' });
      return;
    }

    const personExists = donationList.some((person) => person.cnic === cnic);

    if (personExists) {
      setMsg({ text: `Already donated in ${activeSeason.name} ${activeSeason.year}`, color: 'red' });
      return;
    }

    // Simulate donation saving
    donationList.push({ id: String(donationList.length + 1), fullName, cnic, amount, notes: note });

    setMsg({ text: 'Saved. New donation recorded.', color: 'green' });
    setFullName('');
    setCnic('');
    setAddress('');
    setAmount(0);
    setNote('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Add Person & Donation</h2>

      {/* Donation Form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <form onSubmit={addDonation} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="CNIC"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <textarea
            placeholder="Notes (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          ></textarea>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-black text-white disabled:opacity-60"
          >
            Save Donation
          </button>
        </form>

        {/* Message */}
        {msg && (
          <p className={`mt-3 text-center text-sm ${msg.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
            {msg.text}
          </p>
        )}
      </div>

      {/* Donation List */}
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
                onClick={() => setMsg({ text: `Donation with ID ${donation.id} deleted`, color: 'red' })}
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
