import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Scanner from './components/Scanner';
import ChildList from './components/ChildList';

const seedChildren = [
  {
    id: 'CHILD-001',
    name: 'Kavindu Perera',
    school: 'Royal College',
    phone: '+94 71 234 5678',
    gender: 'Male',
    photo: '',
    route: { destination: 'Mihiripenna', distanceKm: 8 },
    seasonActive: true,
    seasonStart: new Date().toISOString(),
    visits: {},
  },
  {
    id: 'CHILD-002',
    name: 'Imasha Nethmi',
    school: 'Visakha Vidyalaya',
    phone: '+94 77 111 2222',
    gender: 'Female',
    photo: '',
    route: { destination: 'Walimada', distanceKm: 12 },
    seasonActive: false,
    seasonStart: null,
    visits: {},
  },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [scannedId, setScannedId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem('childrenDB');
    if (stored) {
      try { setChildrenData(JSON.parse(stored)); } catch {}
    } else {
      localStorage.setItem('childrenDB', JSON.stringify(seedChildren));
      setChildrenData(seedChildren);
    }
  }, []);

  const handleScan = (code) => {
    setScannedId(code);
    // Optionally auto-mark ride for conductor if code matches and allowed
  };

  const clearScan = () => setScannedId("");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header user={user} onLogout={()=>{ setUser(null); }} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {!user ? (
          <Login onLogin={setUser} />
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 order-2 md:order-1">
                <ChildList
                  role={user.role}
                  childrenData={childrenData}
                  setChildrenData={setChildrenData}
                  scannedId={scannedId}
                />
              </div>
              <div className="order-1 md:order-2 space-y-3">
                <Scanner onScan={handleScan} />
                {scannedId ? (
                  <div className="bg-white border rounded-lg p-4 text-sm flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">Last scanned</p>
                      <p className="text-gray-600">{scannedId}</p>
                    </div>
                    <button onClick={clearScan} className="px-2 py-1 rounded border">Clear</button>
                  </div>
                ) : null}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="font-medium mb-1">How it works</p>
                  <ul className="list-disc pl-5 space-y-1 text-blue-900">
                    <li>Admin adds children and activates monthly season.</li>
                    <li>Conductor scans QR and marks up to 2 rides per day.</li>
                    <li>Calendar highlights first ride (yellow) and second ride (orange).</li>
                    <li>QR can be downloaded for printing.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
