import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "You bring the problem. I'll ship the product.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage(alt, "Work with me");
}
