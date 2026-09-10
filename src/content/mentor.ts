/** Shared Anannt mentor voice — specific, encouraging, never empty praise. */

export const MENTOR_LABEL = "Your mentor · Anannt Education";

export const MENTOR = {
  loading: {
    page: "Assembling this screen from your local record. Nothing is lost while we wait.",
    record: "Restoring your local study record. Your mentor will pick up from the last acknowledged item.",
    question: "Pulling the next reviewed question. Take the time you need — this slice is untimed.",
    practice: "Loading the reviewed practice bank. Withdrawn items stay out of new attempts.",
    retrieval: "Preparing an unseen delayed check. Struggle on a later-day item is expected.",
    evidence: "Compiling only what we actually have evidence for — not a predicted AP score.",
    admin: "Loading the review queue. Unpublished keys stay out of student attempts.",
  },
  empty: {
    reviews:
      "No delayed checks are due yet — that is expected this early. When one appears, we will name the concept and the exact next move.",
    notebook:
      "No errors are logged yet. When a miss carries a tagged misconception, we name the idea, keep your original response, and give you a repair. Struggle is how this course coaches.",
    practice:
      "No published items match this filter. That is the authoring gate working as designed, not a missing week of study. Try another difficulty, or return to today’s plan.",
    frqPages:
      "No pages yet. Photograph your paper when you are ready — writing on paper is the point of this May 2027 hybrid task, not a failure to type.",
    cms: "No CMS actions in this browser yet. Publish still needs a reviewer. That gate is how Anannt keeps scored keys exam-aware.",
    mocks:
      "No protected full forms are available yet. When they are, a seen retake will be labelled and kept out of independent readiness trends.",
  },
  error: {
    page: "This screen failed to render. Your local progress is still in this browser. Try again, or return to today’s plan — we will not pretend the miss did not happen.",
    question:
      "This item is missing or was withdrawn after review. Your previous attempts keep the version you saw. Open today’s plan for the next move.",
    notFound:
      "That screen is not part of the Unit 1 slice. Your mentor still has a concrete next step on Home.",
    score:
      "The scoring service did not acknowledge this response. Your answer is still in the local buffer. That is inconvenient, not a judgement of the physics.",
    name: "Enter a name so reports can address you. No account is created in this slice — progress stays in this browser.",
  },
  score: {
    correctTitle: "That matches the reviewed key",
    incorrectTitle: "Useful miss — here is the idea to repair",
    unknownTitle: "Acknowledged — more evidence needed",
    solutionTitle: "Worked solution — independent evidence is closed for this item",
  },
} as const;
