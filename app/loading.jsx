export default function HomeLoading() {
  return (
    <main className="flex-1 animate-pulse">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="h-5 w-36 bg-muted rounded-full" />
            <div className="h-12 w-3/4 bg-muted rounded-xl" />
            <div className="h-12 w-1/2 bg-muted rounded-xl" />
            <div className="h-5 w-full bg-muted rounded" />
            <div className="h-5 w-5/6 bg-muted rounded" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-32 bg-muted rounded-lg" />
              <div className="h-11 w-28 bg-muted rounded-lg" />
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-80 h-80 rounded-3xl bg-muted" />
          </div>
        </div>
      </section>

      {/* Perks bar skeleton */}
      <section className="border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-44 bg-muted rounded" />
          <div className="h-4 w-28 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card">
              <div className="w-10 h-10 bg-muted rounded-lg" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-3 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Products skeleton */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <div className="h-52 bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-5 w-20 bg-muted rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
