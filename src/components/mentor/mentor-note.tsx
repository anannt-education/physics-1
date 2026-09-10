import { cn } from "@/lib/utils";
import { MENTOR_LABEL } from "@/content/mentor";

export function MentorNote({
  title,
  children,
  tone = "coach",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "coach" | "caution" | "error";
}) {
  return (
    <aside
      className={cn(
        "rounded-xl border p-4",
        tone === "coach" && "border-primary/25 bg-primary/5",
        tone === "caution" && "border-amber-800/25 bg-amber-50",
        tone === "error" && "border-destructive/40 bg-destructive/5"
      )}
    >
      <p className="text-xs font-medium tracking-wide text-primary">{MENTOR_LABEL}</p>
      <p className="mt-1 font-heading text-lg tracking-tight">{title}</p>
      <div className="mt-1 space-y-2 text-sm text-muted-foreground">{children}</div>
    </aside>
  );
}
