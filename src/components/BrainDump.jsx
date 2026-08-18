import { useState } from "react";
import { Brain, Plus, X, Sparkles } from "lucide-react";
import Card from "./Card.jsx";

const TAGS = [
  { id: "idea", label: "Idea", cls: "bg-purple-50 text-purple-600" },
  { id: "reminder", label: "Reminder", cls: "bg-amber-50 text-amber-600" },
  { id: "worry", label: "Worry", cls: "bg-rose-50 text-rose-600" },
  { id: "task", label: "Task", cls: "bg-brand-50 text-brand-600" },
];

export default function BrainDump({ items, setItems }) {
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState("idea");

  const add = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setItems((prev) => [{ id: crypto.randomUUID(), text, tag }, ...prev]);
    setDraft("");
  };

  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  return (
    <Card icon={Brain} title="Brain Dump" iconBg="bg-purple-500">
      <p className="text-xs text-slate-400 -mt-2 mb-3">
        Capture anything on your mind — sort it out later, nothing gets lost.
      </p>

      <form onSubmit={add} className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 bg-canvas dark:bg-slate-700 rounded-xl px-3 py-2.5">
          <Sparkles size={15} className="text-slate-400 shrink-0" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Dump a thought, task, worry, or idea..."
            className="bg-transparent text-sm flex-1 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-ring rounded"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="text-brand-500 hover:text-brand-600 disabled:opacity-30 focus-ring shrink-0"
            aria-label="Add to brain dump"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {TAGS.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => setTag(t.id)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-opacity focus-ring ${t.cls} ${
                tag === t.id ? "opacity-100 ring-2 ring-offset-1 ring-current" : "opacity-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </form>

      {items.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {items.map((item) => {
            const tagInfo = TAGS.find((t) => t.id === item.tag) ?? TAGS[0];
            return (
              <div key={item.id} className="flex items-start gap-2.5 group">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${tagInfo.cls}`}>
                  {tagInfo.label}
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-200 flex-1 break-words">{item.text}</p>
                <button
                  onClick={() => remove(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity focus-ring shrink-0"
                  aria-label="Clear"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2">Your mind is clear. Nothing dumped yet.</p>
      )}
    </Card>
  );
}
