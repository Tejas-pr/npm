import * as React from "react"
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

export const ApplicationSheet = Sheet
export const ApplicationSheetTrigger = SheetTrigger
export const ApplicationSheetClose = SheetClose
export const ApplicationSheetHeader = SheetHeader
export const ApplicationSheetFooter = SheetFooter
export const ApplicationSheetTitle = SheetTitle
export const ApplicationSheetDescription = SheetDescription

export const ApplicationSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  React.ComponentPropsWithoutRef<typeof SheetContent>
>(({ className, children, side = "right", ...props }, ref) => (
  <SheetContent
    ref={ref}
    side={side}
    className={cn(
      "flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md",
      className
    )}
    {...props}
  >
    {children}
  </SheetContent>
))
ApplicationSheetContent.displayName = "ApplicationSheetContent"
