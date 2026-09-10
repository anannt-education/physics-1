import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ ...ROUTES.admin, index: false });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
