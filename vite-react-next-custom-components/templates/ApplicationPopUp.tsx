import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"

export const ApplicationPopUp = Dialog
export const ApplicationPopUpTrigger = DialogTrigger
export const ApplicationPopUpClose = DialogClose
export const ApplicationPopUpHeader = DialogHeader
export const ApplicationPopUpFooter = DialogFooter
export const ApplicationPopUpTitle = DialogTitle
export const ApplicationPopUpDescription = DialogDescription

export const ApplicationPopUpContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, children, ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(
      "max-h-[85vh] gap-0 overflow-y-auto rounded-xl p-0 shadow-xl",
      className
    )}
    {...props}
  >
    {children}
  </DialogContent>
))
ApplicationPopUpContent.displayName = "ApplicationPopUpContent"
