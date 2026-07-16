import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"
import React from "react"

export interface ApplicationDateTimePickerProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  required?: boolean
  containerClassName?: string
  placeholder?: string
}

export function ApplicationDateTimePicker({
  form,
  name,
  label,
  required,
  containerClassName,
  placeholder = "Select date",
}: ApplicationDateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", containerClassName)}>
          {label && (
            <FormLabel className="mb-2.5">
              {label} {required && <span className="text-primary">*</span>}
            </FormLabel>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-left font-normal transition-[color,box-shadow] duration-200 outline-none justify-start hover:bg-input/60 hover:text-foreground",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    new Date(field.value).toLocaleDateString()
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                defaultMonth={field.value ? new Date(field.value) : undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                  setOpen(false)
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
