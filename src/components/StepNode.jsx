import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Plus, X, ChevronDown, ChevronRight, Trash2 } from "lucide-react";

const COLORS = {
  brand: { bg: "bg-white dark:bg-slate-800", ring: "border-brand-300 dark:border-brand-500/50", dot: "bg-brand-500" },
  green: { bg: "bg-white dark:bg-slate-800", ring: "border-emerald-300 dark:border-emerald-500/50", dot: "bg-emerald-500" },
  amber: { bg: "bg-white dark:bg-slate-800", ring: "border-amber-300 dark:border-amber-500/50", dot: "bg-amber-500" },
  rose: { bg: "bg-white dark:bg-slate-800", ring: "border-rose-300 dark:border-rose-500/50", dot: "bg-rose-500" },
};

export default function StepNode({ id, data }) {
  const [expanded, setExpanded] = useState(true);
  const [subDraft, setSubDraft] = useState("");
  const color = COLORS[data.color] || COLORS.brand;

  const renameStep = (e) => data.onChange(id, { label: e.target.value });

  const addSub = (e) => {
    e.preventDefault();
    const text = subDraft.trim();
    if (!text) return;
    const substeps = [...(data.substeps || []), { id: crypto.randomUUID(), text, done: false }];
    data.onChange(id, { substeps });
    setSubDraft("");
  };

  const toggleSub = (subId) => {
    const substeps = (data.substeps || []).map((s) => (s.id === subId ? { ...s, done: !s.done } : s));
    data.onChange(id, { substeps });
  };

  const removeSub = (subId) => {
    const substeps = (data.substeps || []).filter((s) => s.id !== subId);
    data.onChange(id, { substeps });
  };

  const substeps = data.substeps || [];

  return (
    <div
      className={`rounded-2xl shadow-lg border-2 ${color.ring} ${color.bg} min-w-[220px] max-w-[280px] overflow-hidden`}
    >
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-brand-500 !border-2 !border-white" />
      <Handle type="target" position={Position.Left} id="left" className="!w-2.5 !h-2.5 !bg-brand-500 !border-2 !border-white" />

      <div className="flex items-center gap-1.5 px-3 pt-3 pb-1.5">
        <span className={`w-2 h-2 rounded-full shrink-0 ${color.dot}`} />
        <input
          className="nodrag text-sm font-semibold text-slate-700 dark:text-slate-100 bg-transparent flex-1 min-w-0 focus-ring rounded"
          value={data.label}
          onChange={renameStep}
          placeholder="Step name"
        />
        {substeps.length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="nodrag text-slate-400 hover:text-slate-600 shrink-0"
            aria-label="Toggle sub-steps"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        <button
          onClick={() => data.onDelete(id)}
          className="nodrag text-slate-300 hover:text-red-400 shrink-0"
          aria-label="Delete step"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {expanded && substeps.length > 0 && (
        <div className="px-3 pb-1 flex flex-col gap-1">
          {substeps.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 nodrag group">
              <button
                onClick={() => toggleSub(s.id)}
                className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  s.done ? "bg-brand-500 border-brand-500" : "border-slate-300"
                }`}
              >
                {s.done && <span className="w-1 h-1 rounded-full bg-white" />}
              </button>
              <span className={`text-xs flex-1 truncate ${s.done ? "line-through text-slate-400" : "text-slate-600 dark:text-slate-300"}`}>
                {s.text}
              </span>
              <button
                onClick={() => removeSub(s.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 shrink-0"
                aria-label="Remove sub-step"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addSub} className="nodrag flex items-center gap-1 px-3 pb-2.5 pt-1">
        <input
          value={subDraft}
          onChange={(e) => setSubDraft(e.target.value)}
          placeholder="+ sub-step"
          className="text-xs flex-1 min-w-0 bg-slate-50 dark:bg-slate-700 dark:text-slate-100 rounded-md px-2 py-1 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-ring"
        />
        <button
          type="submit"
          disabled={!subDraft.trim()}
          className="text-brand-500 hover:text-brand-600 disabled:opacity-30 shrink-0"
          aria-label="Add sub-step"
        >
          <Plus size={13} />
        </button>
      </form>

      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-brand-500 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} id="right" className="!w-2.5 !h-2.5 !bg-brand-500 !border-2 !border-white" />
    </div>
  );
}
