import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import ConnectDB from "@/lib/db"
import User from "@/lib/models/User"
import Order from "@/lib/models/Order"

const MEMBER_DISCOUNT_RATE = 0.15
const TAX_RATE = 0.13
const FREE_SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 9.99

export async function POST(request) {
  try {
    const { userId, has } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to place an order" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress, paymentMethod = "cod" } = body

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Detect plan on server to prevent client-side discount tampering
    const isPlus     = has({ plan: "user:shopnest_plus" })
    const isBusiness = has({ plan: "user:shopnest_business" })
    const isMember   = isPlus || isBusiness
    const planSlug   = isBusiness ? "shopnest_business" : isPlus ? "shopnest_plus" : "free_user"

    // Recompute all amounts server-side
    const rawSubtotal    = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const memberDiscount = isMember ? rawSubtotal * MEMBER_DISCOUNT_RATE : 0
    const subtotal       = rawSubtotal - memberDiscount
    const shipping       = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const tax            = subtotal * TAX_RATE
    const total          = subtotal + shipping + tax

    await ConnectDB()

    // Sync Clerk user → MongoDB
    let user = await User.findOne({ clerkId: userId })
    if (!user) {
      const clerkUser = await currentUser()
      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        firstName: clerkUser.firstName ?? "",
        lastName: clerkUser.lastName ?? "",
        avatar: clerkUser.imageUrl ?? "",
      })
    }

    const order = await Order.create({
      user: user._id,
      items: items.map((item) => ({
        product: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      tax,
      shippingCost: shipping,
      total,
      memberDiscount,
      planSlug,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      status: "confirmed",
    })

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order._id,
    })
  } catch (error) {
    console.error("Order error:", error)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ConnectDB()

    const user = await User.findOne({ clerkId: userId })
    if (!user) return NextResponse.json([])

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
