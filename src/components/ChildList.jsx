import React, { useMemo, useState } from 'react';
import ChildDetailsModal from './ChildDetailsModal';

function monthKey(d = new Date()){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}
function dateKey(d = new Date()){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function ChildList({ role, childrenData, setChildrenData, scannedId }) {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(null);

  const filtered = useMemo(()=>{
    const q = query.toLowerCase();
    let arr = childrenData;
    if (q) {
      arr = arr.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.school.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }
    if (scannedId) {
      arr = arr.filter(c => c.id.toLowerCase() === scannedId.toLowerCase());
    }
    return arr;
  }, [childrenData, query, scannedId]);

  const addChild = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newChild = {
      id: form.get('id'),
      name: form.get('name'),
      school: form.get('school'),
      phone: form.get('phone'),
      gender: form.get('gender'),
      photo: form.get('photo'),
      route: {
        destination: form.get('destination'),
        distanceKm: Number(form.get('distanceKm') || 0),
      },
      seasonActive: false,
      seasonStart: null,
      visits: {},
    };
    if (!newChild.id || !newChild.name) return;
    setChildrenData(prev => {
      const exists = prev.find(c => c.id === newChild.id);
      if (exists) return prev;
      const updated = [...prev, newChild];
      localStorage.setItem('childrenDB', JSON.stringify(updated));
      return updated;
    });
    e.currentTarget.reset();
  };

  const toggleSeason = (id, active) => {
    setChildrenData(prev => {
      const updated = prev.map(c => {
        if (c.id !== id) return c;
        if (active) {
          return { ...c, seasonActive: true, seasonStart: new Date().toISOString() };
        }
        return { ...c, seasonActive: false };
      });
      localStorage.setItem('childrenDB', JSON.stringify(updated));
      return updated;
    });
  };

  const markTrip = (id) => {
    setChildrenData(prev => {
      const today = dateKey();
      const updated = prev.map(c => {
        if (c.id !== id) return c;
        // Check season active and not expired (30 days)
        const now = new Date();
        const start = c.seasonStart ? new Date(c.seasonStart) : null;
        if (!c.seasonActive || !start || (now.getTime() - start.getTime()) > 30*24*60*60*1000) {
          return c;
        }
        const count = (c.visits && c.visits[today]) || 0;
        if (count >= 2) return c; // daily limit reached
        const visits = { ...(c.visits || {}) };
        visits[today] = count + 1;
        return { ...c, visits };
      });
      localStorage.setItem('childrenDB', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Search by name, school or ID" />
      </div>

      {role === 'admin' && (
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-medium mb-3">Add Child</h3>
          <form onSubmit={addChild} className="grid md:grid-cols-3 gap-3">
            <input name="id" className="border rounded px-3 py-2" placeholder="ID (for QR)" required />
            <input name="name" className="border rounded px-3 py-2" placeholder="Full name" required />
            <input name="school" className="border rounded px-3 py-2" placeholder="School" />
            <input name="phone" className="border rounded px-3 py-2" placeholder="Phone" />
            <select name="gender" className="border rounded px-3 py-2">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input name="photo" className="border rounded px-3 py-2" placeholder="Photo URL (optional)" />
            <input name="destination" className="border rounded px-3 py-2" placeholder="Destination (e.g., Mihiripenna)" />
            <input name="distanceKm" className="border rounded px-3 py-2" placeholder="Distance in km (e.g., 8)" type="number" step="0.1" />
            <button className="px-3 py-2 rounded bg-green-600 text-white">Add</button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(child => {
          const today = dateKey();
          const todayCount = (child.visits && child.visits[today]) || 0;
          const seasonExpired = child.seasonStart ? ((new Date().getTime() - new Date(child.seasonStart).getTime()) > 30*24*60*60*1000) : true;
          const canRide = child.seasonActive && !seasonExpired && todayCount < 2;
          return (
            <div key={child.id} className="bg-white border rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img src={child.photo || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(child.name)}`} alt={child.name} className="w-14 h-14 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{child.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${child.seasonActive && !seasonExpired ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {child.seasonActive && !seasonExpired ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{child.school} • {child.gender}</p>
                  <p className="text-xs text-gray-500">{child.route?.destination} • {child.route?.distanceKm} km</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>Today trips: {todayCount}/2</span>
                <span className="mx-1">•</span>
                <span>ID: {child.id}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button onClick={()=>setShowModal(child)} className="px-3 py-1.5 rounded border">Details & Calendar</button>
                <a
                  className="px-3 py-1.5 rounded border"
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(child.id)}`}
                  download={`${child.name}-qr.png`}
                >Download QR</a>
                {role === 'conductor' && (
                  <button
                    onClick={()=> markTrip(child.id)}
                    className={`px-3 py-1.5 rounded text-white ${canRide ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!canRide}
                  >Scan Ride</button>
                )}
                {role === 'admin' && (
                  <>
                    <button onClick={()=>toggleSeason(child.id, true)} className="px-3 py-1.5 rounded bg-green-600 text-white">Activate</button>
                    <button onClick={()=>toggleSeason(child.id, false)} className="px-3 py-1.5 rounded bg-red-600 text-white">Deactivate</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal ? (
        <ChildDetailsModal child={showModal} onClose={()=>setShowModal(null)} />
      ) : null}
    </div>
  );
}
