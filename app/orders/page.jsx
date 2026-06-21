import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import ConnectDB from "@/lib/db"
import User from "@/lib/models/User"
import Order from "@/lib/models/Order"
import { Package, ShoppingBag, ArrowLeft, MapPin, CreditCard, Zap } from "lucide-react"

function fmt(n) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n)
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
}

const STATUS_STYLES = {
  pending:    { label: "Pending",    bg: "bg-yellow-100 dark:bg-yellow-950", text: "text-yellow-700 dark:text-yellow-400" },
  confirmed:  { label: "Confirmed",  bg: "bg-blue-100 dark:bg-blue-950",    text: "text-blue-700 dark:text-blue-400" },
  processing: { label: "Processing", bg: "bg-purple-100 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-400" },
  shipped:    { label: "Shipped",    bg: "bg-indigo-100 dark:bg-indigo-950", text: "text-indigo-700 dark:text-indigo-400" },
  delivered:  { label: "Delivered",  bg: "bg-green-100 dark:bg-green-950",  text: "text-green-700 dark:text-green-400" },
  cancelled:  { label: "Cancelled",  bg: "bg-red-100 dark:bg-red-950",      text: "text-red-700 dark:text-red-400" },
}

const PAYMENT_LABELS = {
  cod:  "Cash on Delivery",
  card: "Card",
}

async function getOrders(userId) {
  await ConnectDB()
  const user = await User.findOne({ clerkId: userId }).lean()
  if (!user) return []
  return Order.find({ user: user._id }).sort({ createdAt: -1 }).lean()
}

export const metadata = {
  title: "My Orders — ShopNest",
}

export default async function OrdersPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const orders = await getOrders(userId)

  if (orders.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-4 px-4">
        <div className="p-5 rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <p className="text-muted-foreground max-w-xs">
          You haven't placed any orders. Start shopping and your orders will appear here.
        </p>
        <Link
          href="/categories"
          className="mt-2 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" /> Browse Products
        </Link>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>

      <div className="space-y-6">
          {orders.map((order) => {
            const status = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
            return (
            <div key={order._id.toString()} className="rounded-xl border bg-card overflow-hidde p-10 pb-10! mb-10!" style={{paddingBottom: "20px", marginBottom: "20px"}}>
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5! border-b bg-muted/30" style={{padding: "10px"}}>
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{fmtDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.image || `https://placehold.co/48x48/6366f1/ffffff?text=${item.name[0]}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">{fmt(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Footer: address + totals */}
                <div className="px-5 py-4 border-t bg-muted/10 flex flex-wrap gap-4 justify-between items-end">
                  {/* Shipping address */}
                  {order.shippingAddress?.street && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground" style={{margin: "5px"}}>
                      <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>
                        {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} {order.shippingAddress.zip}
                      </span>
                    </div>
                  )}

                  {/* Payment + totals */}
                  <div className="ml-auto text-right space-y-1 text-sm m-1.5" style={{margin: "5px"}}>
                    <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                      <CreditCard className="h-3.5 w-3.5" />
                      {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                    </div>
                    {order.memberDiscount > 0 && (
                      <div className="flex items-center justify-end gap-1 text-xs text-primary font-medium">
                        <Zap className="h-3 w-3" />
                        Member discount -{fmt(order.memberDiscount)}
                      </div>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground justify-end">
                      <span>Subtotal {fmt(order.subtotal)}</span>
                      {order.shippingCost > 0 && <span>Shipping {fmt(order.shippingCost)}</span>}
                      <span>Tax {fmt(order.tax)}</span>
                    </div>
                    <p className="font-bold text-base">{fmt(order.total)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8!" style={{marginBottom: "10px"}}>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
