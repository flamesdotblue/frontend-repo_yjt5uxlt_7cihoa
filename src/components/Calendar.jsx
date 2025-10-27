import React from 'react';

function getMonthMatrix(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = new Date(firstDay);
  startDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7)); // Monday first
  const matrix = [];
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(startDay);
      day.setDate(startDay.getDate() + w * 7 + d);
      week.push(day);
    }
    matrix.push(week);
  }
  return matrix;
}

function fmtKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function Calendar({ visits = {}, currentDate = new Date() }) {
  const matrix = getMonthMatrix(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <h4 className="font-medium">{monthName} {year}</h4>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400 border" /> First trip
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500 border" /> Second trip
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <div key={d} className="text-center text-gray-500 py-1">{d}</div>
        ))}
        {matrix.flat().map((day, idx) => {
          const inMonth = day.getMonth() === currentDate.getMonth();
          const key = fmtKey(day);
          const count = visits[key] || 0;
          return (
            <div
              key={idx}
              className={`h-16 rounded-md border p-1 ${inMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] text-gray-500">{day.getDate()}</span>
                <div className="flex gap-1">
                  <span className={`h-3 w-3 rounded-full border ${count >= 1 ? 'bg-yellow-400' : 'bg-transparent'}`} />
                  <span className={`h-3 w-3 rounded-full border ${count >= 2 ? 'bg-orange-500' : 'bg-transparent'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
