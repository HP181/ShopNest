import ConnectDB from '@/lib/db'
import Category from '@/lib/models/Category'
import Product from '@/lib/models/Product'
import { checkRole } from '@/utils/roles'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ProductSheet } from './ProductSheet'
import { DeleteProductButton } from './DeleteProductButton'
import { Package, LayoutGrid, ChevronRight, Star } from 'lucide-react'

export async function generateMetadata({ params }) {
  const { slug } = await params
  return { title: `${slug} Products — Admin` }
}

export default async function CategoryProductsPage({ params }) {
  if (!(await checkRole('admin'))) redirect('/')

  const { slug } = await params

  await ConnectDB()
  const category = await Category.findOne({ slug }).lean()
  if (!category) notFound()

  const products = await Product.find({ category: category._id })
    .sort({ createdAt: -1 })
    .lean()

  const categoryId = category._id.toString()

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Button variant="ghost" size="sm" asChild className="h-7 px-2">
          <Link href="/admin/dashboard/categories">
            <LayoutGrid className="h-3.5 w-3.5" /> Categories
          </Link>
        </Button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium px-2">{category.name}</span>
      </nav>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-sm text-muted-foreground">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <ProductSheet categoryId={categoryId} categorySlug={category.slug} />
      </div>

      <Separator className="mb-6" />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No products yet. Add the first one.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          {products.map((product, i) => (
            <div
              key={product._id.toString()}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-muted/40 transition-colors ${i !== 0 ? 'border-t border-border' : ''}`}
            >
              {/* Top row: thumbnail + info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]} alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover shrink-0 border border-border"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    {product.isFeatured && (
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-current shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-muted-foreground">
                      SKU: {product.sku || '—'} · Stock: {product.stock}
                    </p>
                    {/* Price on mobile */}
                    <p className="sm:hidden text-xs font-semibold text-foreground">${product.price.toFixed(2)}</p>
                    {/* Status on mobile */}
                    <span className={`sm:hidden inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.isActive
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side: price + status + actions (desktop), actions only on mobile */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:block text-right shrink-0">
                  <p className="font-semibold text-foreground">${product.price.toFixed(2)}</p>
                  {product.comparePrice && (
                    <p className="text-xs text-muted-foreground line-through">${product.comparePrice.toFixed(2)}</p>
                  )}
                </div>

                <span className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  product.isActive
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>

                <div className="flex items-center gap-2">
                  <ProductSheet
                    product={{
                      ...product,
                      _id: product._id.toString(),
                      category: product.category.toString(),
                    }}
                    categoryId={categoryId}
                    categorySlug={category.slug}
                  />
                  <DeleteProductButton
                    id={product._id.toString()}
                    name={product.name}
                    categorySlug={category.slug}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
