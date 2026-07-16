import React from "react"
import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { ApplicationDropdown } from "./ApplicationDropdown"

const PAGE_SIZE_OPTIONS = [5, 10, 30, 50].map((size) => ({
  label: String(size),
  value: String(size),
}))

interface Props {
  total: number
  pageSize: number
  page: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  variant?: "full" | "simple"
}

export function ApplicationPagination({
  total,
  pageSize,
  page,
  onPageChange,
  onPageSizeChange,
  variant = "full",
}: Props) {
  const totalPages = Math.ceil(total / pageSize)

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  if (total === 0) return null

  if (variant === "simple") {
    return (
      <div className="flex w-full items-center justify-between px-4 py-4">
        <span className="text-xs font-medium text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-6">
          <button
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page <= 1}
            className="text-xs font-semibold text-hp-blue transition-colors hover:text-hp-blue/80 disabled:cursor-not-allowed disabled:text-zinc-300"
          >
            &lt; Previous
          </button>
          <button
            onClick={() => page < totalPages && onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="text-xs font-semibold text-hp-blue transition-colors hover:text-hp-blue/80 disabled:cursor-not-allowed disabled:text-zinc-300"
          >
            Next &gt;
          </button>
        </div>
      </div>
    )
  }
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push("ellipsis")
      const startPage = Math.max(2, page - 1)
      const endPage = Math.min(totalPages - 1, page + 1)
      for (let i = startPage; i <= endPage; i++) pages.push(i)
      if (page < totalPages - 2) pages.push("ellipsis")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-transparent px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span className="text-xs whitespace-nowrap text-muted-foreground">Rows per page</span>
        <ApplicationDropdown
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange(Number(v))}
          placeholder={String(pageSize)}
          triggerClassName="h-8 w-[76px] rounded-lg border-border bg-background px-3 text-xs"
          className="min-w-[76px] rounded-lg border bg-card"
          options={PAGE_SIZE_OPTIONS}
        />
      </div>

      <div className="flex items-center gap-6">
        <p className="text-xs whitespace-nowrap text-muted-foreground">
          Showing {start} to {end} of {total}
        </p>

        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1 sm:gap-1.5">
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  "h-8 rounded-lg px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted",
                  page === 1 && "pointer-events-none opacity-40"
                )}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault()
                  if (page > 1) onPageChange(page - 1)
                }}
              />
            </PaginationItem>

            {getPageNumbers().map((p, index) => {
              if (p === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <span className="flex size-8 items-center justify-center text-xs font-bold tracking-widest text-muted-foreground">
                      •••
                    </span>
                  </PaginationItem>
                )
              }

              const isActive = p === page
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={isActive}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-xs font-semibold transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault()
                      onPageChange(p)
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                className={cn(
                  "h-8 rounded-lg px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted",
                  page === totalPages && "pointer-events-none opacity-40"
                )}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault()
                  if (page < totalPages) onPageChange(page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
