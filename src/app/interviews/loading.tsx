import { Skeleton } from '@/components/ui/skeleton'

export default function InterviewsLoading() {
  return (
    <div className="min-h-screen bg-cloud-dancer">
      {/* Header skeleton */}
      <div className="sticky top-0 z-40 border-b border-terrazzo-grey bg-studio-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 md:px-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        {/* Page header skeleton */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-14 w-48 rounded-lg" />
        </div>

        {/* Interview card skeletons */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-card-lg border border-cloud-dancer bg-white shadow-sm"
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="size-2.5 rounded-full" />
                <Skeleton className="h-5 flex-1 max-w-[200px]" />
                <Skeleton className="hidden h-4 w-28 sm:block" />
                <Skeleton className="hidden h-4 w-16 md:block" />
                <Skeleton className="hidden h-4 w-20 sm:block" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex items-center gap-3 border-t border-cloud-dancer px-5 py-2.5">
                <Skeleton className="h-8 w-[180px] rounded-lg" />
                <Skeleton className="h-8 w-[110px] rounded-lg" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
