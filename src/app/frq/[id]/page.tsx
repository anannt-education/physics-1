"use client";

import { use, useRef } from "react";
import { getFrq } from "@/content/frq";
import { useStudent, useStudentActions } from "@/hooks/use-student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

export default function FrqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const task = getFrq(id);
  const { state } = useStudent();
  const { saveFrq } = useStudentActions();
  const inputRef = useRef<HTMLInputElement>(null);
  const rec = state.frq[id] ?? {
    taskId: id,
    pages: [],
    typedAlternative: "",
    selfMarkedPointIds: [],
    status: "draft" as const,
  };

  if (!task) {
    return (
      <MentorNote title="That FRQ is not in this slice" tone="error">
        {MENTOR.error.notFound}
      </MentorNote>
    );
  }

  async function addFiles(files: FileList | null) {
    if (!files) return;
    const pages = [...rec.pages];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        alert("Use a photo (JPEG/PNG/WebP) or a PDF.");
        return;
      }
      if (file.size > 1_800_000) {
        alert("That file is larger than 1.8 MB. Use a smaller photo so it can be stored in this browser.");
        return;
      }
      const dataUrl = await readFile(file);
      pages.push({ id: `pg-${Date.now()}-${file.name}`, name: file.name, dataUrl });
    }
    saveFrq(id, { pages, status: "draft" });
  }

  const awarded = task.rubric
    .filter((p) => rec.selfMarkedPointIds.includes(p.id))
    .reduce((s, p) => s + p.points, 0);
  const possible = task.rubric.reduce((s, p) => s + p.points, 0);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: task.title, path: `/frq/${id}` },
        ]}
      />
      <div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{task.minutes} minutes</Badge>
          <Badge variant="secondary">Self-marked practice · not validated readiness</Badge>
        </div>
        <h1 className="mt-2 font-heading text-3xl">{task.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Write on paper the way the May 2027 exam asks. Your mentor will not treat a blank upload
          as a failure — photograph when the paragraph is done.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
          <CardDescription>
            Displayed on screen. Write on paper. This is not Bluebook and does not claim interface equivalence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{task.prompt}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Paper-writing instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {task.writingInstructions.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upload pages</CardTitle>
          <CardDescription>Preview, reorder, and replace pages before submission. Originals stay available; nothing is OCR-replaced.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            Add photo or PDF
          </Button>
          {rec.pages.length === 0 ? (
            <MentorNote title="No pages yet">{MENTOR.empty.frqPages}</MentorNote>
          ) : (
            <ul className="grid gap-3">
              {rec.pages.map((p, i) => (
                <li key={p.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium">Page {i + 1}</span>
                    <span className="text-xs text-muted-foreground">{p.name}</span>
                    <div className="ml-auto flex gap-1">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        disabled={i === 0}
                        aria-label="Move page up"
                        onClick={() => {
                          const pages = [...rec.pages];
                          [pages[i - 1], pages[i]] = [pages[i], pages[i - 1]];
                          saveFrq(id, { pages });
                        }}
                      >
                        <ArrowUp />
                        <span className="sr-only">Move page up</span>
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        disabled={i === rec.pages.length - 1}
                        aria-label="Move page down"
                        onClick={() => {
                          const pages = [...rec.pages];
                          [pages[i + 1], pages[i]] = [pages[i], pages[i + 1]];
                          saveFrq(id, { pages });
                        }}
                      >
                        <ArrowDown />
                        <span className="sr-only">Move page down</span>
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        aria-label="Remove page"
                        onClick={() => saveFrq(id, { pages: rec.pages.filter((x) => x.id !== p.id) })}
                      >
                        <Trash2 />
                        <span className="sr-only">Remove page</span>
                      </Button>
                    </div>
                  </div>
                  {p.dataUrl.startsWith("data:image") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.dataUrl} alt={`Upload page ${i + 1}`} className="max-h-64 rounded-md border" />
                  ) : (
                    <p className="text-sm">PDF stored locally as {p.name}.</p>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div>
            <p className="mb-1 text-sm font-medium">Typed or accessible alternative</p>
            <Textarea
              rows={5}
              value={rec.typedAlternative}
              onChange={(e) => saveFrq(id, { typedAlternative: e.target.value, status: "draft" })}
              placeholder="Use this if you cannot photograph work. It is stored separately and never silently replaces an upload."
            />
          </div>
          <Button
            onClick={() => saveFrq(id, { status: "submitted", submittedAt: new Date().toISOString() })}
            disabled={rec.pages.length === 0 && !rec.typedAlternative.trim()}
          >
            Submit for self-mark
          </Button>
        </CardContent>
      </Card>

      {rec.status !== "draft" ? (
        <Card>
          <CardHeader>
            <CardTitle>Guided self-mark</CardTitle>
            <CardDescription>
              Each point you award should match evidence on a page. Disputes would go to human review on a supported plan. Self-marked points are excluded from validated readiness.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {task.rubric.map((p) => (
              <label key={p.id} className="flex items-start gap-2 text-sm">
                <Checkbox
                  checked={rec.selfMarkedPointIds.includes(p.id)}
                  onCheckedChange={(v) => {
                    const ids = v
                      ? [...rec.selfMarkedPointIds, p.id]
                      : rec.selfMarkedPointIds.filter((x) => x !== p.id);
                    saveFrq(id, { selfMarkedPointIds: ids, status: "self_marked" });
                  }}
                />
                <span>
                  <span className="font-medium">{p.points} pt.</span> {p.criterion}{" "}
                  <span className="text-muted-foreground">({p.evidenceHint})</span>
                </span>
              </label>
            ))}
            <p>
              Self-marked total: {awarded} / {possible}
            </p>
            <Alert>
              <AlertTitle>Reviewed exemplar</AlertTitle>
              <AlertDescription>{task.exemplar}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">
          Submit pages or a typed alternative to open the rubric. Grading is pending until then —
          that wait is the design, not a missing score.
        </p>
      )}
    </div>
  );
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
