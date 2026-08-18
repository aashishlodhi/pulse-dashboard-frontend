import { useState } from "react";
import { Cloud, CloudOff, Copy, Check, Link2, Unlink, RefreshCw, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  idle: { icon: CloudOff, label: "Not synced", cls: "text-slate-400" },
  syncing: { icon: RefreshCw, label: "Syncing…", cls: "text-brand-500 animate-spin-slow" },
  synced: { icon: Cloud, label: "Synced", cls: "text-emerald-500" },
  offline: { icon: CloudOff, label: "Offline", cls: "text-slate-400" },
  error: { icon: AlertCircle, label: "Sync error", cls: "text-amber-500" },
};

export default function SyncPanel({ syncEnabled, syncCode, status, linkCode, createNewCode, unlink }) {
  const [open, setOpen] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);

  if (!syncEnabled) {
    return (
      <span
        className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5"
        title="Set VITE_API_URL to enable cross-device sync"
      >
        <CloudOff size={14} /> Local only
      </span>
    );
  }

  const { icon: Icon, label, cls } = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  const copyCode = () => {
    navigator.clipboard?.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const submitCode = (e) => {
    e.preventDefault();
    const code = inputCode.trim().toUpperCase();
    if (!code) return;
    linkCode(code);
    setInputCode("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 shadow-card px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors focus-ring"
      >
        <Icon size={14} className={cls} />
        {syncCode ? syncCode : "Sync devices"}
      </button>

      {open && (
        <>
          <button className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 shadow-soft rounded-2xl p-4 z-40 text-sm">
            {syncCode ? (
              <>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-2">
                  This device syncs under code <span className="font-semibold text-slate-700 dark:text-slate-200">{syncCode}</span>.
                  Enter the same code on another device to see this data there.
                </p>
                <button
                  onClick={copyCode}
                  className="w-full flex items-center justify-center gap-2 bg-canvas dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl py-2 mb-2 hover:bg-brand-50 dark:hover:bg-slate-600 transition-colors focus-ring"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy code"}
                </button>
                <button
                  onClick={() => {
                    unlink();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-500 rounded-xl py-2 transition-colors focus-ring"
                >
                  <Unlink size={14} /> Stop syncing this device
                </button>
              </>
            ) : (
              <>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">
                  Sync your dashboard across devices. Generate a code here, then enter it on your other device — or
                  enter a code you already generated elsewhere.
                </p>
                <button
                  onClick={() => {
                    createNewCode();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 text-white rounded-xl py-2 mb-3 hover:bg-brand-600 transition-colors focus-ring"
                >
                  <Cloud size={14} /> Start syncing this device
                </button>
                <form onSubmit={submitCode} className="flex items-center gap-2">
                  <input
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter code"
                    maxLength={12}
                    className="flex-1 min-w-0 bg-canvas dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 rounded-xl px-3 py-2 text-sm uppercase tracking-wide focus-ring"
                  />
                  <button
                    type="submit"
                    disabled={!inputCode.trim()}
                    className="shrink-0 w-9 h-9 rounded-xl bg-brand-50 dark:bg-slate-700 text-brand-500 flex items-center justify-center disabled:opacity-30 focus-ring"
                    aria-label="Link code"
                  >
                    <Link2 size={15} />
                  </button>
                </form>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
