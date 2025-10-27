import React from 'react';
import Calendar from './Calendar';

export default function ChildDetailsModal({ child, onClose }) {
  if (!child) return null;
  const monthDate = new Date();

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-start gap-4 p-4 border-b">
          <img src={child.photo || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(child.name)}`} alt={child.name} className="w-20 h-20 rounded object-cover" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{child.name}</h3>
            <p className="text-sm text-gray-600">{child.school} • {child.gender}</p>
            <p className="text-sm text-gray-600">Phone: {child.phone}</p>
            <p className="text-sm text-gray-600">Route: {child.route?.destination} • {child.route?.distanceKm} km</p>
          </div>
          <button onClick={onClose} className="px-3 py-1.5 rounded border text-sm">Close</button>
        </div>
        <div className="p-4 grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Season Status</h4>
            <div className="space-y-2 text-sm">
              <p>Active: <span className={`font-medium ${child.seasonActive ? 'text-green-600' : 'text-red-600'}`}>{child.seasonActive ? 'Yes' : 'No'}</span></p>
              <p>Start: <span className="font-medium">{child.seasonStart ? new Date(child.seasonStart).toLocaleDateString() : '—'}</span></p>
              <p>Expires: <span className="font-medium">{child.seasonStart ? new Date(new Date(child.seasonStart).getTime() + 30*24*60*60*1000).toLocaleDateString() : '—'}</span></p>
              <p>Daily limit: <span className="font-medium">2 trips</span></p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">QR Code</h4>
              <div className="flex items-center gap-4">
                <img
                  className="border rounded p-2 bg-white"
                  alt="QR"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(child.id)}`}
                />
                <a
                  className="px-3 py-2 bg-gray-900 text-white rounded text-sm"
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(child.id)}`}
                  download={`${child.name}-qr.png`}
                >
                  Download
                </a>
              </div>
            </div>
          </div>
          <div>
            <Calendar visits={child.visits || {}} monthDate={monthDate} />
          </div>
        </div>
      </div>
    </div>
  );
}
