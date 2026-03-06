import { Skeleton } from '@/components/ui/skeleton'

export default function RootLoading() {
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

      {/* Content skeleton — wizard layout */}
      <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
        <div className="grid h-full gap-4 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <div className="hidden rounded-card border border-terrazzo-grey p-4 lg:block">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-2 w-full mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="rounded-card border border-terrazzo-grey p-5">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
