'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const SearchUsers = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const queryTerm = formData.get('search')
        router.push(pathname + '?search=' + queryTerm)
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <Field className="flex-1">
        <FieldLabel htmlFor="search" className="text-foreground font-semibold">
          Search Users
        </FieldLabel>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="search"
            name="search"
            type="text"
            placeholder="Search by name or email…"
            className="pl-9"
          />
        </div>
      </Field>
      <Button
        type="submit"
        className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap hover:cursor-pointer"
      >
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  )
}
