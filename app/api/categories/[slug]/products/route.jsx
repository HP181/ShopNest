import { NextResponse } from "next/server"
import ConnectDB from "@/lib/db"
import Category from "@/lib/models/Category"
import Product from "@/lib/models/Product"

export async function GET(request, { params }) {
  try {
    const { slug } = await params

    await ConnectDB()

    const category = await Category.findOne({ slug, isActive: true }).lean()
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const products = await Product.find({ category: category._id, isActive: true })
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean()

    return NextResponse.json({ category, products })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
