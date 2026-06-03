import { useState, useEffect, useRef } from "react";
import styles from "./DateTimePicker.module.css";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const TIME_WINDOW_LIMIT = 20;

// ─── Helpers ────────────────────────────────────────────────────────────────

function isSameDay(a, b) {
  return (
    a instanceof Date &&
    b instanceof Date &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function formatDisplay(date) {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd} / ${mm} / ${date.getFullYear()}`;
}

/** Returns "YYYY-MM-DD" — matches what your formData.eventDate likely expects */
function formatValue(date) {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Drop-in replacement for the native <input type="date"> + timeWindow pair.
 *
 * Props:
 *   eventDate   {string}   "YYYY-MM-DD" controlled value
 *   timeWindow  {string}   controlled value
 *   onChange    {function} called with a synthetic-ish event: { target: { name, value } }
 *   focusedField      {string}  from parent state
 *   setFocusedField   {fn}      from parent state setter
 */
export default function DateTimePicker({
  eventDate,
  timeWindow,
  onChange,
  focusedField,
  setFocusedField,
}) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => {
    // initialise calendar to the currently selected month if there's a value
    if (eventDate) {
      const d = new Date(eventDate + "T00:00:00");
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const selected = eventDate ? new Date(eventDate + "T00:00:00") : null;
  const wrapRef = useRef(null);

  // close calendar when clicking outside
  useEffect(() => {
    function handleOutside(e) {
      if (open && wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function selectDay(day) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    onChange({ target: { name: "eventDate", value: formatValue(date) } });
    setOpen(false);
  }

  function prevMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  }

  // build day cells
  const firstWeekday = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

  return (
    <div className={styles.row}>
      {/* ── Date input ── */}
      <div className={styles.dateWrap} ref={wrapRef}>
        <div className={`${styles.inputWrap} ${open ? styles.inputWrapOpen : ""}`}>
          <input
            type="text"
            readOnly
            required
            placeholder="Select date *"
            value={formatDisplay(selected)}
            onClick={() => setOpen((o) => !o)}
            className={styles.dateInput}
          />
          <svg
            className={styles.calIcon}
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        {open && (
          <div className={styles.calendar} role="dialog" aria-label="Date picker">
            {/* header */}
            <div className={styles.calHeader}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={prevMonth}
                aria-label="Previous month"
              >
                &#8249;
              </button>
              <span className={styles.calMonth}>
                {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
              </span>
              <button
                type="button"
                className={styles.navBtn}
                onClick={nextMonth}
                aria-label="Next month"
              >
                &#8250;
              </button>
            </div>

            {/* day names */}
            <div className={styles.dayNames}>
              {DAYS.map((d) => (
                <span key={d} className={styles.dayName}>{d}</span>
              ))}
            </div>

            {/* day grid */}
            <div className={styles.daysGrid}>
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const thisDate = new Date(cursor.getFullYear(), cursor.getMonth(), day);
                const isToday = isSameDay(thisDate, today);
                const isSel = selected && isSameDay(thisDate, selected);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={[
                      styles.day,
                      isToday && !isSel ? styles.dayToday : "",
                      isSel ? styles.daySelected : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={`${day} ${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`}
                    aria-pressed={!!isSel}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Time window input ── */}
      <div className={styles.timeWrap}>
        <input
          type="text"
          name="timeWindow"
          placeholder="Time window (e.g. 6PM-10PM) *"
          value={timeWindow}
          onChange={onChange}
          onFocus={() => setFocusedField("timeWindow")}
          onBlur={() => setFocusedField("")}
          maxLength={TIME_WINDOW_LIMIT}
          required
          className={styles.timeInput}
        />
        {focusedField === "timeWindow" && (
          <span className={styles.charCount}>
            {timeWindow.length}/{TIME_WINDOW_LIMIT}
          </span>
        )}
      </div>
    </div>
  );
}