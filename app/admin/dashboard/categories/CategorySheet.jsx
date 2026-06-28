'use client'

import { useState, useEffect, useActionState } from 'react'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  SheetDescription, SheetFooter, SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Plus, Pencil } from 'lucide-react'
import { createCategory, updateCategory } from './_actions'

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function CategorySheet({ category }) {
  const isEdit = !!category
  const [state, formAction, pending] = useActionState(
    isEdit ? updateCategory : createCategory,
    null,
  )
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(false)
  const [isActive, setIsActive] = useState(category?.isActive ?? true)

  useEffect(() => {
    if (!slugTouched && !isEdit) setSlug(slugify(name))
  }, [name, slugTouched, isEdit])

  useEffect(() => {
    if (state?.success) {
      setOpen(false)
      if (!isEdit) { setName(''); setSlug(''); setIsActive(true); setSlugTouched(false) }
    }
  }, [state, isEdit])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {isEdit ? (
          <Button variant="secondary" size="sm">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" /> New Category
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="flex flex-col p-0 gap-0">
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-border">
          <SheetTitle>{isEdit ? 'Edit Category' : 'New Category'}</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Update the details below.' : 'Fill in the details to create a new category.'}
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className="flex flex-col flex-1 overflow-hidden">
          {isEdit && <input type="hidden" name="id" value={category._id} />}
          <input type="hidden" name="isActive" value={String(isActive)} />

          <div className="flex flex-col gap-5 flex-1 overflow-y-auto px-4 py-5">
            <Field>
              <FieldLabel htmlFor="cat-name">Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id="cat-name" name="name"
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Laptops" required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="cat-slug">Slug <span className="text-destructive">*</span></FieldLabel>
              <Input
                id="cat-slug" name="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugTouched(true) }}
                placeholder="e.g. laptops" required
              />
              <p className="text-xs text-muted-foreground mt-1">Auto-generated from name. Used in URLs.</p>
            </Field>

            <Field>
              <FieldLabel htmlFor="cat-desc">Description</FieldLabel>
              <textarea
                id="cat-desc" name="description"
                defaultValue={category?.description ?? ''}
                placeholder="Brief category description…"
                rows={3}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="cat-image">Image URL</FieldLabel>
              <Input
                id="cat-image" name="image" type="url"
                defaultValue={category?.image ?? ''}
                placeholder="https://example.com/image.jpg"
              />
            </Field>

            <div className="flex items-center gap-3">
              <Switch id="cat-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="cat-active" className="text-sm font-medium cursor-pointer">
                {isActive ? 'Active' : 'Inactive'}
              </Label>
            </div>

            {state?.error && (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
          </div>

          <SheetFooter className="flex-row gap-2 border-t border-border bg-background">
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Category'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
