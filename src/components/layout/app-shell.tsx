"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  Flag,
  Home,
  Info,
  Map,
  Menu,
  NotebookPen,
  PenLine,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useStudent, useStudentActions } from "@/hooks/use-student";
import { SCENARIOS } from "@/lib/scenarios";
import { emptyState } from "@/lib/planner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MENTOR } from "@/content/mentor";
import { LEGAL, PUBLIC_LESSONS, gateHref, waitlistHref } from "@/lib/mount";

const NAV = [
  { href: "/", label: "Today’s plan", icon: Home },
  { href: "/about", label: "About Anannt", icon: Info },
  { href: "/course", label: "Course map", icon: Map },
  { href: "/practice", label: "Practice", icon: ClipboardCheck },
  { href: "/review", label: "Notebook", icon: NotebookPen },
  { href: "/progress", label: "Progress", icon: BookOpen },
  { href: "/mocks", label: "Mocks", icon: Flag },
  { href: "/admin", label: "Authoring", icon: PenLine },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, ready, error } = useStudent();
  const { setState, replaceState } = useStudentActions();

  const links = (
    <nav aria-label="Course" className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm focus-visible:ring-3 focus-visible:ring-ring/50",
              active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-full flex-col">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
              aria-label="Open course menu"
            >
              <Menu />
              <span className="sr-only">Open course menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Anannt Education</SheetTitle>
              </SheetHeader>
              <div className="px-2">{links}</div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="min-w-0 leading-tight">
            <span className="block font-heading text-lg tracking-tight">
              Anannt Education
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Your AP Physics 1 mentor · May 2027
            </span>
          </Link>
          <Badge variant="outline" className="hidden sm:inline-flex">
            Unit 1 slice
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="review-as">
              Review as student, author, or demo
            </label>
            <select
              id="review-as"
              className="h-8 max-w-[220px] rounded-lg border border-border bg-background px-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue=""
              onChange={(event) => {
                const value = event.target.value;
                if (value.startsWith("role:")) {
                  const role = value.slice(5) as "student" | "author" | "reviewer";
                  setState((s) => ({ ...s, role, actorId: `${role}.local` }));
                } else if (value.startsWith("scenario:")) {
                  const scenario = SCENARIOS.find((item) => item.id === value.slice(9));
                  if (scenario) {
                    replaceState(scenario.load());
                    router.push("/");
                  }
                } else if (value === "clock") {
                  setState((s) => ({ ...s, clockOffsetMs: s.clockOffsetMs + 86400000 }));
                } else if (value === "reset") {
                  replaceState(emptyState());
                  router.push("/");
                }
                event.target.value = "";
              }}
            >
              <option value="" disabled>
                {state.role}
              </option>
              <optgroup label="Role">
                <option value="role:student">Student</option>
                <option value="role:author">Author</option>
                <option value="role:reviewer">Reviewer</option>
              </optgroup>
              <optgroup label="Demo students">
                {SCENARIOS.map((scenario) => (
                  <option key={scenario.id} value={`scenario:${scenario.id}`}>
                    {scenario.name}
                  </option>
                ))}
              </optgroup>
              <option value="clock">Advance study clock 1 day</option>
              <option value="reset">Reset local progress</option>
            </select>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-6">
        <aside className="hidden w-52 shrink-0 md:block">{links}</aside>
        <main id="main" className="min-w-0 flex-1" tabIndex={-1}>
          {!ready ? (
            <p className="text-muted-foreground">{MENTOR.loading.record}</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            children
          )}
        </main>
      </div>
      <footer className="border-t bg-[#0F245C] text-[#F4EFE4]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl space-y-1">
            <p className="font-heading text-base">Anannt Education</p>
            <p className="text-sm text-white/80">
              Physics 1 on study.anannt.ae — Unit 1 two graph-reading lessons. Units 2–8 unpublished.
            </p>
          </div>
          <nav aria-label="About and legal" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/about" className="underline-offset-2 hover:underline">
              About
            </Link>
            <Link href="/course" className="underline-offset-2 hover:underline">
              Course map
            </Link>
            <Link href={PUBLIC_LESSONS[0].path} className="underline-offset-2 hover:underline">
              Lesson 1
            </Link>
            <Link href={PUBLIC_LESSONS[1].path} className="underline-offset-2 hover:underline">
              Lesson 2
            </Link>
            <Link href="/legal" className="underline-offset-2 hover:underline">
              Privacy
            </Link>
            <a href={waitlistHref("u2")} className="underline-offset-2 hover:underline">
              Later units
            </a>
            <a href={gateHref("u1")} className="underline-offset-2 hover:underline">
              Tell us who is sitting
            </a>
          </nav>
        </div>
        <div className="mx-auto max-w-6xl space-y-2 px-4 pb-6 text-xs leading-relaxed text-white/75">
          <p>{LEGAL.ap}</p>
          <p>{LEGAL.psat}</p>
          <p>{LEGAL.supplement}</p>
          <p>{LEGAL.nap}</p>
        </div>
      </footer>
    </div>
  );
}
