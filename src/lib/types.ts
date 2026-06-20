// The visual theme (background gradient) applied to a card.
export type Theme = "plum" | "rose" | "sunset" | "berry" | "gold" | "night";

// Optional decorative particle overlays a card can render on top of its
// content (see Effects.tsx).
export type EffectKind = "snow" | "petals" | "pixie" | "confetti" | "sparkle";

// Gradient classes per theme. Tailwind needs the full class strings present
// in source so they aren't purged.
export const THEME_GRADIENTS: Record<Theme, string> = {
  plum: "from-[#2b0b3a] via-[#5b1f6b] to-[#a83279]",
  rose: "from-[#5e0f2e] via-[#b02a5b] to-[#ff7a9c]",
  sunset: "from-[#3a0d2e] via-[#9c2f5f] to-[#ff9d6c]",
  berry: "from-[#1d0b2e] via-[#6a1f7a] to-[#e0518a]",
  gold: "from-[#3a1500] via-[#9c5a1f] to-[#ffce6b]",
  night: "from-[#0a0a23] via-[#241b52] to-[#5b3fa8]",
};

// A single story card. Discriminated union keyed on `kind`.
export type Card =
  | {
      kind: "cover";
      theme: Theme;
      title: string;
      subtitle: string;
      photo?: string;
      effects?: EffectKind[];
    }
  | {
      kind: "bigNumber";
      theme: Theme;
      pre?: string;
      // A literal number, or "daysTogether" to compute live from the first date.
      value: number | "daysTogether";
      suffix?: string;
      label: string;
      sub?: string;
    }
  | {
      kind: "text";
      theme: Theme;
      eyebrow?: string;
      title: string;
      body?: string;
    }
  | {
      kind: "photo";
      theme: Theme;
      photo: string;
      eyebrow?: string;
      caption?: string;
    }
  | {
      kind: "statList";
      theme: Theme;
      title: string;
      items: { label: string; value: string }[];
    }
  | {
      kind: "vacationIntro";
      theme: Theme;
      count: number;
    }
  | {
      kind: "vacation";
      theme: Theme;
      number?: number;
      place: string;
      emoji: string;
      dates?: string;
      blurb: string;
      photo?: string;
      effects?: EffectKind[];
    }
  | {
      kind: "gallery";
      theme: Theme;
      eyebrow?: string;
      emoji?: string;
      title: string;
      subtitle?: string;
      // When true, photos tile edge-to-edge across the whole slide with the
      // title overlaid, instead of small centered thumbnails.
      collage?: boolean;
      items: { photo: string; label?: string }[];
    }
  | {
      kind: "proposal";
      theme: Theme;
      date: string;
      photo?: string;
      effects?: EffectKind[];
    }
  | {
      kind: "countdown";
      theme: Theme;
      eyebrow: string;
      title: string;
      // ISO-ish target the countdown ticks toward.
      target: string;
      footnote?: string;
    }
  | {
      kind: "outro";
      theme: Theme;
      title: string;
      body: string;
    };
