import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import Greeting from "./components/Greeting.jsx";
import LiveClock from "./components/LiveClock.jsx";
import PomodoroTimer from "./components/PomodoroTimer.jsx";
import AddTaskForm from "./components/AddTaskForm.jsx";
import Card from "./components/Card.jsx";
import Checklist from "./components/Checklist.jsx";
import TaskGrid from "./components/TaskGrid.jsx";
import StudyTracker from "./components/StudyTracker.jsx";
import UpcomingDates from "./components/UpcomingDates.jsx";
import StickyNote from "./components/StickyNote.jsx";
import PrevWeekAccomplishment from "./components/PrevWeekAccomplishment.jsx";
import BrainDump from "./components/BrainDump.jsx";
import FocusNotes from "./components/FocusNotes.jsx";
import TaskFlows from "./components/TaskFlows.jsx";
import SyncPanel from "./components/SyncPanel.jsx";
import { useBoard } from "./hooks/useBoard.js";
import { ListTodo, CalendarCheck, Crown, Target } from "lucide-react";

export default function App() {
  const { board, makeSetter, syncCode, status, linkCode, createNewCode, unlink, syncEnabled } = useBoard();
  const [showPomodoro, setShowPomodoro] = useState(true);

  const darkMode = board.darkMode;
  const setDarkMode = makeSetter("darkMode");

  const setTodayTasks = makeSetter("todayTasks");

  const handleAddTask = ({ title, date }) => {
    setTodayTasks((prev) => [...prev, { id: crypto.randomUUID(), text: title, done: false, date }]);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-canvas dark:bg-slate-900 transition-colors">
        <main className="max-w-[1400px] mx-auto px-4 py-5 md:px-8 md:py-8">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pulse Dashboard</h1>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                Everything you're tracking, saved automatically{syncEnabled ? " and synced across devices." : " on this device."}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SyncPanel
                syncEnabled={syncEnabled}
                syncCode={syncCode}
                status={status}
                linkCode={linkCode}
                createNewCode={createNewCode}
                unlink={unlink}
              />
              <button
                onClick={() => setDarkMode((d) => !d)}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-card flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-brand-500 transition-colors focus-ring shrink-0"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>

          <div className="columns-1 sm:columns-2 xl:columns-4 gap-5 [&>*]:mb-5 [&>*]:break-inside-avoid">
            <Greeting name="Aashish" />

            <PomodoroTimer visible={showPomodoro} onClose={() => setShowPomodoro(false)} />
            {!showPomodoro && (
              <button
                onClick={() => setShowPomodoro(true)}
                className="w-full text-sm text-brand-500 bg-white dark:bg-slate-800 rounded-2xl shadow-card py-3 hover:text-brand-600 focus-ring"
              >
                Show Pomodoro timer
              </button>
            )}

            <AddTaskForm onAdd={handleAddTask} />

            <Card icon={Target} title="Today's Task">
              <Checklist items={board.todayTasks} setItems={setTodayTasks} placeholder="Add item..." />
            </Card>

            <TaskGrid tiles={board.tiles} setTiles={makeSetter("tiles")} />

            <StudyTracker entries={board.studyEntries} setEntries={makeSetter("studyEntries")} />

            <StickyNote note={board.note} setNote={makeSetter("note")} />

            <UpcomingDates events={board.events} setEvents={makeSetter("events")} />

            <BrainDump items={board.brainDump} setItems={makeSetter("brainDump")} />

            <FocusNotes notes={board.focusNotes} setNotes={makeSetter("focusNotes")} />

            <TaskFlows flows={board.flows} setFlows={makeSetter("flows")} />

            <PrevWeekAccomplishment items={board.accomplishments} setItems={makeSetter("accomplishments")} />

            <LiveClock />

            <Card icon={ListTodo} title="To Do Daily">
              <Checklist items={board.dailyTasks} setItems={makeSetter("dailyTasks")} placeholder="Add item..." />
            </Card>

            <Card icon={CalendarCheck} title="To Do Weekly">
              <Checklist items={board.weeklyTasks} setItems={makeSetter("weeklyTasks")} placeholder="Add item..." />
            </Card>

            <Card icon={Crown} title="To Do Monthly">
              <Checklist items={board.monthlyTasks} setItems={makeSetter("monthlyTasks")} placeholder="Add item..." />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
