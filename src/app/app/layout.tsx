// app/app/layout.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { router.replace('/auth/signin'); return; }

      const email = auth.user.email ?? '';
      setEmail(email);

      // try user_public.first_name first
      let name = '';
      const { data: prof } = await supabase
        .from('user_public')
        .select('first_name, last_name')
        .eq('user_id', auth.user.id)
        .maybeSingle();

      if (prof?.first_name) name = prof.first_name;
      // fallback: auth.user.user_metadata or email prefix
      if (!name) name = (auth.user.user_metadata as any)?.first_name || (email?.split('@')[0] ?? '');

      setDisplayName(name);
    })();
  }, [router]);

  const nav = [
    { href: '/app', label: 'Overview' },
    { href: '/app/donations', label: 'Add Donation' },
    { href: '/app/people', label: 'Search Record' },
    { href: '/app/seasons', label: 'Seasons' },
  ];

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/signin');
  };

  const active = (href: string) =>
    pathname === href ? 'text-white' : 'text-white/90 hover:bg-white/5';

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
