export default function ProductLoading() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-4 w-64 bg-muted rounded animate-pulse mb-8" />
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image skeleton */}
          <div className="rounded-2xl bg-muted aspect-square animate-pulse" />
          {/* Details skeleton */}
          <div className="flex flex-col gap-5">
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-full bg-muted rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
            <div className="h-10 w-48 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-muted rounded-lg animate-pulse" />
              <div className="flex-1 h-12 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
