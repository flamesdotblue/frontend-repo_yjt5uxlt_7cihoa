import React from 'react';
import { LogOut } from 'lucide-react';

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500 text-white grid place-items-center font-bold">QR</div>
          <div>
            <h1 className="text-lg font-semibold">School Bus Seasons</h1>
            <p className="text-xs text-gray-500 leading-tight">Sri Lanka • QR Trip Marking</p>
          </div>
        </div>
        {user && (
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        )}
      </div>
    </header>
  );
}
