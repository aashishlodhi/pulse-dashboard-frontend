import { useState } from "react";
import { Waypoints, Plus, Trash2, GitBranch } from "lucide-react";
import Card from "./Card.jsx";
import FlowCanvas from "./FlowCanvas.jsx";

export default function TaskFlows({ flows, setFlows }) {
  const [openId, setOpenId] = useState(null);

  const createFlow = () => {
    const id = crypto.randomUUID();
    const flow = { id, name: "New task flow", nodes: [], edges: [], updatedAt: Date.now() };
    setFlows((prev) => [flow, ...prev]);
    setOpenId(id);
  };

  const saveFlow = (updated) => {
    setFlows((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const removeFlow = (id, e) => {
    e.stopPropagation();
    setFlows((prev) => prev.filter((f) => f.id !== id));
  };

  const openFlow = flows.find((f) => f.id === openId);

  return (
    <Card icon={Waypoints} title="Task Flows" iconBg="bg-indigo-500">
      <p className="text-xs text-slate-400 -mt-2 mb-3">
        Map out how a task breaks down — step A leads to B, B leads to C. Drag, connect, nest sub-steps.
      </p>

      <button
        onClick={createFlow}
        className="flex items-center justify-center gap-2 w-full bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-slate-600 transition-colors focus-ring mb-3"
      >
        <Plus size={15} /> New flow canvas
      </button>

      {flows.length > 0 ? (
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
          {flows
            .slice()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((f) => (
              <button
                key={f.id}
                onClick={() => setOpenId(f.id)}
                className="flex items-center gap-2.5 text-left px-3 py-2 rounded-xl hover:bg-canvas dark:hover:bg-slate-700 transition-colors group focus-ring"
              >
                <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-slate-700 text-indigo-500 dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <GitBranch size={13} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{f.name || "Untitled flow"}</p>
                  <p className="text-xs text-slate-400">{(f.nodes || []).length} steps</p>
                </div>
                <span
                  onClick={(e) => removeFlow(f.id, e)}
                  role="button"
                  tabIndex={0}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity shrink-0"
                  aria-label="Delete flow"
                >
                  <Trash2 size={14} />
                </span>
              </button>
            ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2">No flows yet — map out your first task above.</p>
      )}

      {openFlow && <FlowCanvas flow={openFlow} onSave={saveFlow} onClose={() => setOpenId(null)} />}
    </Card>
  );
}
