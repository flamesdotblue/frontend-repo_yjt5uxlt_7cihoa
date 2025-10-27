import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Scanner from './components/Scanner';
import ChildList from './components/ChildList';

const LS_KEY = 'childrenDB';
const USER_KEY = 'busapp_user';

const seedChildren = [
  {
    id: 'CHILD-001',
    name: 'Kavindu Perera',
    school: 'Royal College',
    phone: '0712345678',
    gender: 'Male',
    photo: '',
    route: { destination: 'Mihiripenna', distanceKm: 8 },
    seasonActive: true,
    seasonStart: new Date().toISOString(),
    visits: {},
  },
  {
    id: 'CHILD-002',
    name: 'Nethmi Silva',
    school: 'Visakha Vidyalaya',
    phone: '0779876543',
    gender: 'Female',
    photo: '',
    route: { destination: 'Walasmulla', distanceKm: 12 },
    seasonActive: false,
    seasonStart: null,
    visits: {},
  },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [scannedId, setScannedId] = useState('');

  // load
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      setChildrenData(Array.isArray(saved) ? saved : seedChildren);
    } catch (e) {
      setChildrenData(seedChildren);
    }
    try {
      const savedUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      if (savedUser) setUser(savedUser);
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(childrenData));
  }, [childrenData]);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-900">
      <Header user={user} onLogout={handleLogout} />
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <div className="max-w-5xl mx-auto px-4 mt-6">
            <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
              <p className="text-sm text-gray-700">
                Signed in as <span className="font-medium">{user.username}</span> • Role: <span className="font-medium capitalize">{user.role}</span>
              </p>
            </div>
          </div>
          <Scanner scannedId={scannedId} setScannedId={setScannedId} />
          <ChildList
            role={user.role}
            childrenData={childrenData}
            setChildrenData={setChildrenData}
            scannedId={scannedId}
          />
        </>
      )}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-xs text-gray-500">
        Built for marking school bus seasons with QR in Sri Lanka • Max 2 rides/day • 30-day season
      </footer>
    </div>
  );
}
