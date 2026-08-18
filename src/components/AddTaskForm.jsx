import { useState } from "react";
import { PenLine, FileText, Calendar, Plus } from "lucide-react";

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), date });
    setTitle("");
    setDescription("");
    setDate("");
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-card p-5 flex flex-col gap-3 transition-colors">
      <label className="flex items-center gap-2.5 bg-canvas dark:bg-slate-700 rounded-xl px-3 py-2.5">
        <PenLine size={15} className="text-slate-400 shrink-0" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter main title"
          className="bg-transparent text-sm flex-1 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-ring rounded"
        />
      </label>
      <label className="flex items-center gap-2.5 bg-canvas dark:bg-slate-700 rounded-xl px-3 py-2.5">
        <FileText size={15} className="text-slate-400 shrink-0" />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="bg-transparent text-sm flex-1 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-ring rounded"
        />
      </label>
      <label className="flex items-center gap-2.5 bg-canvas dark:bg-slate-700 rounded-xl px-3 py-2.5">
        <Calendar size={15} className="text-slate-400 shrink-0" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-transparent text-sm flex-1 text-slate-600 dark:text-slate-300 focus-ring rounded"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="text-brand-500 hover:text-brand-600 disabled:opacity-30 focus-ring shrink-0"
          aria-label="Add task"
        >
          <Plus size={16} />
        </button>
      </label>
      <p className="text-xs text-brand-500">Note: It's not mandatory — adds straight to Today's Task.</p>
    </form>
  );
}
