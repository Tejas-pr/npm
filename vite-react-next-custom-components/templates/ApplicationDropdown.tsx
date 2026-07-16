import React from "react"
import { ChevronDown, LogOut, Settings, ShieldAlert, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@/lib/utils"

export interface DropdownOption {
  label: string
  value: string
}

export interface ApplicationDropdownProps {
  type?: "select" | "profile"
  options?: DropdownOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  userName?: string
  avatarUrl?: string
  currentRole?: "admin" | "buyer" | "guest"
  onToggleRole?: () => void
  onLogout?: () => void
}

export function ApplicationDropdown({
  type = "select",
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  className,
  triggerClassName,
  userName = "Guest",
  avatarUrl,
  currentRole = "guest",
  onToggleRole,
  onLogout,
}: ApplicationDropdownProps) {
  const [query, setQuery] = React.useState("")

  if (type === "profile") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex items-center space-x-2 rounded-full p-1 transition-colors hover:bg-hover-gray focus:outline-none">
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border md:h-9 md:w-9">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="aspect-square h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-bold text-muted-foreground">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </span>
            <span className="hidden text-sm font-medium text-foreground transition-colors group-hover:text-foreground md:block">
              {userName}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {currentRole === "admin" ? "Admin Account" : "Buyer Account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onToggleRole}
            className="cursor-pointer transition-colors hover:bg-hover-gray hover:!text-foreground hover:**:!text-foreground focus:bg-hover-gray focus:!text-foreground focus:**:!text-foreground"
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            <span>Switch to {currentRole === "buyer" ? "Admin" : "Buyer"} (temp)</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-hover-gray hover:!text-foreground hover:**:!text-foreground focus:bg-hover-gray focus:!text-foreground focus:**:!text-foreground">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="cursor-pointer text-red transition-colors hover:bg-hover-gray hover:!text-red hover:**:!text-red focus:bg-hover-gray focus:!text-red focus:**:!text-red"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <Select {...(value !== undefined ? { value } : { defaultValue })} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary outline-none",
          triggerClassName
        )}
      >
        <SelectValue placeholder={placeholder}>
          {options.find((o) => o.value === (value ?? defaultValue))?.label ?? placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className={cn("rounded-xl border border-border bg-popover p-1 shadow-md", className)}
        position="popper"
        sideOffset={4}
      >
        <div className="sticky top-0 z-10 mb-1 flex items-center gap-2 border-b border-border bg-popover px-2 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          />
        </div>
        <div className="max-h-[240px] overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-3 text-center text-xs text-muted-foreground">
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer transition-colors hover:bg-hover-gray hover:!text-foreground hover:**:!text-foreground focus:bg-hover-gray focus:!text-foreground focus:**:!text-foreground"
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  )
}
