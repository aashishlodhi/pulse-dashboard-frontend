import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function Checklist({ items, setItems, placeholder = "Add an item...", numbered = true }) {
  const [draft, setDraft] = useState("");

  const toggle = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const add = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <label key={item.id} className="flex items-center gap-2.5 group cursor-pointer">
          {numbered && <span className="text-sm text-slate-400 w-4 shrink-0">{i + 1}.</span>}
          <input
            type="checkbox"
            checked={item.done}
            onChange={() => toggle(item.id)}
            className="peer sr-only"
          />
          <span
            onClick={() => toggle(item.id)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              item.done ? "bg-brand-500 border-brand-500" : "border-slate-300 dark:border-slate-600"
            }`}
          >
            {item.done && <span className="w-2 h-2 rounded-full bg-white" />}
          </span>
          <span
            onClick={() => toggle(item.id)}
            className={`text-sm flex-1 ${item.done ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200"}`}
          >
            {item.text}
          </span>
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity focus-ring"
            aria-label="Remove item"
          >
            <X size={14} />
          </button>
        </label>
      ))}

      <form onSubmit={add} className="flex items-center gap-2.5 mt-1">
        {numbered && <span className="text-sm text-slate-400 w-4 shrink-0">{items.length + 1}.</span>}
        <span className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300 shrink-0" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="text-sm flex-1 bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-ring rounded"
        />
        <button
          type="submit"
          className="text-brand-500 hover:text-brand-600 disabled:opacity-30 focus-ring"
          disabled={!draft.trim()}
          aria-label="Add item"
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
}
