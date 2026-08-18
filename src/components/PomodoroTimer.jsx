import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, RotateCcw } from "lucide-react";

const MODES = {
  focus: { label: "FOCUS", minutes: 25 },
  short: { label: "SHORT BREAK", minutes: 5 },
  long: { label: "LONG BREAK", minutes: 15 },
};

function format(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return { m: String(m).padStart(2, "0"), s: String(s).padStart(2, "0") };
}

export default function PomodoroTimer({ visible, onClose }) {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const switchMode = (key) => {
    setMode(key);
    setRunning(false);
    setSecondsLeft(MODES[key].minutes * 60);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(MODES[mode].minutes * 60);
  };

  if (!visible) return null;

  const { m, s } = format(secondsLeft);
  const totalSeconds = MODES[mode].minutes * 60;
  const progress = 1 - secondsLeft / totalSeconds;

  return (
    <div className="relative bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl shadow-soft p-5 flex flex-col text-white overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors focus-ring"
        aria-label="Hide timer"
      >
        <X size={13} />
      </button>

      <p className="font-medium text-white/90">Pomodoro</p>

      <button
        onClick={() => setRunning((r) => (secondsLeft === 0 ? r : !r))}
        className="flex items-baseline gap-1 my-3 focus-ring rounded-lg group"
        aria-label={running ? "Pause timer" : "Start timer"}
      >
        <span className="text-4xl font-bold tabular-nums">{m}</span>
        <span className="text-3xl font-bold text-white/70">:</span>
        <span className="text-4xl font-bold tabular-nums">{s}</span>
        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {running ? <Pause size={18} /> : <Play size={18} />}
        </span>
      </button>

      <div className="h-1.5 rounded-full bg-white/25 mb-3 overflow-hidden">
        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="flex items-center gap-4 text-[11px] font-semibold tracking-wide">
        {Object.entries(MODES).map(([key, m2]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`focus-ring rounded ${mode === key ? "text-white" : "text-white/60 hover:text-white/85"}`}
          >
            {m2.label}
          </button>
        ))}
        <button onClick={reset} className="ml-auto text-white/70 hover:text-white focus-ring" aria-label="Reset timer">
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}
