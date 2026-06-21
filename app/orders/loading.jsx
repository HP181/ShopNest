export default function OrdersLoading() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 w-36 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-20 bg-muted rounded mt-2 animate-pulse" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
              <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30">
                <div className="space-y-1.5">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center gap-4 px-5 py-3 border-b last:border-0">
                  <div className="w-12 h-12 rounded-lg bg-muted shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-48 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                  <div className="h-4 w-16 bg-muted rounded" />
                </div>
              ))}
              <div className="px-5 py-4 border-t bg-muted/10 flex justify-between">
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="space-y-1.5 text-right">
                  <div className="h-3 w-32 bg-muted rounded ml-auto" />
                  <div className="h-5 w-20 bg-muted rounded ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
