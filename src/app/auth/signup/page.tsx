'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    // Basic validation checks
    if (!firstName || !lastName || !username || !email || !password) {
      setMsg('All fields are required');
      setBusy(false);
      return;
    }

    // Simulating successful sign-up
    setTimeout(() => {
      alert(`Account created for ${firstName} ${lastName}`);
      router.push('/app'); // Redirect to the Dashboard (replace with your actual page)
      setBusy(false);
    }, 1000); // Simulate delay for sign up
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 bg-black text-white rounded-lg disabled:opacity-60"
          >
            {busy ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {/* Error Message */}
        {msg && <p className="mt-3 text-center text-sm text-red-600">{msg}</p>}

        {/* Sign In Link */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-blue-600 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}
