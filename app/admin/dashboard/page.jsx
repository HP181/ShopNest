import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { SearchUsers } from './SearchUsers'
import { UserRoleActions } from './UserRoleActions'
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { Mail, Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default async function AdminDashboard(params) {
  if (!checkRole('admin')) redirect('/')

  const { userId: currentUserId } = await auth()
  const query = (await params.searchParams).search
  const client = await clerkClient()
  const users = query ? (await client.users.getUserList({ query })).data : []

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">User Management</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Search for users and assign or remove their roles.
        </p>
      </div>

      <Separator className="mb-6" />

      {/* Search card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-6">
        <SearchUsers />
      </div>

      {/* Result count */}
      {query && (
        <p className="mb-4 text-sm text-muted-foreground">
          {users.length === 0
            ? `No users found for "${query}"`
            : `${users.length} user${users.length !== 1 ? 's' : ''} found for "${query}"`}
        </p>
      )}

      {/* User cards */}
      {users.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {users.map((user) => {
            const email = user.emailAddresses.find(
              (e) => e.id === user.primaryEmailAddressId
            )?.emailAddress
            const role = user.publicMetadata.role
            const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?'

            return (
              <div
                key={user.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4 transition-shadow hover:shadow-md"
              >
                {/* User info */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground truncate">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {email}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Role actions — updates without page reload */}
                <UserRoleActions
                  userId={user.id}
                  currentRole={role ?? null}
                  isSelf={user.id === currentUserId}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Empty states */}
      {!query && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Search for a user above to manage their role</p>
        </div>
      )}

      {query && users.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No users found for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
