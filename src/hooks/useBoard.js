import { useCallback, useEffect, useRef, useState } from "react";
import { fetchBoard, saveBoard, syncEnabled, generateSyncCode } from "../lib/api.js";

const CACHE_KEY = "pulse-board-cache";
const CODE_KEY = "pulse-sync-code";

const DEFAULTS = {
  darkMode: false,
  todayTasks: [
    { id: "d1", text: "go to gym", done: false },
    { id: "d2", text: "complete assignment", done: false },
    { id: "d3", text: "take medication", done: false },
  ],
  dailyTasks: [
    { id: "a1", text: "call daddy", done: false },
    { id: "a2", text: "go to gym", done: false },
  ],
  weeklyTasks: [
    { id: "w1", text: "hair cut", done: false },
    { id: "w2", text: "go to gym", done: false },
  ],
  monthlyTasks: [
    { id: "m1", text: "hair cut", done: false },
    { id: "m2", text: "go to gym", done: false },
  ],
  tiles: [
    { id: "t1", label: "Task 1", active: false },
    { id: "t2", label: "Task 2", active: false },
    { id: "t3", label: "Task 3", active: false },
    { id: "t4", label: "Task 4", active: false },
    { id: "t5", label: "Task 5", active: false },
    { id: "t6", label: "Task 6", active: false },
  ],
  studyEntries: [],
  events: [],
  note: "",
  accomplishments: [
    { id: "p1", text: "Lorem ipsum" },
    { id: "p2", text: "Lorem ipsum" },
    { id: "p3", text: "Lorem ipsum" },
  ],
  brainDump: [],
  focusNotes: [],
  flows: [],
};

function loadCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function useBoard() {
  const [board, setBoard] = useState(loadCache);
  const [syncCode, setSyncCode] = useState(() => window.localStorage.getItem(CODE_KEY) || "");
  // idle | syncing | synced | offline | error
  const [status, setStatus] = useState("idle");
  const saveTimeout = useRef(null);
  const skipNextSave = useRef(false);

  // cache every change to localStorage immediately, regardless of sync state
  useEffect(() => {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(board));
    } catch {
      // ignore quota errors
    }
  }, [board]);

  // debounce-push to server whenever board changes, if a sync code is active
  useEffect(() => {
    if (!syncEnabled || !syncCode) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    setStatus("syncing");
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveBoard(syncCode, board)
        .then(() => setStatus("synced"))
        .catch(() => setStatus("error"));
    }, 800);
    return () => clearTimeout(saveTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  // on mount (or when the code changes via linkCode), pull the latest from the server
  const pull = useCallback((code) => {
    if (!syncEnabled || !code) return;
    setStatus("syncing");
    fetchBoard(code)
      .then((data) => {
        if (data) {
          skipNextSave.current = true;
          setBoard({ ...DEFAULTS, ...data });
        }
        setStatus("synced");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (syncCode) pull(syncCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkCode = useCallback(
    (code) => {
      window.localStorage.setItem(CODE_KEY, code);
      setSyncCode(code);
      pull(code);
    },
    [pull]
  );

  const createNewCode = useCallback(() => {
    const code = generateSyncCode();
    window.localStorage.setItem(CODE_KEY, code);
    setSyncCode(code);
    setStatus("syncing");
    saveBoard(code, board)
      .then(() => setStatus("synced"))
      .catch(() => setStatus("error"));
    return code;
  }, [board]);

  const unlink = useCallback(() => {
    window.localStorage.removeItem(CODE_KEY);
    setSyncCode("");
    setStatus("idle");
  }, []);

  const makeSetter = useCallback(
    (key) => (updater) => {
      setBoard((prev) => ({
        ...prev,
        [key]: typeof updater === "function" ? updater(prev[key]) : updater,
      }));
    },
    []
  );

  return { board, makeSetter, syncCode, status, linkCode, createNewCode, unlink, syncEnabled };
}
