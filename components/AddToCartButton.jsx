"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addToCart, selectItemInCart } from "@/lib/features/cart/cartSlice"
import { ShoppingCart, Check } from "lucide-react"

export default function AddToCartButton({ product }) {
  const dispatch = useAppDispatch()
  const inCart = useAppSelector(selectItemInCart(product.id))

  function handleAdd() {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        comparePrice: product.comparePrice,
        category: product.category,
      })
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock === 0}
      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {inCart ? (
        <>
          <Check className="h-4 w-4" />
          Added to Cart ({inCart.quantity})
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </>
      )}
    </button>
  )
}
