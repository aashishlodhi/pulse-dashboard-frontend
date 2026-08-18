import { useState } from "react";
import { CalendarClock, Plus, X } from "lucide-react";
import Card from "./Card.jsx";

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  const diff = Math.round((target - today) / 86400000);
  return diff;
}

export default function UpcomingDates({ events, setEvents }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const add = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setEvents((prev) =>
      [...prev, { id: crypto.randomUUID(), title: title.trim(), date }].sort((a, b) => a.date.localeCompare(b.date))
    );
    setTitle("");
    setDate("");
  };

  const remove = (id) => setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <Card icon={CalendarClock} title="Upcoming Important Dates & Things" className="h-full">
      {events.length > 0 ? (
        <div className="flex flex-col gap-2 mb-4 max-h-56 overflow-y-auto pr-1">
          {events.map((ev) => {
            const d = daysUntil(ev.date);
            return (
              <div key={ev.id} className="flex items-center gap-3 bg-canvas dark:bg-slate-700 rounded-xl px-3 py-2.5 group">
                <div className="w-11 h-11 rounded-lg bg-white dark:bg-slate-800 shadow-card flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-brand-500 uppercase leading-none">
                    {new Date(ev.date).toLocaleDateString(undefined, { month: "short" })}
                  </span>
                  <span className="text-sm font-bold text-slate-700 leading-none mt-0.5">
                    {new Date(ev.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{ev.title}</p>
                  <p className="text-xs text-slate-400">
                    {d === 0 ? "Today" : d === 1 ? "Tomorrow" : d < 0 ? "Past" : `In ${d} days`}
                  </p>
                </div>
                <button
                  onClick={() => remove(ev.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity focus-ring shrink-0"
                  aria-label="Remove event"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <CalendarClock size={32} className="text-brand-200 mb-2" />
          <p className="text-sm text-slate-400">Nothing scheduled yet</p>
        </div>
      )}

      <form onSubmit={add} className="flex flex-col gap-2 mt-auto">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="bg-canvas dark:bg-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-ring"
        />
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-canvas dark:bg-slate-700 rounded-xl px-3 py-2.5 text-sm flex-1 text-slate-600 dark:text-slate-300 focus-ring"
          />
          <button
            type="submit"
            disabled={!title.trim() || !date}
            className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center disabled:opacity-30 focus-ring shrink-0"
            aria-label="Add event"
          >
            <Plus size={16} />
          </button>
        </div>
      </form>
    </Card>
  );
}
