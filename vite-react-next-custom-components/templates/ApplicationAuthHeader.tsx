import { FieldDescription } from "@workspace/ui/components/field"

interface AuthHeaderProps {
  title: string
  description?: React.ReactNode
}

export function ApplicationAuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <a
        href="/"
        className="mb-2 flex items-center gap-2 font-bold text-foreground"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-rosegold font-serif text-base text-white italic">
          T
        </span>
        <span className="text-2xl tracking-tight">Touch Up</span>
      </a>
      <h1 className="text-xl font-bold">{title}</h1>
      {description && <FieldDescription>{description}</FieldDescription>}
    </div>
  )
}
