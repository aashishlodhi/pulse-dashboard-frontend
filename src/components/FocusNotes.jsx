import { useState } from "react";
import { NotebookPen, Plus, Trash2 } from "lucide-react";
import Card from "./Card.jsx";
import ZenEditor from "./ZenEditor.jsx";

function titleOf(note) {
  const firstLine = (note.content || "").split("\n")[0].trim();
  return firstLine || "Untitled note";
}

function snippetOf(note) {
  const rest = (note.content || "").split("\n").slice(1).join(" ").trim();
  return rest.slice(0, 60);
}

export default function FocusNotes({ notes, setNotes }) {
  const [openId, setOpenId] = useState(null);

  const createNote = () => {
    const id = crypto.randomUUID();
    setNotes((prev) => [{ id, content: "", updatedAt: Date.now() }, ...prev]);
    setOpenId(id);
  };

  const saveNote = (id, content) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content, updatedAt: Date.now() } : n)));
  };

  const removeNote = (id, e) => {
    e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const openNote = notes.find((n) => n.id === openId);

  return (
    <Card icon={NotebookPen} title="Focus Notes" iconBg="bg-teal-500">
      <p className="text-xs text-slate-400 -mt-2 mb-3">
        A full-screen, distraction-free space for writing — no clutter, just the page.
      </p>

      <button
        onClick={createNote}
        className="flex items-center justify-center gap-2 w-full bg-teal-50 dark:bg-slate-700 text-teal-600 dark:text-teal-300 rounded-xl py-2.5 text-sm font-medium hover:bg-teal-100 dark:hover:bg-slate-600 transition-colors focus-ring mb-3"
      >
        <Plus size={15} /> New distraction-free note
      </button>

      {notes.length > 0 ? (
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
          {notes
            .slice()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((n) => (
              <button
                key={n.id}
                onClick={() => setOpenId(n.id)}
                className="flex items-center gap-2.5 text-left px-3 py-2 rounded-xl hover:bg-canvas dark:hover:bg-slate-700 transition-colors group focus-ring"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{titleOf(n)}</p>
                  {snippetOf(n) && <p className="text-xs text-slate-400 truncate">{snippetOf(n)}</p>}
                </div>
                <span
                  onClick={(e) => removeNote(n.id, e)}
                  role="button"
                  tabIndex={0}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity shrink-0"
                  aria-label="Delete note"
                >
                  <Trash2 size={14} />
                </span>
              </button>
            ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2">No notes yet — start one above.</p>
      )}

      {openNote && (
        <ZenEditor
          note={openNote}
          onSave={(content) => saveNote(openNote.id, content)}
          onClose={() => setOpenId(null)}
        />
      )}
    </Card>
  );
}
