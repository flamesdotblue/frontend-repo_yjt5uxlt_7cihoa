import React, { useState } from 'react';

const ROLES = [
  { key: 'admin', label: 'Admin', user: 'admin', pass: 'admin123' },
  { key: 'conductor', label: 'Conductor', user: 'user', pass: 'user123' },
];

export default function Login({ onLogin }) {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const rule = ROLES.find((r) => r.key === role);
    if (rule && username === rule.user && password === rule.pass) {
      onLogin({ role, username });
    } else {
      setError('Invalid credentials for selected role');
    }
  };

  const handleRole = (r) => {
    setRole(r.key);
    setUsername(r.user);
    setPassword(r.pass);
    setError('');
  };

  return (
    <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        <div className="flex gap-2 mb-4">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => handleRole(r)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                role === r.key ? 'bg-emerald-600 text-white border-emerald-600' : 'hover:bg-gray-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-emerald-600 text-white py-2 hover:bg-emerald-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
