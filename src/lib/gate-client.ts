"use client";

import { SESSION_COOKIE, startUrl } from "@/lib/mount";

export function hasSessionCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => {
    const [key, ...rest] = part.trim().split("=");
    return key === SESSION_COOKIE && rest.join("=").length > 0;
  });
}

export function continueOrStart(unit = ""): boolean {
  if (hasSessionCookie()) return false;
  window.location.assign(startUrl(unit));
  return true;
}
