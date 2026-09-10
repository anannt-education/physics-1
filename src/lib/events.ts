"use client";

import { appPath, EVENT_NAMES, SUBJECT_SLUG, type EventName } from "@/lib/mount";

export function trackEvent(name: EventName, extra: Record<string, string> = {}) {
  if (!(EVENT_NAMES as readonly string[]).includes(name)) return;
  const body = JSON.stringify({
    name,
    subject: SUBJECT_SLUG,
    ...extra,
    at: new Date().toISOString(),
  });
  const url = appPath("/api/events");
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }
  } catch {
    /* fall through */
  }
  void fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
}
