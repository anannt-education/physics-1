import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...ROUTES.practice,
  index: false,
});

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
