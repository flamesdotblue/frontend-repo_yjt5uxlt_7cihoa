import React from 'react';
import { ScanLine } from 'lucide-react';

export default function Scanner({ scannedId, setScannedId }) {
  return (
    <div className="max-w-5xl mx-auto px-4 mt-6">
      <div className="rounded-xl border bg-white/70 backdrop-blur p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2 text-gray-700">
          <ScanLine className="h-5 w-5" />
          <span className="text-sm font-medium">QR Scan (type or paste ID)</span>
        </div>
        <input
          value={scannedId}
          onChange={(e) => setScannedId(e.target.value)}
          placeholder="e.g., CHILD-001"
          className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => setScannedId('')}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
