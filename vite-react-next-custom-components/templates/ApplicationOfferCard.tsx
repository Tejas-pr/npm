import { format } from "date-fns"
import { ArrowRight } from "lucide-react"
import { ApplicationBadge } from "./ApplicationBadge"

interface ApplicationOfferCardProps {
  offerNumber: string
  submittedAt: string | null
  updatedAt: string | null
  totalItems: number
  totalValue: number | string
  status: string
  onClickViewDetails?: () => void
}

export function ApplicationOfferCard({
  offerNumber,
  submittedAt,
  updatedAt,
  totalItems,
  totalValue,
  status,
  onClickViewDetails,
}: ApplicationOfferCardProps) {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(totalValue))

  const submittedDate = submittedAt ? format(new Date(submittedAt), "MMM d, yyyy") : "N/A"

  let timeAgo = "N/A"
  if (updatedAt) {
    // Basic time ago format like "2 hours ago", "10 mins ago" etc.
    const updated = new Date(updatedAt).getTime()
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now()
    const diffMs = now - updated
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 60) timeAgo = `${diffMins} mins ago`
    else if (diffHours < 24) timeAgo = `${diffHours} hours ago`
    else timeAgo = format(new Date(updatedAt), "MMM d, yyyy")
  }

  // Status mapping for styling
  const upperStatus = status?.toUpperCase() || ""
  let borderColor = "border-l-gray-300"
  let badgeVariant:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "neutral"
    | "outline" = "neutral"
  let statusText = "Processing request"

  if (["PENDING", "UNDER REVIEW"].includes(upperStatus)) {
    borderColor = "border-l-amber-500"
    badgeVariant = "warning"
    statusText = "Admin reviewing submitted pricing"
  } else if (upperStatus === "COUNTERED") {
    borderColor = "border-l-blue-500"
    badgeVariant = "primary"
    statusText = "Admin countered offer"
  } else if (["APPROVED", "PARTIALLY APPROVED"].includes(upperStatus)) {
    borderColor = "border-l-green-500"
    badgeVariant = "success"
    statusText = "Inventory allocated"
  } else if (upperStatus === "REJECTED") {
    borderColor = "border-l-red-500"
    badgeVariant = "danger"
    statusText = "Offer below minimum threshold"
  } else if (upperStatus === "WITHDRAWN") {
    borderColor = "border-l-gray-500"
    badgeVariant = "neutral"
    statusText = "Buyer withdrew offer"
  }

  return (
    <div
      className={`flex w-full flex-col gap-4 rounded-md border border-l-4 border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5 ${borderColor}`}
    >
      {/* Left Column: Number, Date, Items */}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-foreground">{offerNumber}</h3>
        <p className="text-sm text-muted-foreground">
          Submitted {submittedDate} &nbsp;&middot;&nbsp; {totalItems} Items
        </p>
      </div>

      {/* Middle Column: Value */}
      <div className="text-lg font-bold text-foreground sm:text-xl">{formattedValue}</div>

      {/* Right Column: Status text, Badge, Action */}
      <div className="flex flex-col gap-2 sm:items-end">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-sm text-muted-foreground">{statusText}</span>
          <ApplicationBadge variant={badgeVariant}>{upperStatus}</ApplicationBadge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Updated {timeAgo} &nbsp;&middot;&nbsp;
          </span>
          <button
            onClick={onClickViewDetails}
            className="flex items-center gap-1 text-sm font-semibold text-foreground transition-all hover:underline"
          >
            View details <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
