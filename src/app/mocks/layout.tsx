import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.mocks);

export default function MocksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
