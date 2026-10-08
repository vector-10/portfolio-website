import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth, devBypass, isOwner } from "@/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

async function Gate({ children }: { children: React.ReactNode }) {
  await connection();
  if (!devBypass && !isOwner(await auth())) notFound();
  return children;
}

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <Suspense>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
