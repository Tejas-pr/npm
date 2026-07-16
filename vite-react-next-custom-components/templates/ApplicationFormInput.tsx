import * as React from "react"
import type { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

export interface ApplicationFormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "form"> {
  form: UseFormReturn<any>
  name: string
  label?: string
  required?: boolean
  containerClassName?: string
  leftIcon?: React.ReactNode
}

export function ApplicationFormInput({
  form,
  name,
  label,
  required,
  containerClassName,
  leftIcon,
  className,
  onChange,
  ...props
}: ApplicationFormInputProps) {
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
            <div className="relative">
              {leftIcon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 flex items-center justify-center">
                  {leftIcon}
                </span>
              )}
              <Input
                className={cn(leftIcon && "pl-10", className)}
                {...field}
                {...props}
                onChange={(e) => {
                  field.onChange(e)
                  onChange?.(e)
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
