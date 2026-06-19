"use client";

import { THEME_GRADIENTS, type Theme } from "@/lib/types";

/** Common full-screen backdrop for every card: themed gradient + soft glows. */
export default function CardShell({
  theme,
  children,
  bleed,
}: {
  theme: Theme;
  children: React.ReactNode;
  // When provided, renders full-bleed behind the content (e.g. a cover photo).
  bleed?: React.ReactNode;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${THEME_GRADIENTS[theme]}`}
    >
      {bleed}
      {/* soft light blobs for depth */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-black/25 blur-3xl" />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-8 py-20 text-center">
        {children}
      </div>
    </div>
  );
}
