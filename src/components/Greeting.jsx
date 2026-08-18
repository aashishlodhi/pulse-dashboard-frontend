import { useMemo } from "react";
import Card from "./Card.jsx";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "👋" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "☀️" };
  return { text: "Good Evening", emoji: "🌙" };
}

export default function Greeting({ name }) {
  const { text, emoji } = useMemo(getGreeting, []);
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <Card className="justify-center">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-slate-700 flex items-center justify-center text-brand-600 dark:text-brand-300 text-xl font-bold shrink-0">
          {initial}
        </div>
        <div>
          <p className="text-lg text-slate-700 dark:text-slate-200">
            Hey <span className="text-brand-600 dark:text-brand-400 font-semibold">{name}</span>,
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            {text} <span>{emoji}</span>
          </p>
          <div className="h-1 w-8 bg-brand-500 rounded-full mt-2" />
        </div>
      </div>
    </Card>
  );
}
