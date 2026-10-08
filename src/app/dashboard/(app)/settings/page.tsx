import { SettingsForm } from "@/components/dashboard/settings-form";
import { requireOwner, storeInfo } from "@/lib/dashboard/data";
import { getStore } from "@/lib/dashboard/store";
import { vercelConfigured } from "@/lib/dashboard/vercel";

export const instant = false;

export default async function SettingsPage() {
  await requireOwner();
  const [file, store] = await Promise.all([getStore().read("content/site.json"), storeInfo()]);
  const settings = file
    ? JSON.parse(file.content.toString("utf8"))
    : { available: true, note: "", email: "", resume: "/resume.pdf" };

  return (
    <SettingsForm
      initial={settings}
      sha={file?.sha ?? null}
      store={store}
      allowedUser={process.env.DASHBOARD_ALLOWED_USER ?? "not set"}
      vercel={vercelConfigured()}
    />
  );
}
