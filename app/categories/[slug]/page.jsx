import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, PackageOpen, Star } from "lucide-react"
import ConnectDB from "@/lib/db"
import Category from "@/lib/models/Category"
import Product from "@/lib/models/Product"
import Image from "next/image"

async function getCategoryWithProducts(slug) {
  await ConnectDB()

  const category = await Category.findOne({ slug, isActive: true }).lean()
  if (!category) return null

  const products = await Product.find({ category: category._id, isActive: true })
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean()

  return { category, products }
}

function discountPct(price, compare) {
  return Math.round(((compare - price) / compare) * 100)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  await ConnectDB()
  const category = await Category.findOne({ slug }).lean()
  if (!category) return {}
  return {
    title: `${category.name} — ShopNest`,
    description: category.description,
  }
}

export default async function CategoryProductsPage({ params }) {
  const { slug } = await params
  const data = await getCategoryWithProducts(slug)

  if (!data) notFound()

  const fmt = (n) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n)

  const { category, products } = data

  return (
    <main className="flex-1">
      {/* Category header */}
      <section className="relative h-44 overflow-hidden">
        <img
          src={category.image || `https://placehold.co/1200x400/6366f1/ffffff?text=${category.name}`}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-6 max-w-7xl mx-auto">
          <Link
            href="/categories"
            className="flex items-center gap-1 text-white/80 hover:text-white text-sm mb-2 transition-colors w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All Categories
          </Link>
          <h1 className="text-3xl font-bold text-white">{category.name}</h1>
          {category.description && (
            <p className="text-white/80 text-sm mt-1">{category.description}</p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Count */}
        {products.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            {products.length} product{products.length !== 1 ? "s" : ""} in {category.name}
          </p>
        )}

        {/* Empty */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="p-4 rounded-full bg-muted">
              <PackageOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-lg">No products yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Products in this category will appear here once they are added.
            </p>
            <Link
              href="/categories"
              className="mt-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse other categories
            </Link>
          </div>
        )}

        {/* Product grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <Link
                key={product._id.toString()}
                href={`/products/${product.slug}`}
                className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-muted h-48 ">
                  <Image
                    src={product.images?.[0] || `https://placehold.co/400x400/6366f1/ffffff?text=${product.name}`}
                    height="1000"
                    width="1000"
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.comparePrice && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                      {discountPct(product.price, product.comparePrice)}%
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded">
                      Out of stock
                    </span>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-0.5 rounded">
                      Only {product.stock} left
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="absolute bottom-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  {product.ratings?.count > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.ratings.average.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({product.ratings.count})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-auto">
                    <span className="font-bold">{fmt(product.price)}</span>
                    {product.comparePrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {fmt(product.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
