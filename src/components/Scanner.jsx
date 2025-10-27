import React, { useMemo, useState } from 'react';

export default function Scanner({ onScan }) {
  const [input, setInput] = useState("");
  const [hint, setHint] = useState("");

  const example = useMemo(() => {
    return "CHILD-001";
  }, []);

  const handleScan = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setHint("Enter or paste a QR code value (e.g., " + example + ")");
      return;
    }
    onScan(trimmed);
    setInput("");
    setHint("");
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Scan QR</h3>
        <span className="text-xs text-gray-500">Paste or type the code</span>
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder={`e.g., ${example}`}
          onKeyDown={(e)=>{ if(e.key==='Enter'){ handleScan(); } }}
        />
        <button onClick={handleScan} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Scan</button>
      </div>
      {hint ? <p className="text-xs text-gray-500 mt-2">{hint}</p> : null}
    </div>
  );
}
