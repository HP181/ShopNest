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
import { createProduct, updateProduct } from './_actions'

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function ProductSheet({ product, categoryId, categorySlug }) {
  const isEdit = !!product
  const [state, formAction, pending] = useActionState(
    isEdit ? updateProduct : createProduct,
    null,
  )
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(false)
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false)
  const [isActive, setIsActive] = useState(product?.isActive ?? true)

  useEffect(() => {
    if (!slugTouched && !isEdit) setSlug(slugify(name))
  }, [name, slugTouched, isEdit])

  useEffect(() => {
    if (state?.success) {
      setOpen(false)
      if (!isEdit) {
        setName(''); setSlug(''); setIsFeatured(false)
        setIsActive(true); setSlugTouched(false)
      }
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
            <Plus className="h-4 w-4" /> New Product
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="flex flex-col p-0 gap-0 sm:max-w-lg">
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-border">
          <SheetTitle>{isEdit ? 'Edit Product' : 'New Product'}</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Update the product details below.' : 'Fill in the details to add a new product.'}
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className="flex flex-col flex-1 overflow-hidden">
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="categorySlug" value={categorySlug} />
          <input type="hidden" name="isFeatured" value={String(isFeatured)} />
          <input type="hidden" name="isActive" value={String(isActive)} />
          {isEdit && <input type="hidden" name="id" value={product._id} />}

          <div className="flex flex-col gap-5 flex-1 overflow-y-auto px-4 py-5">
            <Field>
              <FieldLabel htmlFor="p-name">Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id="p-name" name="name"
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MacBook Pro 14" required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="p-slug">Slug <span className="text-destructive">*</span></FieldLabel>
              <Input
                id="p-slug" name="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugTouched(true) }}
                placeholder="e.g. macbook-pro-14" required
              />
              <p className="text-xs text-muted-foreground mt-1">Auto-generated from name.</p>
            </Field>

            <Field>
              <FieldLabel htmlFor="p-desc">Description <span className="text-destructive">*</span></FieldLabel>
              <textarea
                id="p-desc" name="description"
                defaultValue={product?.description ?? ''}
                placeholder="Detailed product description…"
                rows={4} required
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="p-price">Price ($) <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id="p-price" name="price" type="number"
                  min="0" step="0.01"
                  defaultValue={product?.price ?? ''}
                  placeholder="0.00" required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="p-compare">Compare Price ($)</FieldLabel>
                <Input
                  id="p-compare" name="comparePrice" type="number"
                  min="0" step="0.01"
                  defaultValue={product?.comparePrice ?? ''}
                  placeholder="0.00"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="p-stock">Stock</FieldLabel>
                <Input
                  id="p-stock" name="stock" type="number" min="0"
                  defaultValue={product?.stock ?? 0}
                  placeholder="0"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="p-sku">SKU</FieldLabel>
                <Input
                  id="p-sku" name="sku"
                  defaultValue={product?.sku ?? ''}
                  placeholder="e.g. MBP-14-M3"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="p-images">Image URLs</FieldLabel>
              <Input
                id="p-images" name="images"
                defaultValue={product?.images?.join(', ') ?? ''}
                placeholder="https://…, https://…"
              />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated URLs.</p>
            </Field>

            <Field>
              <FieldLabel htmlFor="p-tags">Tags</FieldLabel>
              <Input
                id="p-tags" name="tags"
                defaultValue={product?.tags?.join(', ') ?? ''}
                placeholder="laptop, apple, m3"
              />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated tags.</p>
            </Field>

            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-3">
                <Switch id="p-featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label htmlFor="p-featured" className="text-sm font-medium cursor-pointer">Featured product</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="p-active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="p-active" className="text-sm font-medium cursor-pointer">
                  {isActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>

            {state?.error && (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
          </div>

          <SheetFooter className="flex-row gap-2 border-t border-border bg-background">
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
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
