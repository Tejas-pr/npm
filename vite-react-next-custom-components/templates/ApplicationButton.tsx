import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Loader2 } from "lucide-react"

export interface ApplicationButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "variant"
> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "destructive"
  isLoading?: boolean
}

export const ApplicationButton = React.forwardRef<
  HTMLButtonElement,
  ApplicationButtonProps
>(
  (
    { className, variant = "default", isLoading, children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      "relative overflow-hidden transition-all duration-300 ease-out active:scale-[0.98] font-semibold tracking-wide"

    // Map custom variants to styling.
    // "primary" is a beautiful vibrant gradient for primary actions
    // "default" is the standard solid primary color
    // "secondary" is a muted solid color
    const variants = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
      primary:
        "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:from-amber-600 hover:to-orange-700 border-none",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline:
        "border-2 border-primary/20 bg-transparent hover:bg-primary/5 text-primary",
      ghost: "hover:bg-primary/5 text-muted-foreground hover:text-foreground",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
    }

    return (
      <Button
        ref={ref}
        // Override the underlying shadcn variant to "ghost" so our custom classes take full precedence without conflicts
        variant="ghost"
        disabled={isLoading || disabled}
        className={cn(
          baseStyles,
          variants[variant] || variants.default,
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <span className="flex items-center gap-2">{children}</span>
      </Button>
    )
  }
)
ApplicationButton.displayName = "ApplicationButton"
