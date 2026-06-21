"use client"

import { useState } from "react"
import { useAuth, useUser, SignInButton } from "@clerk/nextjs"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/lib/features/cart/cartSlice"
import Link from "next/link"
import {
  Minus, Plus, Trash2, ShoppingCart, ArrowLeft,
  Tag, Package, CheckCircle, Loader2, Zap,
} from "lucide-react"

function fmt(n) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n)
}

const TAX_RATE = 0.13
const FREE_SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 9.99
const MEMBER_DISCOUNT_RATE = 0.15

const initialAddress = { name: "", street: "", city: "", state: "", zip: "", country: "CA" }

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const { isSignedIn, isLoaded } = useUser()
  const { has } = useAuth()

  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartTotal)
  const count = useAppSelector(selectCartCount)

  // Detect active plan
  const isPlus     = isSignedIn && has?.({ plan: "user:shopnest_plus" })
  const isBusiness = isSignedIn && has?.({ plan: "user:shopnest_business" })
  const isMember   = isPlus || isBusiness

  const memberDiscount = isMember ? subtotal * MEMBER_DISCOUNT_RATE : 0
  const discountedSubtotal = subtotal - memberDiscount
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = discountedSubtotal * TAX_RATE
  const total = discountedSubtotal + shipping + tax

  const [address, setAddress] = useState(initialAddress)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(null)
  const [error, setError] = useState("")

  function handleAddress(e) {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const addressComplete =
    address.name && address.street && address.city && address.state && address.zip

  async function handlePlaceOrder() {
    if (!addressComplete) {
      setError("Please fill in all shipping address fields.")
      return
    }
    setError("")
    setPlacing(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal: discountedSubtotal,
          tax,
          shipping,
          total,
          memberDiscount,
          planSlug: isBusiness ? "shopnest_business" : isPlus ? "shopnest_plus" : "free_user",
          shippingAddress: {
            street: `${address.name}, ${address.street}`,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
          },
          paymentMethod,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to place order")
      dispatch(clearCart())
      setPlaced({ orderNumber: data.orderNumber })
    } catch (err) {
      setError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  // ── Order placed success screen ───────────────────────────────────────────
  if (placed) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-4 px-4">
        <div className="p-5 rounded-full bg-green-100 dark:bg-green-950">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold">Order Placed!</h1>
        <p className="text-muted-foreground max-w-sm">
          Your order <span className="font-semibold text-foreground">{placed.orderNumber}</span> has
          been confirmed. We'll get it shipped soon.
        </p>
        <div className="flex gap-3 mt-2">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Package className="h-4 w-4" /> View Orders
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-4 px-4">
        <div className="p-5 rounded-full bg-muted">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground max-w-xs">
          Looks like you haven't added anything yet. Start shopping to fill it up.
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{count} item{count !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Clear cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column: items + shipping */}
          <div className="lg:col-span-2 space-y-6">

            {/* Cart items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-xl border bg-card p-4 items-start">
                  <Link href={`/products/${item.slug}`} className="shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.image || `https://placehold.co/80x80/6366f1/ffffff?text=${item.name}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {item.category && <p className="text-xs text-muted-foreground mb-0.5">{item.category}</p>}
                        <Link href={`/products/${item.slug}`} className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="shrink-0 p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          className="px-2.5 py-1.5 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold min-w-[2rem] text-center border-x">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="px-2.5 py-1.5 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{fmt(item.price * item.quantity)}</p>
                        {item.quantity > 1 && <p className="text-xs text-muted-foreground">{fmt(item.price)} each</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping address */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-bold text-base mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "name", label: "Full Name", placeholder: "John Doe", span: 2 },
                  { name: "street", label: "Street Address", placeholder: "123 Main St", span: 2 },
                  { name: "city", label: "City", placeholder: "Toronto" },
                  { name: "state", label: "Province", placeholder: "ON" },
                  { name: "zip", label: "Postal Code", placeholder: "M5H 2N2" },
                  { name: "country", label: "Country", placeholder: "CA" },
                ].map(({ name, label, placeholder, span }) => (
                  <div key={name} className={span === 2 ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={address[name]}
                      onChange={handleAddress}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-bold text-base mb-4">Payment Method</h2>
              <div className="space-y-2">
                {[
                  { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives" },
                  { value: "card", label: "Credit / Debit Card", desc: "Coming soon — Stripe integration" },
                ].map(({ value, label, desc }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === value ? "border-primary bg-primary/5" : "hover:bg-muted"
                    } ${value === "card" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => value !== "card" && setPaymentMethod(value)}
                      className="accent-primary"
                      disabled={value === "card"}
                    />
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Link href="/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
          </div>

          {/* Right column: order summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border bg-card p-6 sticky top-24 space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>

              {/* Member discount badge */}
              {isMember && (
                <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-3 py-2 text-xs font-semibold">
                  <Zap className="h-3.5 w-3.5 shrink-0" />
                  {isBusiness ? "Business" : "Plus"} member — 15% discount applied!
                </div>
              )}

              {/* Upsell for free users */}
              {isSignedIn && !isMember && (
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 border border-primary/30 text-primary rounded-lg px-3 py-2 text-xs font-medium hover:bg-primary/5 transition-colors"
                >
                  <Zap className="h-3.5 w-3.5 shrink-0" />
                  Upgrade to Plus and save 15% on this order
                </Link>
              )}

              {/* Coupon */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button className="px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                  Apply
                </button>
              </div>

              {/* Shipping notice */}
              {discountedSubtotal < FREE_SHIPPING_THRESHOLD ? (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  Add <span className="font-semibold text-foreground">{fmt(FREE_SHIPPING_THRESHOLD - discountedSubtotal)}</span> more for free shipping!
                </p>
              ) : (
                <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg px-3 py-2 font-medium">
                  🎉 You qualify for free shipping!
                </p>
              )}

              {/* Line items */}
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {memberDiscount > 0 && (
                  <div className="flex justify-between text-primary font-medium">
                    <span>Member Discount (15%)</span>
                    <span>-{fmt(memberDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0
                      ? <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                      : fmt(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (13% HST)</span>
                  <span>{fmt(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
              )}

              {/* Place order button */}
              {isLoaded && !isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Sign In to Place Order
                  </button>
                </SignInButton>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || !addressComplete}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Placing Order…</>
                  ) : (
                    "Place Order"
                  )}
                </button>
              )}

              <p className="text-xs text-center text-muted-foreground">
                Secure checkout · SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
