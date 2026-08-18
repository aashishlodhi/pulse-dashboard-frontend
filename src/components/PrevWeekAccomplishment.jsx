import { useState } from "react";
import { TrendingUp, Plus, X } from "lucide-react";
import Card from "./Card.jsx";

export default function PrevWeekAccomplishment({ items, setItems }) {
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");

  const add = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), text }]);
    setDraft("");
  };

  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const commitEdit = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, text: editDraft.trim() || it.text } : it)));
    setEditingId(null);
  };

  return (
    <Card icon={TrendingUp} title="Prev Week Accomplishment">
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-2.5 group">
            <span className="text-sm text-brand-500 font-semibold w-4 shrink-0">{i + 1}.</span>
            {editingId === item.id ? (
              <input
                autoFocus
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                onBlur={() => commitEdit(item.id)}
                onKeyDown={(e) => e.key === "Enter" && commitEdit(item.id)}
                className="text-sm flex-1 bg-brand-50 dark:bg-slate-700 dark:text-slate-100 rounded px-1.5 py-0.5 focus-ring"
              />
            ) : (
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setEditDraft(item.text);
                }}
                className="text-sm text-slate-700 dark:text-slate-200 text-left flex-1 hover:text-brand-600 focus-ring rounded truncate"
              >
                {item.text}
              </button>
            )}
            <button
              onClick={() => remove(item.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity focus-ring shrink-0"
              aria-label="Remove"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <form onSubmit={add} className="flex items-center gap-2.5 mt-1">
          <span className="text-sm text-slate-400 w-4 shrink-0">{items.length + 1}.</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a win from last week..."
            className="text-sm flex-1 bg-transparent placeholder:text-slate-400 focus-ring rounded"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="text-brand-500 hover:text-brand-600 disabled:opacity-30 focus-ring"
            aria-label="Add accomplishment"
          >
            <Plus size={16} />
          </button>
        </form>
      </div>
    </Card>
  );
}
