import { emptyState, nowFrom, recommend } from "@/lib/planner";
import { recomputeAllConcepts } from "@/lib/mastery";
import { loadState, saveState, STORAGE_KEY } from "@/lib/storage";
import type { StudentState } from "@/lib/types";

/** Stable server/hydration snapshot. Never mutate this object. */
const SERVER_STATE: StudentState = emptyState();

const listeners = new Set<() => void>();
let cachedToken: string | null | undefined = undefined;
let cachedState: StudentState | null = null;

function readToken(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function persistStudentState(state: StudentState): StudentState {
  const rec = recommend(state);
  const withRec: StudentState = { ...state, lastRecommendation: rec, recommendations: [rec] };
  let next: StudentState = withRec;
  try {
    next = recomputeAllConcepts(withRec, nowFrom(withRec));
  } catch {
    next = withRec;
  }
  try {
    saveState(next);
  } catch {
    // Private mode / quota: keep the in-memory snapshot anyway.
  }
  return next;
}

export function subscribeStudent(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== STORAGE_KEY) return;
    cachedToken = undefined;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getServerStudentState() {
  return SERVER_STATE;
}

export function getClientStudentState(): StudentState {
  const token = readToken();
  if (token === cachedToken && cachedState) return cachedState;
  cachedToken = token;
  cachedState = loadState();
  return cachedState;
}

export function commitStudentState(next: StudentState) {
  const saved = persistStudentState(next);
  cachedState = saved;
  cachedToken = readToken();
  emit();
  return saved;
}

export function updateStudentState(updater: (state: StudentState) => StudentState) {
  return commitStudentState(updater(getClientStudentState()));
}

export function subscribeReady() {
  return () => {};
}

export function getClientReady() {
  return true;
}

export function getServerReady() {
  return true;
}
