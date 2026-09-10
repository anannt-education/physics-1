import type { Lesson } from "@/lib/types";

export const LESSONS: Lesson[] = [
  {
    id: "lesson-motion-graphs",
    title: "Reading motion from position-time graphs",
    unitId: "u1",
    conceptIds: ["c-xt-velocity", "c-slope-as-rate"],
    estimatedMinutes: 28,
    outcome:
      "Determine whether a cart is speeding up, slowing down, or moving at constant velocity from an x-t graph, and explain the reasoning using slope rather than height.",
    status: "published",
    activities: [
      {
        id: "l1-outcome",
        kind: "outcome",
        title: "What you will be able to do",
        body: "By the end of this lesson you can look at a position-time graph and say, with units, how the object is moving. You will treat the slope as velocity and the height as position — even when a high graph is almost flat.",
      },
      {
        id: "l1-prereq",
        kind: "prereq",
        title: "Prerequisite check",
        body: "This check is a graph-slope calculation. If it is shaky, the next recommendation will be the graph-reading bridge rather than pushing on. A missed check is not a mastery score.",
        itemId: "l1-prereq-slope",
      },
      {
        id: "l1-predict",
        kind: "prediction",
        title: "Predict before the explanation",
        body: "Commit to a prediction. After you answer, the explanation will use your choice — including the common mix-up that “the line goes up, so the cart speeds up.”",
        itemId: "l1-predict-straight",
        diagram: {
          kind: "position-time",
          caption: "A cart on a straight track. Position is plotted against time.",
          alt: "Straight rising x-t line.",
          points: [
            { t: 0, x: 1 },
            { t: 5, x: 6 },
          ],
        },
      },
      {
        id: "l1-explain",
        kind: "explanation",
        title: "Why slope is velocity",
        body: "Position is where the object is. On an x-t graph that is the vertical coordinate — the height of a point. Velocity is how position changes with time. That is a rate, so it is the slope: rise over run, Δx/Δt, with units metres per second.\n\nA straight line has one slope, so one velocity. If the line is high but shallow, the object is far from the origin and moving slowly. If the line is low but steep, the object is near the origin and moving quickly. Height and slope answer different questions.\n\nWhen the graph curves, the slope is changing, so velocity is changing. A curve that gets flatter (while still rising) is motion in +x that is slowing down. Increasing height alone does not mean speeding up.",
        diagram: {
          kind: "dual-xt",
          caption: "Same clock reading: A is higher, B is steeper. B is faster.",
          alt: "Two x-t lines. A shallow and high, B steep and lower.",
          series: [
            {
              label: "A slower, farther",
              points: [
                { t: 0, x: 6 },
                { t: 4, x: 8 },
              ],
            },
            {
              label: "B faster, nearer",
              points: [
                { t: 0, x: 0 },
                { t: 4, x: 8 },
              ],
            },
          ],
          highlightT: 2,
        },
      },
      {
        id: "l1-worked",
        kind: "worked",
        title: "Worked example",
        worked: {
          system: "A laboratory cart on a straight track. The x-axis points along the track.",
          principle: "v = Δx/Δt. For a straight x-t graph, v is constant and equal to the slope.",
          assumptions: "Motion is one-dimensional. The plotted line is straight, so acceleration is zero.",
          diagram: {
            kind: "position-time",
            caption: "Cart A: (0 s, 0.50 m) to (5.0 s, 2.50 m).",
            alt: "Straight line from 0.5 m to 2.5 m in 5 seconds.",
            points: [
              { t: 0, x: 0.5 },
              { t: 5, x: 2.5 },
            ],
            showSlope: true,
          },
          reasoning: [
            "Identify the two readable points: (0, 0.50 m) and (5.0 s, 2.50 m).",
            "Compute Δx = 2.50 m − 0.50 m = 2.00 m (this is not the answer; it is the rise).",
            "Compute Δt = 5.0 s − 0 = 5.0 s.",
            "v = 2.00 m / 5.0 s = 0.40 m/s. The sign is positive, so the cart moves toward +x.",
          ],
          calculation: "v = (2.50 − 0.50) m / (5.0 − 0) s = 0.40 m/s",
          interpretation:
            "The cart crawls. The graph may look “high” if the vertical axis is zoomed, but the slope is only 0.40 m/s. A classmate who reports 2.50 m has read a position, not a velocity.",
        },
      },
      {
        id: "l1-partial",
        kind: "partial",
        title: "Your turn — finish the example",
        partial: {
          given: [
            "System: the cart.",
            "Principle: v = Δx/Δt.",
            "Assumptions: straight line, 1D motion.",
            "Points: (0.0 s, 1.0 m) and (4.0 s, 9.0 m).",
          ],
          prompt: "Compute the velocity, including unit and sign.",
          itemId: "l1-partial-slope",
        },
        itemId: "l1-partial-slope",
      },
      {
        id: "l1-indep",
        kind: "independent",
        title: "Independent check — new scenario",
        body: "This item uses a walker, not the laboratory cart. Hints and the worked solution are available, but using them removes the result from independent mastery evidence.",
        itemId: "l1-independent",
      },
      {
        id: "l1-repr",
        kind: "representation",
        title: "Explain the representation",
        body: "A numerical answer is not enough. State the graph rule in words.",
        itemId: "l1-representation",
      },
      {
        id: "l1-exit",
        kind: "exit",
        title: "Exit check",
        body: "One more graph, then the planner will schedule a retrieval check. Completing the video is not required — there is no video in this slice — and finishing this check does not by itself award Proficient.",
        itemId: "l1-exit",
      },
      {
        id: "l1-sched",
        kind: "retrieval_schedule",
        title: "Retrieval is scheduled",
        body: "A delayed check for “velocity from an x-t graph” is placed on your review list. The first interval is 1 day (rule version v1.0-pilot). If the check is unsuccessful, the next interval shortens. You can browse future lessons; this is a soft gate.",
      },
    ],
  },
  {
    id: "lesson-zero-v-a",
    title: "Zero velocity, nonzero acceleration",
    unitId: "u1",
    conceptIds: ["c-zero-v-nonzero-a"],
    estimatedMinutes: 26,
    outcome:
      "Explain that an object can be instantaneously at rest while its velocity is still changing, using a tossed ball and a second context only after the graph rule is available.",
    status: "published",
    activities: [
      {
        id: "l2-outcome",
        kind: "outcome",
        title: "What you will be able to do",
        body: "You will predict velocity and acceleration at a turning point, say which interaction is still present, and refuse the shortcut “it stopped, so a = 0.”",
      },
      {
        id: "l2-prereq",
        kind: "prereq",
        title: "Prerequisite check",
        body: "You need to read a velocity-time graph before the turning-point argument. If this is weak, repair graph reading first.",
        itemId: "l2-prereq-slope-v",
      },
      {
        id: "l2-predict",
        kind: "prediction",
        title: "Predict: the ball at the highest point",
        body: "A ball is thrown straight up. Equal-time strobe dots crowd together near the top. Predict v and a at the highest point. Upward is positive.",
        itemId: "l2-predict-peak",
      },
      {
        id: "l2-explain",
        kind: "explanation",
        title: "The interaction is still there",
        body: "Velocity is how position changes. Acceleration is how velocity changes. Those are different questions, just as height and slope are different questions on a graph.\n\nAt the highest point the ball’s velocity is instantaneously zero: it has finished going up and has not yet gone down. The gravitational interaction with Earth is still present, so the velocity is still changing — from positive, through zero, to negative. Acceleration remains downward.\n\nA v-t graph of the flight is a straight line with negative slope that crosses the time axis once. Zero velocity is one point on that line, not a pause.",
        diagram: {
          kind: "velocity-time",
          caption: "v versus t for a toss. The line crosses v = 0 while a stays negative.",
          alt: "Straight v-t line from positive, through zero, to negative.",
          points: [
            { t: 0, v: 12 },
            { t: 1.2, v: 0 },
            { t: 2.4, v: -12 },
          ],
          highlightT: 1.2,
          showSlope: true,
        },
      },
      {
        id: "l2-worked",
        kind: "worked",
        title: "Worked example",
        worked: {
          system: "The ball after it leaves the hand, neglecting air resistance.",
          principle: "Constant acceleration a = −g if upward is positive. v = v₀ + at.",
          assumptions: "Free fall; g = 10 m/s² for a clean number; the hand is no longer in contact.",
          reasoning: [
            "At the top, v = 0 by the turning-point definition.",
            "a is still −10 m/s² because gravity did not switch off.",
            "If v₀ = +20 m/s, 0 = 20 − 10 t so t = 2.0 s.",
            "A classmate who sets a = 0 cannot find a time to the top from this equation; that model is inconsistent with the interaction.",
          ],
          calculation: "0 = 20 m/s + (−10 m/s²) t  →  t = 2.0 s",
          interpretation:
            "The ball is at rest for an instant, not for a duration. The v-t graph does not sit on the axis; it crosses.",
        },
      },
      {
        id: "l2-partial",
        kind: "partial",
        title: "Finish the calculation",
        itemId: "l2-partial",
        partial: {
          given: [
            "System: the ball.",
            "a = −10 m/s².",
            "v₀ = +15 m/s.",
            "At the top, v = 0.",
          ],
          prompt: "Find t.",
          itemId: "l2-partial",
        },
      },
      {
        id: "l2-indep",
        kind: "independent",
        title: "Independent check — a cart on an incline",
        body: "New context. The oscillator turning point is not used here because its prerequisites are not yet in this slice.",
        itemId: "l2-independent",
      },
      {
        id: "l2-repr",
        kind: "representation",
        title: "Match the v-t graph",
        itemId: "l2-representation",
      },
      {
        id: "l2-exit",
        kind: "exit",
        title: "Exit check — correct a classmate",
        itemId: "l2-exit",
      },
      {
        id: "l2-sched",
        kind: "retrieval_schedule",
        title: "Retrieval is scheduled",
        body: "A delayed check for the turning-point idea is added to your review list (1-day first interval, rule v1.0-pilot).",
      },
    ],
  },
];

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id);
}
