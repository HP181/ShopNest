import ConnectDB from '@/lib/db'
import Category from '@/lib/models/Category'
import { checkRole } from '@/utils/roles'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { CategorySheet } from './CategorySheet'
import { DeleteButton } from './DeleteButton'
import { LayoutGrid, ChevronRight } from 'lucide-react'

export default async function CategoriesPage() {
  if (!(await checkRole('admin'))) redirect('/')

  await ConnectDB()
  const categories = await Category.find({}).sort({ name: 1 }).lean()

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Categories</h1>
            <p className="text-sm text-muted-foreground">{categories.length} total</p>
          </div>
        </div>
        <CategorySheet />
      </div>

      <Separator className="mb-6" />

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <LayoutGrid className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No categories yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          {categories.map((cat, i) => (
            <div
              key={cat._id.toString()}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-muted/40 transition-colors ${i !== 0 ? 'border-t border-border' : ''}`}
            >
              {/* Top row on mobile: thumbnail + info + status */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-lg object-cover shrink-0 border border-border" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{cat.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{cat.slug}</p>
                </div>
                <span className={`sm:hidden inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  cat.isActive
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cat.isActive ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Bottom row on mobile: status (desktop only) + actions */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  cat.isActive
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cat.isActive ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/dashboard/categories/${cat.slug}`}>
                    Products <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <CategorySheet category={{ ...cat, _id: cat._id.toString() }} />
                <DeleteButton id={cat._id.toString()} name={cat.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
