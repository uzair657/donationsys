'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setBusy(true);

  
    if (!identifier || !password) {
      setMsg('Please enter both email/username and password');
      setBusy(false);
      return;
    }

    setTimeout(() => {
     
      alert(`Logged in as ${identifier}`);
      router.push('/app'); 
      setBusy(false);
    }, 1000); 

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign In</h1>

        <form onSubmit={signIn} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email/Username</label>
            <input
              type="text"
              placeholder="Enter email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

         
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-60"
          >
            {busy ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

       
        {msg && <p className="mt-4 text-center text-red-600 text-sm">{msg}</p>}

     
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
