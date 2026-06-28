'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteProduct } from './_actions'

export function DeleteProductButton({ id, name, categorySlug }) {
  const [, formAction, pending] = useActionState(deleteProduct, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={(e) => {
          if (!confirm(`Delete "${name}"? This cannot be undone.`)) e.preventDefault()
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {pending ? '…' : 'Delete'}
      </Button>
    </form>
  )
}
