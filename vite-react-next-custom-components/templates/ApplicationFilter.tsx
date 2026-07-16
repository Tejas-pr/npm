import * as React from "react"

import { SlidersHorizontal } from "lucide-react"
import {
  ApplicationSheet,
  ApplicationSheetContent,
  ApplicationSheetHeader,
  ApplicationSheetTitle,
  ApplicationSheetTrigger,
} from "./ApplicationSheet"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

interface ApplicationFilterProps {
  triggerLabel?: string
  activeCount?: number
  onClearAll?: () => void
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  tabs?: {
    label?: string
    options: { key: string; label: string }[]
    value: string
    onChange: (value: string) => void
  }
}

export function ApplicationFilter({
  triggerLabel = "FILTER & SORT",
  activeCount = 0,
  onClearAll,
  children,
  open,
  onOpenChange,
  tabs,
}: ApplicationFilterProps) {
  return (
    <ApplicationSheet open={open} onOpenChange={onOpenChange}>
      <ApplicationSheetTrigger asChild>
        <button
          className="relative flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-70"
          aria-label="Filter"
        >
          <SlidersHorizontal className="h-5 w-5 stroke-[1.5]" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-black text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </ApplicationSheetTrigger>

      <ApplicationSheetContent className="flex w-full flex-col sm:max-w-[400px]">
        <ApplicationSheetHeader className="flex flex-row items-center justify-between border-b border-border p-4 pr-12">
          <ApplicationSheetTitle className="text-lg font-black tracking-tight uppercase">
            {triggerLabel}
          </ApplicationSheetTitle>
          {onClearAll && (
            <button
              onClick={onClearAll}
              className="absolute top-4 right-12 mt-0.5 text-xs font-bold underline underline-offset-4 hover:no-underline"
            >
              Clear all
            </button>
          )}
        </ApplicationSheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 pt-6">
          {tabs && (
            <div className="space-y-4">
              {tabs.label && (
                <h4 className="text-sm font-semibold tracking-tight">
                  {tabs.label}
                </h4>
              )}
              <Tabs
                value={tabs.value}
                onValueChange={tabs.onChange}
                className="w-full"
              >
                <TabsList className="h-auto flex-wrap justify-start gap-1">
                  {tabs.options.map(({ key, label }) => (
                    <TabsTrigger key={key} value={key}>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
          {children}
        </div>
      </ApplicationSheetContent>
    </ApplicationSheet>
  )
}
