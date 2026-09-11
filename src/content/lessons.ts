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
  {
    id: "lesson-flattening-xt",
    title: "A flattening x-t graph is slowing down",
    unitId: "u1",
    conceptIds: ["c-flattening-xt", "c-xt-velocity"],
    estimatedMinutes: 24,
    outcome:
      "Read a curve that gets flatter while still rising as slowing down in +x, and refuse the photograph-of-a-hill shortcut.",
    status: "published",
    activities: [
      {
        id: "l3-outcome",
        kind: "outcome",
        title: "What you will be able to do",
        body: "You will look at a curving position-time graph that still rises but gets shallower, say that the object is moving in +x and slowing down, and refuse “it is going over a hill.” This is a Unit 1 companion to the two public graph lessons. Units 2–8 stay unpublished.",
      },
      {
        id: "l3-prereq",
        kind: "prereq",
        title: "Prerequisite check",
        body: "You need slope-as-velocity from the public x-t lesson. If this is shaky, the height-versus-slope repair is the honest next move.",
        itemId: "l3-prereq-slope",
      },
      {
        id: "l3-predict",
        kind: "prediction",
        title: "Predict before the explanation",
        body: "Commit to a reading of this graph before the explanation names the trap.",
        itemId: "l3-predict-flatten",
        diagram: {
          kind: "position-time",
          caption: "A cart on a straight track. Position still increases; the curve gets shallower.",
          alt: "x-t curve that rises and flattens.",
          points: [
            { t: 0, x: 0 },
            { t: 1, x: 3.2 },
            { t: 2, x: 5.6 },
            { t: 3, x: 7.2 },
            { t: 4, x: 8.2 },
            { t: 5, x: 8.7 },
          ],
        },
      },
      {
        id: "l3-explain",
        kind: "explanation",
        title: "The graph is not a photograph of the track",
        body: "An x-t graph plots position against clock reading. It is not a picture of the rails. A curve that still rises has positive velocity: the object is still moving toward +x. A curve that gets flatter has a slope whose magnitude is falling, so the object is slowing down.\n\nThe “hill” reading treats the graph as a path in space. That mix-up is why a classmate says the cart went up and then rolled down when the track was straight the whole time. Height on this graph is position. Slope is velocity. Changing slope is changing velocity.\n\nIf the curve later became horizontal, velocity would be zero. If it then sloped down, velocity would reverse. None of those shapes is a hill on the floor.",
        diagram: {
          kind: "position-time",
          caption: "Same clock: early steep slope, later shallow slope. Still +x, slower.",
          alt: "Flattening x-t curve with slope triangles implied at early and late times.",
          points: [
            { t: 0, x: 0 },
            { t: 1, x: 3.2 },
            { t: 2, x: 5.6 },
            { t: 3, x: 7.2 },
            { t: 4, x: 8.2 },
            { t: 5, x: 8.7 },
          ],
          showSlope: true,
        },
      },
      {
        id: "l3-worked",
        kind: "worked",
        title: "Worked example",
        worked: {
          system: "A laboratory cart on a straight horizontal track. The x-axis points along the track.",
          principle: "v is the slope of x(t). Speeding up or slowing down is about |v| changing, not about whether the graph looks like a hill.",
          assumptions: "Motion is one-dimensional. The plotted curve is the cart’s x versus t, not a map of the room.",
          diagram: {
            kind: "position-time",
            caption: "Read two intervals: 0–1 s and 4–5 s.",
            alt: "Flattening x-t curve from 0 m to about 8.7 m in 5 s.",
            points: [
              { t: 0, x: 0 },
              { t: 1, x: 3.2 },
              { t: 2, x: 5.6 },
              { t: 3, x: 7.2 },
              { t: 4, x: 8.2 },
              { t: 5, x: 8.7 },
            ],
            showSlope: true,
          },
          reasoning: [
            "From 0 to 1 s, Δx ≈ 3.2 m, so average v ≈ 3.2 m/s toward +x.",
            "From 4 to 5 s, Δx ≈ 0.5 m, so average v ≈ 0.5 m/s toward +x.",
            "Position is still increasing, so the cart has not reversed.",
            "The drop in |v| is slowing down. The graph’s “hill-like” shape is a coincidence of the axes, not a hill on the track.",
          ],
          calculation: "v_avg, early ≈ 3.2 m/s; v_avg, late ≈ 0.5 m/s. Same sign, smaller magnitude.",
          interpretation:
            "The cart crawls late in the interval. A classmate who says “it went over a hill” has read the graph as a photograph. That is the repair this sitting exists for.",
        },
      },
      {
        id: "l3-partial",
        kind: "partial",
        title: "Your turn — finish the example",
        partial: {
          given: [
            "System: the cart.",
            "Principle: v = slope of x(t).",
            "Assumptions: 1D motion on a straight track.",
            "Points: (0.0 s, 1.0 m), (2.0 s, 7.0 m), (5.0 s, 8.5 m).",
          ],
          prompt: "Compare the two average velocities and say whether the cart reversed.",
          itemId: "l3-partial-slopes",
        },
        itemId: "l3-partial-slopes",
      },
      {
        id: "l3-indep",
        kind: "independent",
        title: "Independent check — a bus, not the cart",
        body: "New context. Hints are allowed; using them removes the result from independent mastery evidence.",
        itemId: "l3-independent",
      },
      {
        id: "l3-repr",
        kind: "representation",
        title: "Name the graph rule",
        body: "A numerical slope is not enough. State what a flattening rising curve means in words.",
        itemId: "l3-representation",
      },
      {
        id: "l3-exit",
        kind: "exit",
        title: "Exit check — correct a classmate",
        body: "One written repair. Completing this sitting is not a Physics 1 course, and it does not award a 1–5.",
        itemId: "l3-exit",
      },
      {
        id: "l3-sched",
        kind: "retrieval_schedule",
        title: "Retrieval is scheduled",
        body: "A delayed check for flattening x-t graphs is placed on your review list (1-day first interval, rule v1.0-pilot). Two public lessons stay public; this third sitting required the study form.",
      },
    ],
  },
];

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id);
}
