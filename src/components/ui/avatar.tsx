"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * Avatar — displays a user's profile image in a circle.
 *
 * Uses next/image for automatic optimization and lazy loading.
 * Falls back to initials when no image URL is provided.
 *
 * Sizes:
 *  - "sm"  — 32px (comment threads, inline mentions)
 *  - "md"  — 40px (post headers, nav)
 *  - "lg"  — 80px (profile page hero)
 *  - "xl"  — 128px (large profile display)
 */

type Size = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: Size;
  className?: string;
}

const sizeMap: Record<Size, { px: number; text: string }> = {
  sm: { px: 32, text: "text-xs" },
  md: { px: 40, text: "text-sm" },
  lg: { px: 80, text: "text-xl" },
  xl: { px: 128, text: "text-3xl" },
};

const dimensionClasses: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-20 w-20",
  xl: "h-32 w-32",
};

export default function Avatar({
  src,
  alt,
  size = "md",
  className,
}: AvatarProps) {
  const { px, text } = sizeMap[size];

  if (!src) {
    // Fallback: show first letter of alt text
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground",
          dimensionClasses[size],
          text,
          className,
        )}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      className={cn(
        "shrink-0 rounded-full object-cover",
        dimensionClasses[size],
        className,
      )}
    />
  );
}
