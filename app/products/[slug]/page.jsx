import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Star, StarHalf, ShieldCheck, Truck, RefreshCw, Package } from "lucide-react"
import ConnectDB from "@/lib/db"
import Product from "@/lib/models/Product"
import Category from "@/lib/models/Category"
import Image from "next/image"
import AddToCartButton from "@/components/AddToCartButton"

async function getProduct(slug) {
  await ConnectDB()
  const product = await Product.findOne({ slug, isActive: true })
    .populate("category", "name slug")
    .lean()
  return product
}

async function getSimilarProducts(slug) {
  try {
    await ConnectDB()
    const current = await Product.findOne({ slug, isActive: true }).select("+embedding").lean()
    if (!current?.embedding?.length) return []


    const similar = await Product.aggregate([
      {
        $vectorSearch: {
          index: "product_vector_index",
          path: "embedding",
          queryVector: current.embedding,
          numCandidates: 50,
          limit: 5,
        },
      },
      { $match: { isActive: true, slug: { $ne: slug } } },
      { $limit: 4 },
      {
        $project: {
          name: 1,
          slug: 1,
          price: 1,
          comparePrice: 1,
          images: 1,
          ratings: 1,
          isFeatured: 1,
        },
      },
    ])
    return similar
  } catch (err) {
    console.error("[getSimilarProducts] error:", err.message)
    return []
  }
}

function fmt(n) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n)
}

function discountPct(price, compare) {
  return Math.round(((compare - price) / compare) * 100)
}

function StarRating({ average, count }) {
  const full = Math.floor(average)
  const half = average - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {half && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} className="h-4 w-4 text-muted-foreground/30" />
        ))}
      </div>
      <span className="text-sm font-medium">{average.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({count} reviews)</span>
    </div>
  )
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  await ConnectDB()
  const product = await Product.findOne({ slug }).lean()
  if (!product) return {}
  return {
    title: `${product.name} — ShopNest`,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const [product, similarProducts] = await Promise.all([
    getProduct(slug),
    getSimilarProducts(slug),
  ])

  if (!product) notFound()


  const specs = product.specs ?? {}
  const hasDiscount = product.comparePrice && product.comparePrice > product.price

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-primary transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square">
              <Image
                src={product.images?.[0] || `https://placehold.co/600x600/6366f1/ffffff?text=${product.name}`}
                height="1000"
                width="1000"
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
                  -{discountPct(product.price, product.comparePrice)}% OFF
                </span>
              )}
              {product.isFeatured && (
                <span className="absolute bottom-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
            {/* Thumbnail strip for additional images */}
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border bg-muted shrink-0">
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5 md:pl-10 md:border-l border-border">
            {/* Category + name */}
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm text-primary font-medium hover:underline w-fit"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>

            {/* Rating */}
            {product.ratings?.count > 0 && (
              <StarRating average={product.ratings.average} count={product.ratings.count} />
            )}

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">{fmt(product.price)}</span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through mb-0.5">
                  {fmt(product.comparePrice)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-sm font-semibold text-primary mb-0.5">
                  Save {fmt(product.comparePrice - product.price)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              {product.stock === 0 ? (
                <span className="text-destructive font-medium">Out of stock</span>
              ) : product.stock <= 5 ? (
                <span className="text-destructive font-medium">Only {product.stock} left in stock</span>
              ) : (
                <span className="text-green-600 dark:text-green-400 font-medium">In stock ({product.stock} units)</span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-muted text-muted-foreground px-3 py-2 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <AddToCartButton
                product={{
                  id: product._id.toString(),
                  name: product.name,
                  slug: product.slug,
                  image: product.images?.[0] ?? "",
                  price: product.price,
                  comparePrice: product.comparePrice ?? null,
                  category: product.category?.name ?? "",
                  stock: product.stock,
                }}
              />
              <Link
                href="/checkout"
                className="flex-1 text-center border border-border py-3 px-6 rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                Buy Now
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders over CA$50" },
                { icon: ShieldCheck, label: "2-Year Warranty", sub: "Certified product" },
                { icon: RefreshCw, label: "30-Day Returns", sub: "Hassle-free" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-xs text-muted-foreground">{sub}</span>
                </div>
              ))}
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
            )}
          </div>
        </div>

        {/* Specs */}
        {Object.keys(specs).length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <div className="rounded-xl border overflow-hidden">
              {Object.entries(specs).map(([key, val], i) => (
                <div
                  key={key}
                  className={`grid grid-cols-2 sm:grid-cols-3 gap-2 px-4 py-3 text-sm ${
                    i % 2 === 0 ? "bg-muted/40" : "bg-card"
                  }`}
                >
                  <span className="font-medium text-muted-foreground">{key}</span>
                  <span className="sm:col-span-2">{val}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map((p) => {
                const hasDeal = p.comparePrice && p.comparePrice > p.price
                return (
                  <Link
                    key={p._id.toString()}
                    href={`/products/${p.slug}`}
                    className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={p.images?.[0] || `https://placehold.co/400x400/6366f1/ffffff?text=${encodeURIComponent(p.name)}`}
                        alt={p.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {hasDeal && (
                        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                          -{discountPct(p.price, p.comparePrice)}%
                        </span>
                      )}
                    </div>
                    <div className="p-2 space-y-1">
                      <p className="text-sm font-medium line-clamp-2 leading-snug">{p.name}</p>
                      {p.ratings?.count > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {p.ratings.average.toFixed(1)} ({p.ratings.count})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{fmt(p.price)}</span>
                        {hasDeal && (
                          <span className="text-xs text-muted-foreground line-through">
                            {fmt(p.comparePrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-10">
          <Link
            href={product.category ? `/categories/${product.category.slug}` : "/categories"}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {product.category?.name ?? "Categories"}
          </Link>
        </div>
      </div>
    </main>
  )
}
