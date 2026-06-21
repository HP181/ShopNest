import { NextResponse } from "next/server"
import ConnectDB from "@/lib/db"
import Product from "@/lib/models/Product"

export async function GET(request, { params }) {
  try {
    const { slug } = await params

    await ConnectDB()

    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
