import { useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";

export default function ZenEditor({ note, onSave, onClose }) {
  const [content, setContent] = useState(note.content ?? "");
  const [savedPulse, setSavedPulse] = useState(false);
  const textareaRef = useRef(null);
  const saveTimeout = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      onSave(content);
      setSavedPulse(true);
      setTimeout(() => setSavedPulse(false), 900);
    }, 500);
    return () => clearTimeout(saveTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const firstLine = content.split("\n")[0].trim();

  return (
    <div className="fixed inset-0 z-50 bg-[#fbfbfa] dark:bg-[#111318] flex flex-col">
      <div className="flex items-center justify-between px-5 py-3">
        <span className={`text-xs transition-opacity duration-300 ${savedPulse ? "opacity-100 text-brand-500" : "opacity-0"}`}>
          <Check size={13} className="inline -mt-0.5 mr-1" />
          Saved
        </span>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors focus-ring"
          aria-label="Close (Esc)"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Just write. Nothing else on this screen matters right now..."
            className="w-full min-h-[70vh] resize-none bg-transparent text-lg leading-relaxed text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus-ring rounded"
            spellCheck="true"
          />
        </div>
      </div>

      <div className="px-6 py-3 text-center text-xs text-slate-300 dark:text-slate-600">
        {firstLine || "Untitled note"} · {wordCount} {wordCount === 1 ? "word" : "words"} · Esc to close
      </div>
    </div>
  );
}
