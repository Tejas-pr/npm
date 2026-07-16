import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import type { ReactNode } from "react"

export interface TabItem {
  value: string
  label: ReactNode
  content?: ReactNode
}

interface ApplicationTabsProps {
  tabs: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (val: string) => void
  children?: ReactNode
  rightElement?: ReactNode
  variant?: "underline" | "segmented"
}

export function ApplicationTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  children,
  rightElement,
  variant = "underline",
}: ApplicationTabsProps) {
  if (variant === "segmented") {
    return (
      <Tabs
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        className="w-auto"
      >
        <div className="flex items-center justify-between">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-[#F4F6F8] p-1 dark:border-white/10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="dark: inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 py-0 text-sm font-medium whitespace-nowrap transition-all data-[state=active]:bg-hp-blue data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {rightElement && <div className="ml-4">{rightElement}</div>}
        </div>

        {tabs.map((tab) =>
          tab.content ? (
            <TabsContent key={tab.value} value={tab.value} className="mt-4 outline-none">
              {tab.content}
            </TabsContent>
          ) : null
        )}

        {children}
      </Tabs>
    )
  }

  return (
    <Tabs
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className="w-full"
    >
      {/*<div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-0">
        <TabsList className="h-auto justify-start gap-8 bg-transparent p-0">
      */}
      <div className="mb-6 flex flex-col gap-3 border-b border-gray-200 pb-0 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="h-auto w-full justify-start gap-4 overflow-x-auto bg-transparent p-0 sm:w-auto sm:gap-8">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              //  className="rounded-none border-b-2 border-transparent px-0 pb-3 tab-label text-[#99A1AF] transition-colors outline-none hover:text-[#0A0A0A] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-[#0A0A0A] data-[state=active]:shadow-none"
              className="!rounded-none !border-0 !border-b-2 !border-transparent !bg-transparent px-0 pb-3 tab-label text-[#99A1AF] !shadow-none transition-colors outline-none hover:text-[#0A0A0A] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none data-active:!border-transparent data-active:!border-b-gray-900 data-active:!bg-transparent data-active:!text-[#0A0A0A] data-active:!shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {rightElement && <div className="mb-2 shrink-0">{rightElement}</div>}
      </div>
      {tabs.map((tab) =>
        tab.content ? (
          <TabsContent key={tab.value} value={tab.value} className="mt-0 outline-none">
            {tab.content}
          </TabsContent>
        ) : null
      )}

      {children}
    </Tabs>
  )
}
