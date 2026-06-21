"use client"

export default function CategoriesError({ error, reset }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-3">
      <span className="text-4xl">⚠️</span>
      <p className="font-semibold text-lg">Something went wrong</p>
      <p className="text-sm text-muted-foreground">{error?.message ?? "Failed to load categories."}</p>
      <button
        onClick={reset}
        className="mt-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </main>
  )
}
