// common table view and data will be rendered in different page using props

/*export const ApplicationTable = () => {
  return <div>ApplicationTable</div>
}
*/

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, Inbox } from "lucide-react"
import React from "react"
import { ApplicationPagination } from "./ApplicationPagination"

export interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
}

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  variant?: "full" | "simple"
}

interface Props<T> {
  data: T[]
  columns: Column<T>[]
  idAccessor?: keyof T
  showSelection?: boolean
  showSerialNo?: boolean
  pagination?: PaginationProps
  onRowClick?: (item: T) => void
  isLoading?: boolean
  stickyHeader?: boolean
  emptyState?: React.ReactNode
  variant?: "default" | "borderless"
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  disabledIds?: string[]
}

function TableSkeletonRows({
  columns,
  rowCount = 5,
  showSelection,
  showSerialNo,
  hasAction,
}: {
  columns: { className?: string }[]
  rowCount?: number
  showSelection?: boolean
  showSerialNo?: boolean
  hasAction?: boolean
}) {
  return (
    <>
      {[...Array(rowCount)].map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          {showSelection && (
            <TableCell className="py-3 pl-3">
              <Skeleton className="h-4 w-4 rounded" />
            </TableCell>
          )}
          {showSerialNo && (
            <TableCell className="px-3 py-3">
              <Skeleton className="h-4 w-4 rounded" />
            </TableCell>
          )}
          {columns.map((col, j) => (
            <TableCell key={j} className={cn("px-3 py-3", col.className)}>
              <Skeleton className="h-4 w-full rounded" />
            </TableCell>
          ))}
          {hasAction && <TableCell className="pr-4" />}
        </TableRow>
      ))}
    </>
  )
}

export function ApplicationTable<T>({
  data,
  columns,
  idAccessor = "id" as keyof T,
  showSelection = false,
  showSerialNo = false,
  pagination,
  onRowClick,
  isLoading = false,
  stickyHeader = false,
  emptyState,
  variant = "default",
  selectedIds,
  onSelectionChange,
  disabledIds,
}: Props<T>) {
  const [internalSelected, setInternalSelected] = useState<string[]>([])
  const selected = selectedIds !== undefined ? selectedIds : internalSelected

  const updateSelection = (newSelection: string[]) => {
    if (selectedIds === undefined) {
      setInternalSelected(newSelection)
    }
    onSelectionChange?.(newSelection)
  }

  const toggleAll = (checked: boolean) => {
    const currentPageIds = data
      .map((d) => String(d[idAccessor]))
      .filter((id) => !(disabledIds || []).includes(id))

    if (checked) {
      const newSelection = Array.from(new Set([...selected, ...currentPageIds]))
      updateSelection(newSelection)
    } else {
      const newSelection = selected.filter((id) => !currentPageIds.includes(id))
      updateSelection(newSelection)
    }
  }

  const toggleRow = (id: string, checked: boolean) => {
    updateSelection(checked ? [...selected, id] : selected.filter((x) => x !== id))
  }

  const colSpan =
    columns.length + (showSelection ? 1 : 0) + (showSerialNo ? 1 : 0) + (onRowClick ? 1 : 0)

  const isBorderless = variant === "borderless"

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        !isBorderless && "overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      )}
    >
      <div
        className={cn("w-full overflow-x-auto", stickyHeader && "max-h-[600px] overflow-y-auto")}
      >
        <Table>
          <TableHeader className={cn("bg-muted/40", stickyHeader && "sticky top-0 z-20")}>
            <TableRow className="hover:bg-transparent">
              {showSelection && (
                <TableHead className="w-[32px] pl-3">
                  <Checkbox
                    checked={
                      data.length > 0 &&
                      data
                        .map((d) => String(d[idAccessor]))
                        .filter((id) => !(disabledIds || []).includes(id)).length > 0 &&
                      data
                        .filter((d) => !(disabledIds || []).includes(String(d[idAccessor])))
                        .every((d) => selected.includes(String(d[idAccessor])))
                    }
                    onCheckedChange={(c: boolean | "indeterminate") => toggleAll(!!c)}
                  />
                </TableHead>
              )}

              {showSerialNo && (
                <TableHead className="h-9 px-3 text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                  #
                </TableHead>
              )}

              {columns.map((col, i) => (
                <TableHead
                  key={i}
                  className={cn(
                    //"h-9 px-3 text-left text-[10px] font-bold tracking-[0.08em] whitespace-nowrap text-muted-foreground uppercase",
                    "h-9 px-3 text-left text-sm font-medium whitespace-nowrap text-foreground",
                    col.className,
                    col.hideOnMobile && "hidden md:table-cell"
                  )}
                >
                  {col.header}
                </TableHead>
              ))}

              {onRowClick && <TableHead className="w-[48px] pr-4" />}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeletonRows
                columns={columns}
                rowCount={pagination?.pageSize || 5}
                showSelection={showSelection}
                showSerialNo={showSerialNo}
                hasAction={!!onRowClick}
              />
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colSpan} className="h-[200px] p-0">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <div className="rounded-xl bg-muted p-3">
                        <Inbox className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 text-center">
                        <h3 className="text-sm font-semibold text-foreground">No data found</h3>
                        <p className="mx-auto max-w-[200px] text-xs text-muted-foreground">
                          We couldn't find any records matching your current view.
                        </p>
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => {
                const id = String(item[idAccessor])
                const isSelected = selected.includes(id)
                const isDisabled = disabledIds?.includes(id)

                return (
                  <TableRow
                    key={id}
                    className={cn(
                      "group transition-colors",
                      !isDisabled && onRowClick && "cursor-pointer hover:bg-muted/40",
                      isSelected && "bg-primary/5 hover:bg-primary/10",
                      isDisabled && "bg-muted/20 opacity-50 grayscale-[0.2]"
                    )}
                    onClick={() => {
                      if (isDisabled) return
                      onRowClick?.(item)
                    }}
                  >
                    {showSelection && (
                      <TableCell className="py-2 pl-3">
                        <Checkbox
                          checked={isSelected}
                          disabled={isDisabled}
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          onCheckedChange={(c: boolean | "indeterminate") => toggleRow(id, !!c)}
                        />
                      </TableCell>
                    )}

                    {showSerialNo && (
                      <TableCell className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        {pagination
                          ? (pagination.page - 1) * pagination.pageSize + index + 1
                          : index + 1}
                      </TableCell>
                    )}

                    {columns.map((col, j) => (
                      <TableCell
                        key={j}
                        className={cn(
                          "px-3 py-1.5 text-[13px] font-medium text-foreground",
                          col.className,
                          col.hideOnMobile && "hidden md:table-cell"
                        )}
                      >
                        {col.cell
                          ? col.cell(item)
                          : col.accessorKey
                            ? String(item[col.accessorKey])
                            : null}
                      </TableCell>
                    ))}

                    {onRowClick && (
                      <TableCell className="w-[48px] px-0 pr-4 text-right">
                        <ChevronRight
                          size={16}
                          className="inline-block text-muted-foreground/0 transition-all group-hover:translate-x-1 group-hover:text-muted-foreground"
                        />
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="border-t border-border bg-muted/20">
          <ApplicationPagination
            total={pagination.total}
            page={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
            variant={pagination.variant}
          />
        </div>
      )}
    </div>
  )
}
