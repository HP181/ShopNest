'use client'

import { useTransition, useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shield, UserX, Loader2, BadgeCheck } from 'lucide-react'
import { setRole, removeRole } from './_actions'

export function UserRoleActions({ userId, currentRole, isSelf }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticRole, setOptimisticRole] = useOptimistic(currentRole)

  function handleSetRole(role) {
    startTransition(async () => {
      setOptimisticRole(role)
      const fd = new FormData()
      fd.set('id', userId)
      fd.set('role', role)
      await setRole(fd)
      router.refresh()
    })
  }

  function handleRemoveRole() {
    startTransition(async () => {
      setOptimisticRole(null)
      const fd = new FormData()
      fd.set('id', userId)
      await removeRole(fd)
      router.refresh()
    })
  }

  const isAdmin = optimisticRole === 'admin'

  return (
    <div className="flex flex-col gap-3">
      {/* Role badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Role:</span>
        {optimisticRole ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
            <BadgeCheck className="h-3 w-3" />
            {optimisticRole}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            No role
          </span>
        )}
        {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Make Admin — only for non-admins */}
        {!isAdmin && (
          <Button
            size="sm"
            variant="default"
            disabled={isPending}
            onClick={() => handleSetRole('admin')}
          >
            <Shield className="h-3 w-3" />
            Make Admin
          </Button>
        )}

        {/* Remove Role — only for admins, never for self */}
        {isAdmin && (
          <Button
            size="sm"
            variant="destructive"
            disabled={isPending || isSelf}
            title={isSelf ? "You can't remove your own admin role" : undefined}
            onClick={handleRemoveRole}
          >
            <UserX className="h-3 w-3" />
            Remove Role
          </Button>
        )}

        {/* Self-guard notice */}
        {isAdmin && isSelf && (
          <p className="self-center text-xs text-muted-foreground">
            You cannot remove your own role.
          </p>
        )}
      </div>
    </div>
  )
}
