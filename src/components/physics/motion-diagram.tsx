import type { DiagramSpec } from "@/lib/types";

function bounds(points: { t: number; x?: number; v?: number }[], key: "x" | "v") {
  const ys = points.map((p) => p[key] ?? 0);
  const xs = points.map((p) => p.t);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 1);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 1);
  const padY = (maxY - minY) * 0.15 || 1;
  return { minX, maxX: maxX === minX ? maxX + 1 : maxX, minY: minY - padY, maxY: maxY + padY };
}

function scale(
  t: number,
  y: number,
  b: { minX: number; maxX: number; minY: number; maxY: number },
  w = 320,
  h = 180,
  pad = 36
) {
  const x = pad + ((t - b.minX) / (b.maxX - b.minX)) * (w - pad * 1.4);
  const py = h - pad - ((y - b.minY) / (b.maxY - b.minY)) * (h - pad * 1.5);
  return { x, y: py };
}

function Polyline({
  points,
  yKey,
  color,
  b,
}: {
  points: { t: number; x?: number; v?: number }[];
  yKey: "x" | "v";
  color: string;
  b: ReturnType<typeof bounds>;
}) {
  const d = points
    .map((p, i) => {
      const s = scale(p.t, p[yKey] ?? 0, b);
      return `${i === 0 ? "M" : "L"} ${s.x} ${s.y}`;
    })
    .join(" ");
  return <path d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />;
}

export function MotionDiagram({ spec }: { spec: DiagramSpec }) {
  if (spec.kind === "strobe" && spec.strobe) {
    return (
      <figure className="rounded-xl border bg-card p-4">
        <svg viewBox="0 0 220 200" className="mx-auto h-48 w-full max-w-sm" role="img" aria-label={spec.alt}>
          <text x="12" y="18" className="fill-muted-foreground" fontSize="11">
            height
          </text>
          <line x1="40" y1="20" x2="40" y2="180" stroke="currentColor" strokeOpacity="0.25" />
          <line x1="40" y1="180" x2="200" y2="180" stroke="currentColor" strokeOpacity="0.25" />
          {spec.strobe.map((dot, i) => {
            const y = 180 - dot.y * 48;
            return (
              <g key={i}>
                <circle cx={70 + i * 14} cy={y} r="6" fill="#0f6e6b" />
                <text x={70 + i * 14} y={y - 10} textAnchor="middle" fontSize="8" fill="currentColor">
                  {dot.label}
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className="mt-2 text-sm text-muted-foreground">{spec.caption}</figcaption>
      </figure>
    );
  }

  const yKey: "x" | "v" = spec.kind === "velocity-time" ? "v" : "x";
  const yLabel = spec.kind === "velocity-time" ? "v (m/s)" : "x (m)";
  const series =
    spec.series ??
    (spec.points
      ? [{ label: "", points: spec.points }]
      : []);
  const allPts = series.flatMap((s) => s.points);
  if (allPts.length === 0) return null;
  const b = bounds(allPts, yKey);
  const colors = ["#0f6e6b", "#c45c26"];

  return (
    <figure className="rounded-xl border bg-card p-4">
      <svg viewBox="0 0 320 180" className="w-full" role="img" aria-label={spec.alt}>
        <line x1="36" y1="20" x2="36" y2="150" stroke="currentColor" strokeOpacity="0.25" />
        <line x1="36" y1="150" x2="300" y2="150" stroke="currentColor" strokeOpacity="0.25" />
        <text x="8" y="16" fontSize="10" className="fill-muted-foreground">
          {yLabel}
        </text>
        <text x="270" y="170" fontSize="10" className="fill-muted-foreground">
          t (s)
        </text>
        {series.map((s, i) => (
          <g key={s.label || i}>
            <Polyline points={s.points} yKey={yKey} color={colors[i % colors.length]} b={b} />
            {s.label ? (
              <text
                x={scale(s.points[s.points.length - 1].t, s.points[s.points.length - 1][yKey] ?? 0, b).x - 8}
                y={scale(s.points[s.points.length - 1].t, s.points[s.points.length - 1][yKey] ?? 0, b).y - 8}
                fontSize="11"
                fill={colors[i % colors.length]}
              >
                {s.label}
              </text>
            ) : null}
          </g>
        ))}
        {spec.showSlope && spec.points && spec.points.length >= 2 ? (
          <SlopeTriangle points={spec.points} yKey={yKey} b={b} />
        ) : null}
        {spec.showHeight && spec.points ? (
          <HeightMarker
            point={spec.points[spec.points.length - 1]}
            yKey={yKey}
            b={b}
            highlightT={spec.highlightT}
          />
        ) : null}
        {spec.highlightT !== undefined && spec.points ? (
          <Highlight t={spec.highlightT} points={spec.points} yKey={yKey} b={b} />
        ) : null}
      </svg>
      <figcaption className="mt-2 text-sm text-muted-foreground">{spec.caption}</figcaption>
    </figure>
  );
}

function SlopeTriangle({
  points,
  yKey,
  b,
}: {
  points: { t: number; x?: number; v?: number }[];
  yKey: "x" | "v";
  b: ReturnType<typeof bounds>;
}) {
  const p0 = points[0];
  const p1 = points[points.length - 1];
  const a = scale(p0.t, p0[yKey] ?? 0, b);
  const c = scale(p1.t, p1[yKey] ?? 0, b);
  const corner = { x: c.x, y: a.y };
  return (
    <g>
      <path
        d={`M ${a.x} ${a.y} L ${corner.x} ${corner.y} L ${c.x} ${c.y}`}
        fill="#0f6e6b"
        fillOpacity="0.12"
        stroke="#0f6e6b"
        strokeDasharray="4 3"
      />
      <text x={(a.x + corner.x) / 2} y={a.y + 14} fontSize="10" fill="#0f6e6b" textAnchor="middle">
        run Δt
      </text>
      <text x={c.x + 6} y={(a.y + c.y) / 2} fontSize="10" fill="#0f6e6b">
        rise
      </text>
    </g>
  );
}

function HeightMarker({
  point,
  yKey,
  b,
  highlightT,
}: {
  point: { t: number; x?: number; v?: number };
  yKey: "x" | "v";
  b: ReturnType<typeof bounds>;
  highlightT?: number;
}) {
  const t = highlightT ?? point.t;
  const y = point[yKey] ?? 0;
  const s = scale(t, y, b);
  const base = scale(t, 0, b);
  return (
    <g>
      <line x1={s.x} y1={s.y} x2={s.x} y2={base.y} stroke="#c45c26" strokeDasharray="3 3" />
      <text x={s.x + 6} y={s.y + 4} fontSize="10" fill="#c45c26">
        height
      </text>
    </g>
  );
}

function Highlight({
  t,
  points,
  yKey,
  b,
}: {
  t: number;
  points: { t: number; x?: number; v?: number }[];
  yKey: "x" | "v";
  b: ReturnType<typeof bounds>;
}) {
  const p0 = points[0];
  const p1 = points[points.length - 1];
  const y0 = p0[yKey] ?? 0;
  const y1 = p1[yKey] ?? 0;
  const y =
    p0.t === p1.t ? y0 : y0 + ((y1 - y0) * (t - p0.t)) / (p1.t - p0.t);
  const s = scale(t, y, b);
  return <circle cx={s.x} cy={s.y} r="5" fill="#c45c26" />;
}
