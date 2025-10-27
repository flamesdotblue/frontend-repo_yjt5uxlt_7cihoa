import React from 'react';

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-blue-600 text-white flex items-center justify-center font-bold">SB</div>
          <div>
            <h1 className="text-lg font-semibold">School Bus Seasons</h1>
            <p className="text-xs text-gray-500">QR scan and monthly season tracking</p>
          </div>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Signed in as {user.role}</span>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
