import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
}

export function Toggle({ className, pressed, ...props }: ToggleProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full border border-white/20 bg-white/10 transition",
        pressed && "bg-sky-500/60",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 translate-x-1 rounded-full bg-white shadow transition",
          pressed && "translate-x-7",
        )}
      />
    </button>
  );
}
