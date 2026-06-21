export default function CategoryProductsLoading() {
  return (
    <main className="flex-1">
      <div className="h-44 bg-muted animate-pulse" />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-4 w-40 bg-muted rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
