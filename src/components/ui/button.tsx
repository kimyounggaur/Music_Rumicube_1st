import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-45",
        variant === "primary" && "bg-[#191919] text-white hover:bg-black",
        variant === "secondary" && "bg-[var(--panel)] text-[var(--text)] hover:bg-[#efefec]",
        variant === "ghost" && "bg-transparent text-[var(--text)] hover:bg-[var(--panel)]",
        variant === "outline" && "border border-[var(--border)] bg-white text-[var(--text)] hover:bg-[var(--panel)]",
        variant === "danger" && "bg-[#5f3131] text-white hover:bg-[#472525]",
        size === "sm" && "min-h-10 px-3 py-2",
        size === "md" && "px-4 py-2.5",
        size === "icon" && "size-11 p-0",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
