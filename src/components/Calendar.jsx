import React from 'react';

function getMonthMatrix(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDay = d.getDay(); // 0-6
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const weeks = [];
  let current = 1 - startDay;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(date.getFullYear(), date.getMonth(), current);
      week.push({
        inMonth: current >= 1 && current <= daysInMonth,
        date: dayDate,
        day: dayDate.getDate(),
      });
      current++;
    }
    weeks.push(week);
  }
  return weeks;
}

export default function Calendar({ visits = {}, monthDate = new Date() }) {
  const weeks = getMonthMatrix(monthDate);
  const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth()+1).padStart(2,'0')}`;

  const getVisitCount = (d) => {
    const key = `${monthKey}-${String(d).padStart(2,'0')}`;
    return visits[key] || 0;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{monthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</h4>
        <span className="text-xs text-gray-500">Yellow = 1st trip, Orange = 2nd trip</span>
      </div>
      <div className="grid grid-cols-7 text-xs font-medium text-gray-500 mb-1">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=> <div key={d} className="p-2 text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((cell, idx) => {
          const count = cell.inMonth ? getVisitCount(cell.day) : 0;
          let bg = "";
          if (cell.inMonth && count === 1) bg = "bg-yellow-200";
          if (cell.inMonth && count >= 2) bg = "bg-orange-300";
          return (
            <div key={idx} className={`h-10 border rounded flex items-center justify-center ${cell.inMonth ? bg : 'bg-gray-50 text-gray-400'}`}>
              <span className="text-sm">{cell.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
