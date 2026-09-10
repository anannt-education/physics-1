import type { Metadata } from "next";
import Link from "next/link";
import { UNITS } from "@/content/curriculum";
import { pageMetadata } from "@/lib/site";
import { PUBLIC_LESSONS, waitlistHref } from "@/lib/mount";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ unitId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unitId } = await params;
  const unit = UNITS.find((u) => u.id === unitId);
  if (!unit) {
    return pageMetadata({
      title: "Physics 1 unit",
      description:
        "That Physics 1 unit is not a published course. Unit 1 two lessons are open; later units stay unpublished.",
      path: `/unit/${unitId}`,
      index: false,
    });
  }
  if (unit.inThisSlice) {
    return pageMetadata({
      title: `Physics 1 Unit 1 — two public lessons`,
      description:
        "Two Unit 1 motion and graph-reading lessons are public. Later units are unpublished. Self-study supplement for May 2027.",
      path: `/unit/${unitId}`,
    });
  }
  return pageMetadata({
    title: `Physics 1 Unit ${unit.number} — unpublished`,
    description:
      "This unit is labelled unpublished. It is not a hidden course. Ask to be told when lesson 1 is ready on study.anannt.ae/start.",
    path: `/unit/${unitId}`,
    index: false,
  });
}

export default async function UnitPage({ params }: Props) {
  const { unitId } = await params;
  const unit = UNITS.find((u) => u.id === unitId);

  if (!unit) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-3xl">That unit is not published</h1>
        <p className="text-muted-foreground">
          We will not invent a fake course here. Unit 1 has two public lessons. Later units wait for
          faculty review.
        </p>
        <a className="underline" href={waitlistHref(unitId)}>
          Ask to be told when lesson 1 is ready
        </a>
      </div>
    );
  }

  if (!unit.inThisSlice) {
    return (
      <article className="space-y-6">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Course map", path: "/course" },
            { name: `Unit ${unit.number}`, path: `/unit/${unit.id}` },
          ]}
        />
        <Badge variant="outline">Unpublished</Badge>
        <h1 className="font-heading text-3xl">
          Unit {unit.number}: {unit.name}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          This unit is labelled unpublished. It is not a hidden course and it is not a 404 pretending
          to be eight filled units. Ask to be told when lesson 1 is ready.
        </p>
        <a className="inline-block underline underline-offset-2" href={waitlistHref(unit.id)}>
          Ask to be told when Unit {unit.number} lesson 1 is ready
        </a>
      </article>
    );
  }

  return (
    <article className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Course map", path: "/course" },
          { name: "Unit 1", path: `/unit/${unit.id}` },
        ]}
      />
      <h1 className="font-heading text-3xl">
        Unit {unit.number}: {unit.name}
      </h1>
      <p className="max-w-2xl text-muted-foreground">
        Two public graph-reading lessons. No account. After lesson 2 we send you to
        study.anannt.ae/start.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {PUBLIC_LESSONS.map((lesson, i) => (
          <Card key={lesson.id}>
            <CardHeader>
              <CardDescription>Public lesson {i + 1}</CardDescription>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button nativeButton={false} render={<Link href={lesson.path} />}>
                {i === 0 ? "Start lesson 1" : "Open lesson 2"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </article>
  );
}
