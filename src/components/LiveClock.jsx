import { useEffect, useState } from "react";
import Card from "./Card.jsx";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="items-center justify-center text-center py-6">
      <p className="text-[11px] font-semibold tracking-widest text-slate-400 mb-2">LIVE CLOCK</p>
      <div className="flex items-baseline justify-center gap-1 tabular-nums">
        <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{h}</span>
        <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">:</span>
        <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{m}</span>
        <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">:</span>
        <span className="text-2xl font-semibold text-slate-400 dark:text-slate-500">{s}</span>
      </div>
      <p className="text-sm text-slate-400 mt-2">{dateStr}</p>
    </Card>
  );
}
