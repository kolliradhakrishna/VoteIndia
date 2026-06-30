import { useState } from 'react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CalendarPicker = ({ selectedDate, onSelect }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date(today.getFullYear() - 20, today.getMonth(), 1)
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const years = [];
  for (let y = today.getFullYear(); y >= 1920; y--) years.push(y);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1);
    if (next <= today) setViewDate(next);
  };

  const handleDayClick = (day) => {
    const clicked = new Date(year, month, day);
    if (clicked > today) return;
    onSelect(clicked);
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  };

  const isToday = (day) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isFuture = (day) => new Date(year, month, day) > today;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="calendar-wrapper animate-fadeInUp">
      <div className="calendar-header">
        <button
          className="calendar-nav-btn"
          onClick={prevMonth}
          aria-label="Previous month"
          id="cal-prev-btn"
        >
          ‹
        </button>

        <div className="calendar-month-year">
          <select
            id="cal-month-select"
            value={month}
            onChange={(e) => setViewDate(new Date(year, Number(e.target.value), 1))}
            aria-label="Select month"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <select
            id="cal-year-select"
            value={year}
            onChange={(e) => setViewDate(new Date(Number(e.target.value), month, 1))}
            aria-label="Select year"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          className="calendar-nav-btn"
          onClick={nextMonth}
          aria-label="Next month"
          id="cal-next-btn"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {DAYS.map((d) => (
          <div key={d} className="calendar-day-name">{d}</div>
        ))}
        {cells.map((day, idx) =>
          day === null ? (
            <div key={`empty-${idx}`} className="calendar-day empty" />
          ) : (
            <div
              key={day}
              id={`cal-day-${day}`}
              className={`calendar-day${isSelected(day) ? ' selected' : ''}${isToday(day) ? ' today' : ''}${isFuture(day) ? ' disabled' : ''}`}
              onClick={() => !isFuture(day) && handleDayClick(day)}
              role="button"
              aria-label={`${MONTHS[month]} ${day}, ${year}`}
              aria-pressed={isSelected(day)}
            >
              {day}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;
