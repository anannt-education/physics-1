import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.diagnostic);

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children;
}
