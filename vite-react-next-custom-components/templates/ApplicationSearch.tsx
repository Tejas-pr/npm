import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, Sparkles, User, Loader2 } from "lucide-react"
import { useSearchSuggestions } from "@/hooks/use-marketplace"
import { Input } from "@workspace/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

interface ApplicationSearchProps {
  className?: string
  placeholder?: string
  autoFocus?: boolean
}

export function ApplicationSearch({
  className,
  placeholder = "Search artists, services...",
  autoFocus = false,
}: ApplicationSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data: suggestions, isLoading } = useSearchSuggestions(debouncedQuery)

  const handleSelect = (suggestion: any) => {
    setOpen(false)
    if (suggestion.type === "artist") {
      navigate(`/artists/${suggestion.slug}`)
    } else {
      navigate(`/artists?search=${encodeURIComponent(suggestion.title)}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setOpen(false)
      navigate(`/artists?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={placeholder}
              autoFocus={autoFocus}
              className="h-10 w-full rounded-full border border-transparent bg-muted/50 pr-4 pl-10 text-sm focus-visible:border-border focus-visible:ring-0 focus-visible:ring-transparent"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                if (!open && e.target.value.length > 0) setOpen(true)
                if (e.target.value.length === 0) setOpen(false)
              }}
              onKeyDown={handleKeyDown}
              onClick={() => {
                if (query.length > 0) setOpen(true)
              }}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[calc(100vw-2rem)] overflow-hidden rounded-xl border-border/50 bg-background/95 p-0 shadow-lg backdrop-blur-md sm:w-[350px]"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()} // Prevents focus stealing
        >
          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : suggestions && suggestions.length > 0 ? (
              <div className="py-2">
                <p className="px-3 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Suggestions
                </p>
                {suggestions.map((s, idx) => (
                  <button
                    key={`${s.type}-${s.id || s.title}-${idx}`}
                    onClick={() => handleSelect(s)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-hover-gray"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                      {s.type === "city" && <MapPin className="h-4 w-4" />}
                      {s.type === "service" && <Sparkles className="h-4 w-4" />}
                      {s.type === "artist" &&
                        (s.image ? (
                          <img
                            src={s.image}
                            alt={s.title}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        ))}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-medium text-foreground">
                        {s.title}
                      </span>
                      {s.subtitle && (
                        <span className="truncate text-xs text-muted-foreground">
                          {s.subtitle}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : debouncedQuery.length >= 2 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found for "{debouncedQuery}"
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Start typing to search...
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
