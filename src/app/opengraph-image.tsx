import { ImageResponse } from "next/og";

export const alt = "Anannt Education — AP Physics 1 prep for the May 2027 exam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F4F0E4",
          color: "#1C2A3A",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            width: 18,
            height: "100%",
            background: "#2F6A72",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#2F6A72",
              }}
            >
              Anannt Education
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                lineHeight: 1.05,
                marginTop: 24,
                maxWidth: 900,
              }}
            >
              AP Physics 1 prep that diagnoses first.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                marginTop: 20,
                color: "#3A4656",
                maxWidth: 820,
              }}
            >
              May 2027 exam · graph-reading repair · why-this-next coaching
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 20, color: "#2F6A72" }}>
            <span>Diagnosis before lecture</span>
            <span>·</span>
            <span>Scored-item review gates</span>
            <span>·</span>
            <span>Not College Board</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
