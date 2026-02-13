import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

/**
 * Input — styled text input with a floating-style label feel.
 *
 * Extends native <input> so all standard attributes (type, placeholder, etc.) work.
 * Wrap with a <label> or use aria-label for accessibility.
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "h-10 w-full rounded-xl border border-border bg-muted/50 px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20",
          className,
        )}
        {...props}
      />
    </div>
  );
}
