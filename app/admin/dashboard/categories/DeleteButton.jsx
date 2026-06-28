'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteCategory } from './_actions'

export function DeleteButton({ id, name }) {
  const [, formAction, pending] = useActionState(deleteCategory, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
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
