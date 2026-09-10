"use client";

import { gateHref } from "@/lib/mount";

export function redirectToGate(unit = "") {
  window.location.assign(gateHref(unit));
}
