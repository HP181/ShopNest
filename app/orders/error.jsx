"use client"

import { AlertCircle } from "lucide-react"

export default function OrdersError({ error, reset }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-4 px-4">
      <div className="p-5 rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold">Failed to load orders</h1>
      <p className="text-muted-foreground max-w-xs text-sm">
        {error?.message || "Something went wrong while fetching your orders."}
      </p>
      <button
        onClick={reset}
        className="mt-2 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </main>
  )
}
