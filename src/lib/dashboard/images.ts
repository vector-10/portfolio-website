export type StagedImage = {
  path: string;
  src: string;
  url: string;
  base64: string;
  width: number;
  height: number;
  kb: number;
};

export const MAX_WIDTH = 2400;

export function fileSlug(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "image"
  );
}

export async function compressImage(file: File, folder: "work" | "writing" | "site"): Promise<StagedImage> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't encode image"))), "image/webp", 0.85),
  );
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const src = `/images/${folder}/${fileSlug(file.name)}.webp`;
  return {
    path: `public${src}`,
    src,
    url: URL.createObjectURL(blob),
    base64: btoa(binary),
    width,
    height,
    kb: Math.round(blob.size / 1024),
  };
}
