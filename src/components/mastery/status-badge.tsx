import type { MasteryState, CoverageState } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Circle, CircleDashed, BookOpen, TrendingUp, CheckCircle2, BookmarkCheck, AlarmClock } from "lucide-react";

const META: Record<
  MasteryState,
  { label: string; icon: typeof Circle; className: string }
> = {
  not_assessed: {
    label: "Not assessed",
    icon: CircleDashed,
    className: "border-dashed",
  },
  learning: {
    label: "Learning",
    icon: BookOpen,
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  developing: {
    label: "Developing",
    icon: TrendingUp,
    className: "bg-sky-50 text-sky-900 border-sky-200",
  },
  proficient: {
    label: "Proficient",
    icon: CheckCircle2,
    className: "bg-teal-50 text-teal-900 border-teal-200",
  },
  retained: {
    label: "Retained",
    icon: BookmarkCheck,
    className: "bg-emerald-50 text-emerald-950 border-emerald-200",
  },
  review_due: {
    label: "Review due",
    icon: AlarmClock,
    className: "bg-orange-50 text-orange-950 border-orange-200",
  },
};

export function MasteryBadge({ state }: { state: MasteryState }) {
  const m = META[state];
  const Icon = m.icon;
  return (
    <Badge variant="outline" className={m.className}>
      <Icon data-icon="inline-start" />
      {m.label}
    </Badge>
  );
}

export function CoverageBadge({ coverage }: { coverage: CoverageState }) {
  const label =
    coverage === "covered" ? "Covered" : coverage === "in_progress" ? "In progress" : "Not covered";
  return (
    <Badge variant="secondary" className="font-normal">
      {label}
    </Badge>
  );
}
