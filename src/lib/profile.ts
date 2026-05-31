/* ─── Profile helpers (localStorage) ─── */

const AVATAR_KEY = "techmate_avatar";

/** Get stored avatar as base64 data URL, or null */
export function getAvatar(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AVATAR_KEY);
  } catch {
    return null;
  }
}

/** Compress and store avatar to localStorage as base64 JPEG */
export function setAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Not in browser"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 200;

        let w = img.width;
        let h = img.height;

        if (w > MAX_SIZE || h > MAX_SIZE) {
          if (w > h) {
            h = Math.round((h / w) * MAX_SIZE);
            w = MAX_SIZE;
          } else {
            w = Math.round((w / h) * MAX_SIZE);
            h = MAX_SIZE;
          }
        }

        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }

        /* Draw a circular crop */
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);

        try {
          localStorage.setItem(AVATAR_KEY, dataUrl);
          window.dispatchEvent(new CustomEvent("techmate:avatar-set"));
          resolve(dataUrl);
        } catch {
          reject(new Error("localStorage full"));
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/** Remove stored avatar */
export function removeAvatar(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AVATAR_KEY);
    window.dispatchEvent(new CustomEvent("techmate:avatar-set"));
  } catch {
    /* ignore */
  }
}

/** Custom event name for avatar changes */
export const AVATAR_EVENT = "techmate:avatar-set";
