import Link from "next/link"
import { ArrowRight, LayoutGrid } from "lucide-react"
import ConnectDB from "@/lib/db"
import Category from "@/lib/models/Category"

const emojis = {
  smartphones: "📱",
  laptops: "💻",
  audio: "🎧",
  wearables: "⌚",
  cameras: "📷",
  gaming: "🎮",
}

async function getCategories() {
  await ConnectDB()
  const categories = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .lean()
  return categories
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <main className="flex-1">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">All Categories</h1>
          <p className="text-muted-foreground">Browse our full range of product categories.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Empty */}
        {categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="p-4 rounded-full bg-muted">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-lg">No categories yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Categories will appear here once they are added to the store.
            </p>
          </div>
        )}

        {/* Grid */}
        {categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id.toString()}
                href={`/categories/${cat.slug}`}
                className="group relative rounded-xl border bg-card overflow-hidden hover:border-primary hover:shadow-lg transition-all"
              >
                {/* Banner image */}
                <div className="relative h-36 bg-muted overflow-hidden">
                  <img
                    src={cat.image || `https://placehold.co/800x400/6366f1/ffffff?text=${cat.name}`}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <span className="absolute top-3 left-3 text-3xl">
                    {emojis[cat.slug] ?? "🛒"}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold group-hover:text-primary transition-colors">
                      {cat.name}
                    </h2>
                    {cat.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
