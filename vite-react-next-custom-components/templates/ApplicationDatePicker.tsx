import * as React from "react"
import { cn } from "@/lib/utils"

export interface ApplicationDatePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> {
  mode?: "date" | "time" | "datetime"
  value?: string
  onChange?: (value: string) => void
}

export function ApplicationDatePicker({
  mode = "date",
  value = "",
  onChange,
  className,
  ...props
}: ApplicationDatePickerProps) {
  const typeMap = {
    date: "date",
    time: "time",
    datetime: "datetime-local",
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <div className="relative w-full">
      <input
        type={typeMap[mode]}
        value={value}
        onChange={handleInputChange}
        className={cn(
          "h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm shadow-sm transition-all focus:border-hp-blue focus:ring-1 focus:ring-hp-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
          className
        )}
        {...props}
      />
    </div>
  )
}
