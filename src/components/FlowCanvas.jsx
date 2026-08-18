import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { X, Plus, Trash2 } from "lucide-react";
import StepNode from "./StepNode.jsx";

const nodeTypes = { step: StepNode };
const COLOR_CYCLE = ["brand", "green", "amber", "rose"];

function makeNode(id, position, colorIdx) {
  return {
    id,
    type: "step",
    position,
    data: { label: `Step ${colorIdx + 1}`, substeps: [], color: COLOR_CYCLE[colorIdx % COLOR_CYCLE.length] },
  };
}

function CanvasInner({ flow, onSave, onClose }) {
  const [name, setName] = useState(flow.name || "Untitled flow");
  const [nodes, setNodes] = useState(
    flow.nodes?.length ? flow.nodes : [makeNode(crypto.randomUUID(), { x: 250, y: 120 }, 0)]
  );
  const [edges, setEdges] = useState(flow.edges || []);
  const saveTimeout = useRef(null);

  const updateNodeData = useCallback((id, patch) => {
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));
  }, []);

  const deleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  // wire the callbacks into every node's data
  const wiredNodes = nodes.map((n) => ({
    ...n,
    data: { ...n.data, onChange: updateNodeData, onDelete: deleteNode },
  }));

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: "#3b74f5", strokeWidth: 2 } }, eds)),
    []
  );

  const addStep = () => {
    const idx = nodes.length;
    const id = crypto.randomUUID();
    const position = { x: 120 + (idx % 4) * 260, y: 120 + Math.floor(idx / 4) * 220 };
    setNodes((nds) => [...nds, makeNode(id, position, idx)]);
  };

  useEffect(() => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      onSave({ ...flow, name, nodes, edges, updatedAt: Date.now() });
    }, 400);
    return () => clearTimeout(saveTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, nodes, edges]);

  return (
    <div className="fixed inset-0 z-50 bg-canvas dark:bg-slate-900 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 shadow-card z-10">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-base font-semibold text-slate-800 dark:text-slate-100 bg-transparent focus-ring rounded px-1 flex-1 min-w-0"
        />
        <button
          onClick={addStep}
          className="flex items-center gap-1.5 text-sm font-medium bg-brand-500 text-white px-3 py-2 rounded-xl hover:bg-brand-600 transition-colors focus-ring shrink-0"
        >
          <Plus size={15} /> Add step
        </button>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl hover:bg-canvas dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors focus-ring shrink-0"
          aria-label="Close canvas"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={wiredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
        >
          <Background gap={18} size={1.5} color="#c7d3ee" />
          <Controls position="bottom-left" />
          <MiniMap pannable zoomable className="!bg-white" />
        </ReactFlow>
      </div>

      <div className="px-4 py-2 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800">
        Drag from a node's edge dot to connect steps · Drag a step's sub-step list to break it into smaller pieces ·
        <button
          onClick={() => {
            if (confirm("Clear this entire flow?")) {
              setNodes([]);
              setEdges([]);
            }
          }}
          className="ml-1 inline-flex items-center gap-1 text-red-400 hover:text-red-500 focus-ring"
        >
          <Trash2 size={11} /> clear flow
        </button>
      </div>
    </div>
  );
}

export default function FlowCanvas({ flow, onSave, onClose }) {
  return (
    <ReactFlowProvider>
      <CanvasInner flow={flow} onSave={onSave} onClose={onClose} />
    </ReactFlowProvider>
  );
}
