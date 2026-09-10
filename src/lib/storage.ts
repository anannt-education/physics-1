import { STATE_VERSION } from "@/lib/types";
import type { StudentState } from "@/lib/types";
import { emptyState } from "@/lib/planner";

export const STORAGE_KEY = "anannt-ap1-state-v1";
const KEY = STORAGE_KEY;

export function loadState(): StudentState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as StudentState;
    if (parsed.version !== STATE_VERSION) return emptyState();
    return { ...emptyState(), ...parsed };
  } catch {
    return emptyState();
  }
}

export function saveState(state: StudentState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
