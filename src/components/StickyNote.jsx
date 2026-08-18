import { Pin } from "lucide-react";

export default function StickyNote({ note, setNote }) {
  return (
    <div className="relative bg-gradient-to-br from-brand-50 to-brand-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-card p-5 flex-1 flex flex-col min-h-[180px] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-brand-700 dark:text-brand-300">Personal Sticky Note</h3>
        <span className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 rotate-12 shadow-soft">
          <Pin size={14} />
        </span>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot something down..."
        className="bg-transparent flex-1 resize-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-ring rounded"
      />
    </div>
  );
}
