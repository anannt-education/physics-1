import type { RepairPath } from "@/lib/types";

export const REPAIR_PATHS: RepairPath[] = [
  {
    id: "repair-graph-slope",
    misconceptionId: "mc-height-as-slope",
    title: "Graph-reading bridge: height is not slope",
    summary:
      "You treated a large vertical coordinate as a large rate of change. This short path separates the slope triangle from the height of a point, then asks the same idea on a fresh graph.",
    steps: [
      {
        id: "rp-why",
        kind: "explanation",
        title: "What went wrong",
        body: "On an x-t graph the height of a point answers “where is the object?” The slope of the line (or tangent) answers “how is position changing?” Those numbers even have different units: metres versus metres per second. A high, flat line is a far, slow object. A low, steep line is a near, fast object.",
        diagram: {
          kind: "position-time",
          caption: "Mark a slope triangle. The later point’s height is a different quantity.",
          alt: "Straight line with a rise-over-run triangle.",
          points: [
            { t: 1, x: 2 },
            { t: 4, x: 8 },
          ],
          showSlope: true,
          showHeight: true,
        },
      },
      {
        id: "rp-triangle",
        kind: "independent",
        title: "Activity: read the triangle",
        body: "Name the slope and the height as different quantities.",
        itemId: "repair-slope-triangle",
      },
      {
        id: "rp-fresh",
        kind: "independent",
        title: "Fresh transfer — read the axes",
        body: "A new graph with different axes. Height means whatever the vertical axis says. Do not import the x-t shortcut uncritically, and do not import it the other way either.",
        itemId: "repair-fresh-freefall-graph",
      },
    ],
  },
  {
    id: "repair-turning-point",
    misconceptionId: "mc-stop-means-a-zero",
    title: "Repair: stopping is not a = 0",
    summary:
      "You treated instantaneous rest as evidence that acceleration vanished. Acceleration is the rate of change of velocity; gravity still changes velocity through zero.",
    steps: [
      {
        id: "rt-why",
        kind: "explanation",
        title: "Value versus rate",
        body: "A quantity can be zero and still be changing. At the top of a toss, velocity is zero while gravity continues to change it. Setting a = 0 would describe hovering, not turning around.",
      },
      {
        id: "rt-item",
        kind: "independent",
        title: "Check",
        itemId: "l2-independent",
      },
    ],
  },
];

export function getRepairPath(id: string) {
  return REPAIR_PATHS.find((r) => r.id === id);
}
