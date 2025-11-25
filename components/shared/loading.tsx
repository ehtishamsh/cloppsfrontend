import { Loader2 } from "lucide-react"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`h-8 w-8 animate-spin text-muted-foreground ${className}`} />
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/3 bg-muted animate-pulse rounded" />
      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
    </div>
  )
}
