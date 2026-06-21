import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCw } from "lucide-react"
import ConnectDB from "@/lib/db"
import Category from "@/lib/models/Category"
import Product from "@/lib/models/Product"

const fmt = (n) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n)

function discountPct(price, compare) {
  return Math.round(((compare - price) / compare) * 100)
}

const CATEGORY_EMOJI = {
  smartphone: "📱", phone: "📱", mobile: "📱",
  laptop: "💻", computer: "🖥️", pc: "🖥️",
  audio: "🎧", headphone: "🎧", speaker: "🔊",
  wearable: "⌚", watch: "⌚", fitness: "🏃",
  camera: "📷", photo: "📸",
  gaming: "🎮", game: "🕹️",
  tablet: "📲", ipad: "📲",
  tv: "📺", television: "📺",
  accessory: "🔌", accessories: "🔌",
  keyboard: "⌨️", mouse: "🖱️",
  drone: "🚁", robot: "🤖",
  default: "📦",
}

function categoryEmoji(name = "", slug = "") {
  const key = (name + " " + slug).toLowerCase()
  for (const [word, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (key.includes(word)) return emoji
  }
  return CATEGORY_EMOJI.default
}

async function getHomeData() {
  await ConnectDB()

  const [categories, featuredProducts] = await Promise.all([
    // Categories with live product counts via aggregation
    Category.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "products",
          let: { catId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$category", "$$catId"] }, { $eq: ["$isActive", true] }] } } },
            { $count: "n" },
          ],
          as: "productCount",
        },
      },
      {
        $addFields: {
          count: { $ifNull: [{ $arrayElemAt: ["$productCount.n", 0] }, 0] },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
      { $project: { name: 1, slug: 1, image: 1, count: 1 } },
    ]),

    // Featured products
    Product.find({ isFeatured: true, isActive: true })
      .populate("category", "name slug")
      .sort({ "ratings.count": -1 })
      .limit(6)
      .lean(),
  ])

  return { categories, featuredProducts }
}

const perks = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above CA$50" },
  { icon: ShieldCheck, title: "2-Year Warranty", desc: "On all electronics" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day hassle-free returns" },
]

export const metadata = {
  title: "ShopNest — Premium Tech & Gadgets",
  description: "Discover premium electronics at unbeatable prices.",
}

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomeData()

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4 dark:bg-gradient-to-br dark:from-primary/20 dark:via-background dark:to-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              New arrivals every week
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Shop the Latest{" "}
              <span className="text-primary">Tech &amp; Gadgets</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Discover premium electronics at unbeatable prices. From smartphones to laptops — everything you need, delivered fast.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-8xl shadow-xl">
              🛍️
            </div>
          </div>
        </div>
      </section>

      {/* Perks bar */}
      <section className="border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link href="/categories" className="text-sm text-primary hover:underline flex items-center gap-1">
              All categories <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center gap-2 p-1 rounded-xl border bg-card hover:border-primary hover:bg-primary/5 transition-all"
              >
                {cat.image ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                    <Image src={cat.image} width={320} height={180} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {categoryEmoji(cat.name, cat.slug)}
                  </span>
                )}
                <span className="font-medium text-sm text-center leading-snug">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count} item{cat.count !== 1 ? "s" : ""}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/categories" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const hasDiscount = product.comparePrice && product.comparePrice > product.price
              const image = product.images?.[0]
              return (
                <Link
                  key={product._id.toString()}
                  href={`/products/${product.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all"
                >
                  <div className="relative overflow-hidden bg-muted h-52">
                    {image ? (
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-primary/10 to-primary/5">
                        {categoryEmoji(product.category?.name ?? "")}
                      </div>
                    )}
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                        -{discountPct(product.price, product.comparePrice)}%
                      </span>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-0.5 rounded">
                        Only {product.stock} left
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded">
                        Out of stock
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
                    <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.ratings?.count > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{product.ratings.average.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({product.ratings.count})</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{fmt(product.price)}</span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {fmt(product.comparePrice)}
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

      {/* Empty state — no data yet */}
      {categories.length === 0 && featuredProducts.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h2 className="text-xl font-bold mb-2">Store is being stocked</h2>
          <p className="text-muted-foreground text-sm">Products are on their way. Check back soon!</p>
        </section>
      )}
    </main>
  )
}
