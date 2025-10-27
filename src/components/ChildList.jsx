import React, { useMemo, useState } from 'react';
import { QrCode, UserPlus, Check, X, Download, Info, Bus } from 'lucide-react';
import Calendar from './Calendar';

const QR_API = 'https://api.qrserver.com/v1/create-qr-code/';

function daysBetween(a, b) {
  const ms = 24 * 60 * 60 * 1000;
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end - start) / ms);
}

function fmtKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function ChildList({ role, childrenData, setChildrenData, scannedId }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [newChild, setNewChild] = useState({
    id: '',
    name: '',
    school: '',
    phone: '',
    gender: 'Male',
    photo: '',
    route: { destination: '', distanceKm: '' },
  });

  const filtered = useMemo(() => {
    const base = scannedId
      ? childrenData.filter((c) => c.id.toLowerCase().includes(scannedId.toLowerCase()))
      : childrenData;
    if (!query) return base;
    return base.filter((c) =>
      [c.id, c.name, c.school, c.phone, c.route?.destination]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query.toLowerCase()))
    );
  }, [childrenData, scannedId, query]);

  const toggleSeason = (id) => {
    setChildrenData((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              seasonActive: !c.seasonActive,
              seasonStart: !c.seasonActive ? new Date().toISOString() : c.seasonStart,
            }
          : c
      )
    );
  };

  const markTrip = (id) => {
    setChildrenData((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        // Season validity check (30 days)
        let active = c.seasonActive;
        if (c.seasonActive && c.seasonStart) {
          const started = new Date(c.seasonStart);
          const diff = daysBetween(started, new Date());
          if (diff >= 30) active = false;
        }
        if (!active) return { ...c, seasonActive: false };

        const key = fmtKey(new Date());
        const current = c.visits?.[key] || 0;
        if (current >= 2) return c; // already max trips today
        const updated = { ...(c.visits || {}), [key]: current + 1 };
        return { ...c, visits: updated };
      })
    );
  };

  const handleAddChild = (e) => {
    e.preventDefault();
    if (!newChild.id || !newChild.name) return;
    setChildrenData((prev) => [
      ...prev,
      {
        id: newChild.id.trim(),
        name: newChild.name.trim(),
        school: newChild.school.trim(),
        phone: newChild.phone.trim(),
        gender: newChild.gender,
        photo: newChild.photo,
        route: { destination: newChild.route.destination.trim(), distanceKm: Number(newChild.route.distanceKm) || 0 },
        seasonActive: false,
        seasonStart: null,
        visits: {},
      },
    ]);
    setNewChild({ id: '', name: '', school: '', phone: '', gender: 'Male', photo: '', route: { destination: '', distanceKm: '' } });
  };

  const handlePhotoUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <input
          placeholder="Search by name, ID, school, phone, destination..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <div className="text-sm text-gray-500">{filtered.length} result(s)</div>
      </div>

      {role === 'admin' && (
        <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><UserPlus className="h-4 w-4" /> Add Child</h3>
          <form onSubmit={handleAddChild} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Child ID</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={newChild.id}
                onChange={(e) => setNewChild((s) => ({ ...s, id: e.target.value }))}
                placeholder="e.g., CHILD-003"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={newChild.name}
                onChange={(e) => setNewChild((s) => ({ ...s, name: e.target.value }))}
                placeholder="Student name"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">School</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={newChild.school}
                onChange={(e) => setNewChild((s) => ({ ...s, school: e.target.value }))}
                placeholder="School"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={newChild.phone}
                onChange={(e) => setNewChild((s) => ({ ...s, phone: e.target.value }))}
                placeholder="07X-XXXXXXX"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={newChild.gender}
                onChange={(e) => setNewChild((s) => ({ ...s, gender: e.target.value }))}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const dataUrl = await handlePhotoUpload(file);
                  setNewChild((s) => ({ ...s, photo: dataUrl }));
                }}
                className="w-full rounded-md border px-3 py-1.5"
              />
              {newChild.photo && (
                <img src={newChild.photo} alt="preview" className="mt-2 h-16 w-16 object-cover rounded-md border" />
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Destination</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={newChild.route.destination}
                onChange={(e) => setNewChild((s) => ({ ...s, route: { ...s.route, destination: e.target.value } }))}
                placeholder="e.g., Mihiripenna"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Distance (km)</label>
              <input
                type="number"
                className="w-full rounded-md border px-3 py-2"
                value={newChild.route.distanceKm}
                onChange={(e) => setNewChild((s) => ({ ...s, route: { ...s.route, distanceKm: e.target.value } }))}
                placeholder="e.g., 8"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="rounded-md bg-emerald-600 text-white px-4 py-2">Add Child</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((c) => {
          // auto expire
          let seasonActive = c.seasonActive;
          if (seasonActive && c.seasonStart) {
            const diff = daysBetween(new Date(c.seasonStart), new Date());
            if (diff >= 30) seasonActive = false;
          }
          const tripsToday = c.visits?.[fmtKey(new Date())] || 0;

          return (
            <div key={c.id} className="rounded-xl border bg-white/70 backdrop-blur p-4">
              <div className="flex items-start gap-4">
                <img
                  src={c.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name || c.id)}`}
                  alt={c.name}
                  className="h-16 w-16 rounded-lg object-cover border"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-gray-600">{c.id}</div>
                    {c.school && <div className="text-sm text-gray-600">{c.school}</div>}
                  </div>
                  <div className="text-sm text-gray-700">
                    <div>Phone: <span className="text-gray-600">{c.phone || '-'}</span></div>
                    <div>Gender: <span className="text-gray-600">{c.gender}</span></div>
                    <div className="flex items-center gap-1"><Bus className="h-4 w-4"/> Route: <span className="text-gray-600">{c.route?.destination || '-'} {c.route?.distanceKm ? `• ${c.route.distanceKm} km` : ''}</span></div>
                  </div>
                  <div className="flex md:justify-end gap-2 mt-2 md:mt-0">
                    <a
                      href={`${QR_API}?size=800x800&data=${encodeURIComponent(c.id)}`}
                      download={`${c.id}.png`}
                      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4"/> QR PNG
                    </a>
                    {role === 'admin' && (
                      <button
                        onClick={() => toggleSeason(c.id)}
                        className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm border ${
                          seasonActive ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {seasonActive ? (<><X className="h-4 w-4"/> Deactivate</>) : (<><Check className="h-4 w-4"/> Activate</>)}
                      </button>
                    )}
                    <button
                      onClick={() => markTrip(c.id)}
                      disabled={!seasonActive || tripsToday >= 2}
                      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm border ${
                        !seasonActive || tripsToday >= 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                      title={!seasonActive ? 'Season inactive/expired' : tripsToday >= 2 ? 'Limit reached' : 'Mark trip'}
                    >
                      Mark Trip
                    </button>
                    <button
                      onClick={() => setExpanded((s) => (s === c.id ? null : c.id))}
                      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <Info className="h-4 w-4"/> Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border ${seasonActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600'}`}>
                  {seasonActive ? 'Season Active' : 'Season Inactive'}
                </span>
                {c.seasonStart && (
                  <span className="text-gray-600">Start: {new Date(c.seasonStart).toLocaleDateString()}</span>
                )}
                {c.seasonStart && (
                  <span className="text-gray-600">Expires: {new Date(new Date(c.seasonStart).getTime() + 29*24*60*60*1000).toLocaleDateString()}</span>
                )}
                <span className="text-gray-600">Today trips: {tripsToday}/2</span>
              </div>

              {expanded === c.id && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Calendar visits={c.visits || {}} />
                  </div>
                  <div className="rounded-lg border p-3 bg-white">
                    <h4 className="font-medium mb-2 flex items-center gap-2"><QrCode className="h-4 w-4"/> QR Preview</h4>
                    <img
                      src={`${QR_API}?size=160x160&data=${encodeURIComponent(c.id)}`}
                      alt="QR"
                      className="border rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-2 break-words">ID: {c.id}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
