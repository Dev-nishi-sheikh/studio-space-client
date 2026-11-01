const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const MAX_FILE_BYTES = 8 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("That image could not be read."));
    reader.readAsDataURL(file);
  });
}

async function compress(file: File, maxWidth = 1400): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("That image file looks corrupted."));
    element.src = dataUrl;
  });

  const scale = Math.min(1, maxWidth / image.width);
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export async function uploadStudioImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose a JPG, PNG or WEBP image.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("That image is over 8MB. Please choose a smaller file.");
  }

  if (IMGBB_KEY) {
    const body = new FormData();
    body.append("image", file);
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(IMGBB_KEY)}`,
      { method: "POST", body },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.data?.url) {
      throw new Error(data?.error?.message || "Image upload failed. Try a URL instead.");
    }
    return String(data.data.url);
  }

  // Demo fallback: compress locally so the browser store stays within quota.
  return compress(file);
}
