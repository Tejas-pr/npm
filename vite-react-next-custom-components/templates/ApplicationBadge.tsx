import * as React from "react"
import { cn } from "@/lib/utils"

export interface ApplicationBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral" | "outline"
  size?: "sm" | "md" | "lg"
}

export const ApplicationBadge = React.forwardRef<HTMLDivElement, ApplicationBadgeProps>(
  ({ className, variant = "neutral", size = "md", children, ...props }, ref) => {
    // Determine target classes based on our custom branding variant
    const variantStyles = {
      primary:
        "bg-hp-blue/10 text-hp-blue border-transparent dark:bg-blue-900/40 dark:text-blue-400",
      secondary: " border-transparent ",
      success:
        "bg-[#EAFDF5] text-[#10B981] border-[#D1FAE5] dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40",
      warning:
        "bg-[#FFF4ED] text-[#F97316] border-[#FFEDD5] dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/40",
      danger:
        "bg-[#FEE2E2] text-[#EF4444] border-[#FEE2E2] dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40",
      neutral: " ",
      outline: "bg-transparent ",
    }

    const sizeStyles = {
      sm: "px-2 py-0.5 text-[10px]",
      md: "px-2.5 py-1 text-[11px]",
      lg: "px-3 py-1.5 text-[12px]",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] border font-semibold tracking-wide transition-colors focus:ring-2 focus:ring-hp-blue focus:ring-offset-2 focus:outline-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ApplicationBadge.displayName = "ApplicationBadge"
