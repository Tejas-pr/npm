import * as React from "react"
import type { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"

export interface ApplicationFormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "form"> {
  form: UseFormReturn<any>
  name: string
  label?: string
  required?: boolean
  containerClassName?: string
  showCharCount?: boolean
}

export function ApplicationFormTextarea({
  form,
  name,
  label,
  required,
  containerClassName,
  showCharCount,
  className,
  ...props
}: ApplicationFormTextareaProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-primary">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              className={cn("resize-none", className)}
              {...field}
              {...props}
            />
          </FormControl>
          {showCharCount && (
            <div className="text-right text-xs text-muted-foreground">
              {field.value?.length || 0} chars
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
