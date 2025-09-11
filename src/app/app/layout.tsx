'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Simulate static user data (no backend or Supabase)
  useEffect(() => {
    setTimeout(() => {
      // Simulate the "logged-in" user data
      setDisplayName('Alishba');  // Simulated name
      setEmail('alishba@gmail.com');  // Simulated email
      setLoading(false);
    }, 1000);  // Simulate loading delay
  }, []);

  const nav = [
    { href: '/app', label: 'Overview' },
    { href: '/app/donations', label: 'Add Donation' },
    { href: '/app/people', label: 'Search Record' },
    { href: '/app/seasons', label: 'Seasons' },
  ];

  const signOut = () => {
    // Simulate sign-out process (e.g., reset state or redirect to sign-in)
    alert('You have been signed out');
    router.replace('/auth/signin');  // Redirect to sign-in page (static page)
  };

  const active = (href: string) =>
    pathname === href ? 'text-white' : 'text-white/90 hover:bg-white/5';

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="grid grid-cols-[240px_1fr] gap-6">
        <aside className="sticky top-6 h-[calc(100vh-3rem)] rounded-2xl bg-black px-4 py-5 text-white">
          <div className="text-sm font-bold">Donation Manager</div>
          <div className="mt-2 font-semibold text-cyan-300">
            Welcome {displayName}
          </div>

          <div className="mt-3 text-xs tracking-wide text-white/70">DASHBOARD</div>
          <nav className="mt-2 flex flex-col gap-2">
            {nav.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className={`rounded-xl px-3 py-2 text-sm ${active(i.href)}`}
                style={pathname === i.href ? { background: 'linear-gradient(90deg,#8b5cf6,#f59e0b)' } : {}}
              >
                {i.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="mb-2 break-all text-[11px] text-white/70">{email}</div>
            <button
              onClick={signOut}
              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800"
            >
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-3rem)] rounded-2xl bg-zinc-100 p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
