'use client';

import { useState } from 'react';

type Season = { id: string; name: string; year: number; is_active: boolean };

export default function SeasonsPage() {
  const [name, setName] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Static data for seasons
  const [items, setItems] = useState<Season[]>([
    { id: '1', name: 'Ramadan', year: 2025, is_active: true },
    { id: '2', name: 'Winter', year: 2024, is_active: false },
    { id: '3', name: 'Spring', year: 2023, is_active: false },
  ]);

  const createSeason = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate adding a season
    const newSeason: Season = {
      id: String(items.length + 1), // simple increment of id
      name,
      year,
      is_active: false,
    };
    setItems((prevItems) => [...prevItems, newSeason]);
    setName('');
    setYear(new Date().getFullYear());
  };

  const setActive = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((season) =>
        season.id === id
          ? { ...season, is_active: true }
          : { ...season, is_active: false }
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Seasons</h2>

      {/* Add new season form */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <form onSubmit={createSeason} className="flex gap-4">
          <input
            className="w-full p-3 rounded-lg border border-gray-300"
            placeholder="Season name (e.g., Ramadan)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="w-1/3 p-3 rounded-lg border border-gray-300"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <button
            type="submit"
            className="bg-black text-white py-3 px-6 rounded-lg disabled:opacity-60"
          >
            Add
          </button>
        </form>
      </div>

      {/* Displaying the seasons */}
      {items.map((s) => (
        <div key={s.id} className="bg-white rounded-xl p-4 shadow-md mb-4">
          <div className="flex justify-between items-center">
            <div>
              <b>{s.name}</b> – {s.year}
            </div>
            <div>
              {s.is_active ? (
                <span className="bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full">
                  Active
                </span>
              ) : (
                <button
                  onClick={() => setActive(s.id)}
                  className="bg-blue-600 text-white py-1 px-4 rounded-lg"
                >
                  Set active
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
