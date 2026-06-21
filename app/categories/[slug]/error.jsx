"use client"

import Link from "next/link"

export default function CategoryProductsError({ error, reset }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-3">
      <span className="text-4xl">⚠️</span>
      <p className="font-semibold text-lg">Failed to load products</p>
      <p className="text-sm text-muted-foreground">{error?.message ?? "An unexpected error occurred."}</p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/categories"
          className="text-sm border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors"
        >
          Back to categories
        </Link>
      </div>
    </main>
  )
}
