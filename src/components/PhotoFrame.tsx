"use client";

import { useState } from "react";

/**
 * Renders a photo, falling back to a styled placeholder when the file is
 * missing or fails to load. This lets the whole app work before any real
 * photos are added to /public/photos.
 */
export default function PhotoFrame({
  src,
  alt = "",
  className = "",
  rounded = "rounded-3xl",
}: {
  src?: string;
  alt?: string;
  className?: string;
  rounded?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 border border-white/20 bg-white/5 text-white/60 backdrop-blur-sm ${rounded} ${className}`}
      >
        <span className="text-4xl">📷</span>
        <span className="px-4 text-center text-xs uppercase tracking-widest">
          photo coming soon
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${rounded} ${className}`}
    />
  );
}
