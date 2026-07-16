import * as React from "react"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

export interface ApplicationInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
  leftIcon?: React.ReactNode
}

export const ApplicationInput = React.forwardRef<
  HTMLInputElement,
  ApplicationInputProps
>(({ label, error, required, leftIcon, className, id, ...props }, ref) => {
  const generatedId = React.useId()
  const inputId = id || generatedId

  return (
    <FieldGroup>
      <Field>
        {label && (
          <FieldLabel htmlFor={inputId}>
            {label} {required && <span className="text-primary">*</span>}
          </FieldLabel>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <Input
            id={inputId}
            ref={ref}
            className={cn(
              leftIcon && "pl-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-sm font-medium text-destructive">
            {error}
          </span>
        )}
      </Field>
    </FieldGroup>
  )
})

ApplicationInput.displayName = "ApplicationInput"
