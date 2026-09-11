/** Client-safe IDs only. Answer keys live in server modules under content/items. */

export const DIAGNOSTIC_ITEM_IDS = [
  "diag-slope-line",
  "diag-read-coords",
  "diag-velocity-units",
  "diag-displacement-distance",
  "diag-sign-velocity",
  "diag-algebra-solve",
  "diag-independent-variable",
  "diag-xt-constant-v",
  "diag-height-vs-slope",
  "diag-turning-point",
] as const;

export const PRACTICE_ITEM_IDS = [
  "p-mcq-slope-meaning",
  "p-mcq-height-not-speed",
  "p-mcq-rest-graph",
  "p-mcq-speeding-up-xt",
  "p-rank-steepest",
  "p-num-average-v",
  "p-num-displacement",
  "p-mcq-negative-v",
  "p-mcq-vt-accel",
  "p-mcq-zero-v-a",
  "p-num-accel",
  "p-mcq-tangent",
  "p-exp-not-height",
  "p-mcq-same-x-diff-v",
  "p-mcq-direction-change",
  "p-mcq-units-a",
  "p-mcq-stop-not-a0",
  "p-mcq-frame",
  "p-num-from-graph",
  "p-mcq-area-hint",
  "p-rank-direction",
  "p-mcq-const-a-toss",
  "p-exp-system",
  "p-mcq-calc-ok",
  "p-transfer-incline",
  "p-mcq-ref-zero",
] as const;

export const RETRIEVAL_ITEM_IDS = {
  "c-xt-velocity": "ret-xt-slope",
  "c-zero-v-nonzero-a": "ret-turning",
  "c-slope-as-rate": "ret-explain",
  "c-flattening-xt": "ret-flatten",
} as const;
