import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("conductor");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple demo credentials
    // Admin can add children; conductor scans and marks rides
    if (role === "admin" && username === "admin" && password === "admin123") {
      onLogin({ username, role });
    } else if (role === "conductor" && username === "user" && password === "user123") {
      onLogin({ username, role });
    } else {
      setError("Invalid credentials. Try admin/admin123 or user/user123.");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border rounded-lg p-6 shadow-sm space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Sign in</h2>
          <p className="text-sm text-gray-500">Choose role and enter credentials</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setRole("conductor")} className={`py-2 rounded border text-sm ${role === "conductor" ? "bg-blue-600 text-white border-blue-600" : "bg-white"}`}>Conductor</button>
          <button type="button" onClick={() => setRole("admin")} className={`py-2 rounded border text-sm ${role === "admin" ? "bg-blue-600 text-white border-blue-600" : "bg-white"}`}>Admin</button>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Username</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="admin or user" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="••••••••" />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="w-full py-2 rounded bg-gray-900 text-white hover:bg-gray-800">Sign in</button>
      </form>
    </div>
  );
}
