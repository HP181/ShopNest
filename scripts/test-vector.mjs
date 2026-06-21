import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  isActive: Boolean,
  embedding: { type: [Number], select: false },
})
const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

async function run() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log("✅ Connected\n")

  // 1. Check embedding is stored
  const p = await Product.findOne({ slug: "razer-deathadder-v3-pro" }).select("+embedding").lean()
  console.log("Product:", p?.name)
  console.log("Embedding dims:", p?.embedding?.length ?? "MISSING")

  if (!p?.embedding?.length) {
    console.error("❌ No embedding found — re-run seed script")
    process.exit(1)
  }

  // 1b. Count how many docs have embeddings stored
  const withEmbedding = await Product.aggregate([
    { $project: { hasEmbed: { $gt: [{ $size: { $ifNull: ["$embedding", []] } }, 0] } } },
    { $match: { hasEmbed: true } },
    { $count: "total" },
  ])
  console.log("Docs with embedding in DB:", withEmbedding[0]?.total ?? 0)

  // 2. Try each likely index name
  const indexNames = ["product_vector_index", "embedding", "vector_index", "default"]

  for (const idx of indexNames) {
    try {
      const res = await Product.aggregate([
        {
          $vectorSearch: {
            index: idx,
            path: "embedding",
            queryVector: p.embedding,
            numCandidates: 20,
            limit: 5,
          },
        },
        { $project: { name: 1, slug: 1, score: { $meta: "vectorSearchScore" } } },
      ])
      console.log(`\n✅ Index "${idx}" works! Results:`)
      res.forEach((r) => console.log(`   ${r.name} — score: ${r.score?.toFixed(4)}`))
    } catch (err) {
      console.log(`\n❌ Index "${idx}" failed: ${err.message.split("\n")[0]}`)
    }
  }

  await mongoose.disconnect()
}

run().catch((e) => { console.error(e); process.exit(1) })
