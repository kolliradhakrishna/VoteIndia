import { useState, useRef, useEffect } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CalendarPicker = ({ selectedDate, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();

  // Set initial view date to selected date, or today, or 20 years ago (typical DOB placeholder)
  const [viewDate, setViewDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  );

  const [showYearMonthSelector, setShowYearMonthSelector] = useState(false);

  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Close calendar popover on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current && !popoverRef.current.contains(event.target) &&
        triggerRef.current && !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setShowYearMonthSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate days in month and start day index
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Previous and next month handlers
  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDaySelect = (day, isCurrentMonth = true) => {
    let selected;
    if (isCurrentMonth) {
      selected = new Date(year, month, day);
    } else {
      if (day > 15) {
        selected = new Date(year, month - 1, day);
      } else {
        selected = new Date(year, month + 1, day);
      }
    }
    onSelect(selected);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onSelect(null);
    setIsOpen(false);
  };

  const selectToday = () => {
    onSelect(new Date());
    setIsOpen(false);
  };

  // Check if a day is the selected day
  const isSelected = (day, isCurrentMonth = true) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate);
    if (isCurrentMonth) {
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    } else {
      const targetMonth = day > 15 ? month - 1 : month + 1;
      const targetDate = new Date(year, targetMonth, day);
      return d.getDate() === targetDate.getDate() &&
             d.getMonth() === targetDate.getMonth() &&
             d.getFullYear() === targetDate.getFullYear();
    }
  };

  // Generate years list (1920 to today)
  const years = [];
  for (let y = today.getFullYear(); y >= 1920; y--) {
    years.push(y);
  }

  // Generate cells (prev month days, current month days, next month days)
  const cells = [];
  // Prev month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  // Next month padding to fill grid
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  // Formatting date for display in input
  const formatInputDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="custom-datepicker-container">
      {/* Date Input Field */}
      <div 
        ref={triggerRef}
        className="custom-datepicker-input-wrapper"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          readOnly
          placeholder="Select Date"
          value={formatInputDate(selectedDate)}
          className="custom-datepicker-input"
        />
        <span className="custom-datepicker-calendar-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </span>
      </div>

      {/* Date Picker Popover */}
      {isOpen && (
        <div ref={popoverRef} className="custom-datepicker-popover">
          <div className="custom-datepicker-arrow" />
          
          {/* Header */}
          <div className="custom-datepicker-header">
            <button className="custom-datepicker-nav-btn" onClick={prevMonth}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div 
              className="custom-datepicker-month-year"
              onClick={() => setShowYearMonthSelector(!showYearMonthSelector)}
              title="Click to select month and year directly"
            >
              {MONTHS[month]} {year}
            </div>
            <button className="custom-datepicker-nav-btn" onClick={nextMonth}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {showYearMonthSelector ? (
            /* Fast Year/Month Selector Grid */
            <div className="custom-datepicker-selector-view">
              <div className="custom-datepicker-selector-header">
                Select Year & Month
              </div>
              <div className="custom-datepicker-selector-dropdowns">
                <select 
                  value={year}
                  onChange={(e) => {
                    setViewDate(new Date(Number(e.target.value), month, 1));
                  }}
                  className="custom-datepicker-select"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <select 
                  value={month}
                  onChange={(e) => {
                    setViewDate(new Date(year, Number(e.target.value), 1));
                  }}
                  className="custom-datepicker-select"
                >
                  {MONTHS.map((m, idx) => (
                    <option key={m} value={idx}>{m}</option>
                  ))}
                </select>
              </div>
              <button 
                className="custom-datepicker-selector-done-btn"
                onClick={() => setShowYearMonthSelector(false)}
              >
                Back to Calendar
              </button>
            </div>
          ) : (
            /* Calendar Grid View */
            <>
              {/* Day Names */}
              <div className="custom-datepicker-weekdays">
                {DAYS.map(day => (
                  <div key={day} className="custom-datepicker-weekday">{day}</div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="custom-datepicker-days-grid">
                {cells.map((cell, index) => {
                  const isWeekend = (index % 7 === 0) || (index % 7 === 6); // Sun or Sat
                  const cellClass = [
                    'custom-datepicker-day-cell',
                    cell.current ? 'current-month' : 'other-month',
                    isWeekend ? 'weekend' : 'weekday',
                    isSelected(cell.day, cell.current) ? 'selected' : '',
                  ].filter(Boolean).join(' ');

                  return (
                    <div 
                      key={index} 
                      className={cellClass}
                      onClick={() => handleDaySelect(cell.day, cell.current)}
                    >
                      {cell.day}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="custom-datepicker-footer">
                <div className="custom-datepicker-time">
                  <span className="clock-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </span>
                  <span>12:00 AM</span>
                </div>
                <div className="custom-datepicker-footer-actions">
                  <button className="custom-datepicker-action-btn" onClick={selectToday}>Today</button>
                  <button className="custom-datepicker-action-btn" onClick={clearSelection}>Clear</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
