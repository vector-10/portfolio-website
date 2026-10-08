import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "I'm Chukwuduzie. I build products and make them hold up.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage(alt, "About");
}
