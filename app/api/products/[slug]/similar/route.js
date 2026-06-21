import { NextResponse } from "next/server"
import ConnectDB from "@/lib/db"
import Product from "@/lib/models/Product"

export async function GET(request, { params }) {
  try {
    console.log("Fetching similar products for slug:", slug)
    const { slug } = await params
    await ConnectDB()

    const current = await Product.findOne({ slug, isActive: true }).select("+embedding").lean()
    if (!current?.embedding?.length) {
      return NextResponse.json({ products: [] })
    }

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
      {
        $match: { isActive: true, slug: { $ne: slug } },
      },
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
          score: { $meta: "vectorSearchScore" },
        },
      },
    ])

    return NextResponse.json({ products: similar })
  } catch (err) {
    console.error("[similar-products]", err)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}
