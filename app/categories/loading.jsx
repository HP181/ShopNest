export default function CategoriesLoading() {
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary/10 to-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-9 w-48 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-muted rounded animate-pulse" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
              <div className="h-36 bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
