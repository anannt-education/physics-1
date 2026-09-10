import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anannt Education — AP Physics 1",
    short_name: "Anannt Physics 1",
    description:
      "AP Physics 1 prep for the May 2027 exam: diagnosis, graph-reading repair, and exam-aware practice.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F0E4",
    theme_color: "#2F6A72",
    lang: "en",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
