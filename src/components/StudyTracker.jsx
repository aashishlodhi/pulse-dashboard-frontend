import { useState } from "react";
import { BookOpen, GraduationCap, Plus, X } from "lucide-react";
import Card from "./Card.jsx";

export default function StudyTracker({ entries, setEntries }) {
  const [subject, setSubject] = useState("");
  const [field, setField] = useState("");

  const add = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setEntries((prev) => [
      { id: crypto.randomUUID(), subject: subject.trim(), field: field.trim(), done: false },
      ...prev,
    ]);
    setSubject("");
    setField("");
  };

  const toggle = (id) => {
    setEntries((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  };

  const remove = (id) => setEntries((prev) => prev.filter((it) => it.id !== id));

  return (
    <Card icon={BookOpen} title="Study Tracker">
      <form onSubmit={add} className="flex flex-col gap-2.5 mb-4">
        <label className="flex items-center gap-2.5 bg-canvas dark:bg-slate-700 rounded-xl px-3 py-2.5">
          <BookOpen size={15} className="text-slate-400 shrink-0" />
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter things to study"
            className="bg-transparent text-sm flex-1 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-ring rounded"
          />
        </label>
        <label className="flex items-center gap-2.5 bg-canvas dark:bg-slate-700 rounded-xl px-3 py-2.5">
          <GraduationCap size={15} className="text-slate-400 shrink-0" />
          <input
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="Under which field"
            className="bg-transparent text-sm flex-1 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-ring rounded"
          />
          <button
            type="submit"
            disabled={!subject.trim()}
            className="text-brand-500 hover:text-brand-600 disabled:opacity-30 focus-ring"
            aria-label="Add study topic"
          >
            <Plus size={16} />
          </button>
        </label>
      </form>

      {entries.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-2.5 group">
              <button
                onClick={() => toggle(entry.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 focus-ring ${
                  entry.done ? "bg-brand-500 border-brand-500" : "border-slate-300 dark:border-slate-600"
                }`}
                aria-label="Toggle studied"
              >
                {entry.done && <span className="w-2 h-2 rounded-full bg-white" />}
              </button>
              <div className={`flex-1 min-w-0 ${entry.done ? "opacity-50" : ""}`}>
                <p className={`text-sm text-slate-700 dark:text-slate-200 truncate ${entry.done ? "line-through" : ""}`}>{entry.subject}</p>
                {entry.field && <p className="text-xs text-slate-400 truncate">{entry.field}</p>}
              </div>
              <button
                onClick={() => remove(entry.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity focus-ring shrink-0"
                aria-label="Remove"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2">Nothing queued up yet — add a topic above.</p>
      )}
    </Card>
  );
}
