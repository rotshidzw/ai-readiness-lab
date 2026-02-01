import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        variant === "default" &&
          "bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 text-slate-950 shadow-glow hover:scale-[1.02]",
        variant === "ghost" && "text-slate-100/80 hover:text-white",
        variant === "outline" &&
          "border border-white/20 text-white/90 hover:border-white/40 hover:text-white",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export { Button };
