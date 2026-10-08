import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "I build full products, with the backend done right.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage(alt);
}
