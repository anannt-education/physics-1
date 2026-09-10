# Anannt AP Physics 1

Guided, adaptive exam-preparation for AP Physics 1 (May 2027 format). This repository is the first production-quality **Unit 1 slice**: foundation diagnostic, two motion-representation lessons, practice, a misconception repair path, spaced retrieval, a short handwritten FRQ, a student results page, and an author/reviewer publish workflow.

The product is a self-study supplement. It does not promise an AP score and does not claim College Board endorsement or Bluebook equivalence.

Repository: https://github.com/anannt-education/physics-1

## What is in this slice

- Home with one Continue action, today’s plan, review due, next milestone, and weekly effort
- Onboarding (exam year, time, math confidence, accessibility)
- Foundation diagnostic that resumes after refresh
- Course map for all eight official units (Units 2–8 labelled **unpublished**)
- Lesson workspace: outcome, prerequisite check, prediction, explanation with diagrams, worked example, partial example, independent check, representation task, exit check, retrieval schedule
- Practice studio (26 reviewed items)
- Graph-slope repair path and turning-point repair
- Handwritten FRQ upload with page reorder and guided self-mark
- Error notebook and delayed retrieval
- Results that refuse a confident readiness verdict
- Versioned May 2027 exam specification in the mock centre
- Author/reviewer console: a second person must publish; withdraw does not rewrite old attempts

Progress is stored in this browser (`localStorage`). Scoring runs on the Next.js server so answer keys are not shipped in question payloads.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43132/physics-1](http://127.0.0.1:43132/physics-1). Production mount: `https://study.anannt.ae/physics-1`. The dev script binds `0.0.0.0:43132`.

Public pages: subject home, exam guide (`/about`), FAQ, privacy, two Unit 1 lessons, and diagnostic start. Units 2–8 are unpublished. Canonical origin is `https://study.anannt.ae`.

Use the header menu to switch **student / author / reviewer**, load demo students (Maya, Arjun, Priya), or advance the study clock by one day to make retrieval due.

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui.

## Deferred from the PRD

Accounts and entitlements, PostgreSQL, object storage, two protected full mocks, Units 2–8 lessons, AI tutor, interactive simulations, parent/mentor production consoles, payments, and school cohorts.
