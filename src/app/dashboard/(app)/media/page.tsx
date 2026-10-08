import { MediaLibrary } from "@/components/dashboard/media-library";
import { listMedia } from "@/lib/dashboard/data";

export const instant = false;

export default async function MediaPage() {
  return <MediaLibrary items={await listMedia()} />;
}
