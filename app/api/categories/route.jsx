import { NextResponse } from "next/server"
import ConnectDB from "@/lib/db"
import Category from "@/lib/models/Category"

export async function GET() {
  try {
    await ConnectDB()
    const categories = await Category.find({ isActive: true }).sort({ name: 1 })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
