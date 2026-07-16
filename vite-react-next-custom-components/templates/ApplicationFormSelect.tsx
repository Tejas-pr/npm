import type { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export interface ApplicationFormSelectOption {
  value: string
  label: string
}

export interface ApplicationFormSelectProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  required?: boolean
  options: ApplicationFormSelectOption[]
  placeholder?: string
  containerClassName?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export function ApplicationFormSelect({
  form,
  name,
  label,
  required,
  options,
  placeholder = "Select",
  containerClassName,
  disabled,
  onValueChange,
}: ApplicationFormSelectProps) {
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
          <Select
            onValueChange={(val) => {
              field.onChange(val)
              onValueChange?.(val)
            }}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-60">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
