import { Skeleton } from '@/components/ui/skeleton'

export default function InsightsLoading() {
  return (
    <div className="min-h-screen bg-studio-white">
      {/* Header skeleton */}
      <div className="sticky top-0 z-40 border-b border-terrazzo-grey bg-studio-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 md:px-8">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="hidden h-8 w-48 md:block" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-6 md:px-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Dashboard grid skeleton */}
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-card border border-terrazzo-grey p-5"
            >
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-40 w-full" />
            </div>
          ))}
        </div>

        {/* Timeline skeleton */}
        <div className="rounded-card border border-terrazzo-grey p-5">
          <Skeleton className="h-5 w-36 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}
