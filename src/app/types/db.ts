// src/types/db.ts
export type Person = {
  id: string;
  full_name: string;
  cnic: string;
  address: string | null;
};

export type Season = {
  id: string;
  name: string;
  year: number;
  is_active: boolean;
};

export type Donation = {
  id: string;
  person_id: string;
  season_id: string;
  amount: number;
  notes: string | null;
  created_at: string;
};
