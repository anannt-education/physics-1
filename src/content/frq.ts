import type { FrqTask } from "@/lib/types";

export const FRQ_TASKS: FrqTask[] = [
  {
    id: "frq-flattening-graph",
    title: "Short written explanation: a flattening x-t graph",
    minutes: 12,
    version: 1,
    conceptIds: ["c-xt-velocity", "c-slope-as-rate"],
    prompt:
      "A cart’s position-time graph is a smooth curve that is still increasing but becoming flatter. In a clear paragraph written on paper, (a) state whether the cart’s velocity is increasing, decreasing, or zero at a labelled instant on the flattening part of the curve, (b) justify your claim using a feature of the graph (not a memorized slogan), and (c) state one thing the graph’s height at that instant does not tell you about the motion.",
    writingInstructions: [
      "Write on paper. The May 2027 exam is hybrid: prompts on screen, free response on paper.",
      "This platform is not Bluebook and does not claim interface equivalence.",
      "Use a dark pen. Photograph or scan pages so the writing fills the frame.",
      "You may also type an accessible alternative. Typed work is stored separately and never silently replaces the upload.",
      "Calculators are allowed, but this task is qualitative.",
    ],
    rubric: [
      {
        id: "frq-a",
        points: 1,
        criterion: "States that velocity is decreasing (the cart is slowing down) while still moving in the +x direction, or equivalent.",
        evidenceHint: "Look for decreasing |v| or “slowing down,” not “stopped” unless the slope is actually zero.",
      },
      {
        id: "frq-b",
        points: 2,
        criterion: "Justification uses decreasing slope / flatter tangent / smaller Δx for the same Δt.",
        evidenceHint: "Graph feature: slope or steepness changing.",
      },
      {
        id: "frq-c",
        points: 1,
        criterion: "States that height is position (or that height alone is not speed/velocity).",
        evidenceHint: "Height ≠ speed.",
      },
    ],
    exemplar:
      "(a) The cart’s velocity is still positive but decreasing. (b) The tangent to x(t) is becoming less steep, so |Δx/Δt| is getting smaller. (c) The height of the graph is the cart’s position; a large x would not, by itself, mean a large speed.",
  },
];

export function getFrq(id: string) {
  return FRQ_TASKS.find((f) => f.id === id);
}
