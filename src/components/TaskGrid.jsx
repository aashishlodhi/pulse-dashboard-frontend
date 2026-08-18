import { useState } from "react";
import { FileText, PenLine, Flag, Layers, Star, CheckCircle2 } from "lucide-react";

const ICONS = [FileText, PenLine, Flag, Layers, Star, CheckCircle2];

export default function TaskGrid({ tiles, setTiles }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  const startEdit = (tile) => {
    setEditingId(tile.id);
    setDraft(tile.label);
  };

  const commit = (id) => {
    const text = draft.trim();
    setTiles((prev) => prev.map((t) => (t.id === id ? { ...t, label: text || t.label } : t)));
    setEditingId(null);
  };

  const toggleActive = (id) => {
    setTiles((prev) => prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((tile, i) => {
        const Icon = ICONS[i % ICONS.length];
        const isEditing = editingId === tile.id;
        return (
          <div
            key={tile.id}
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-card px-3 py-3 flex flex-col items-start gap-2 cursor-pointer border-2 transition-colors ${
              tile.active ? "border-brand-400" : "border-transparent"
            }`}
            onClick={() => !isEditing && toggleActive(tile.id)}
          >
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                tile.active ? "bg-brand-500 text-white" : "bg-brand-50 dark:bg-slate-700 text-brand-500 dark:text-brand-300"
              }`}
            >
              <Icon size={14} />
            </span>
            {isEditing ? (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => commit(tile.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit(tile.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium text-slate-700 dark:text-slate-100 w-full bg-brand-50 dark:bg-slate-700 rounded px-1 py-0.5 focus-ring"
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(tile);
                }}
                className="text-xs font-medium text-slate-700 dark:text-slate-200 text-left w-full hover:text-brand-600 dark:hover:text-brand-400 focus-ring rounded truncate"
                title="Click to rename"
              >
                {tile.label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
