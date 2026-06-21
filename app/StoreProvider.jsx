"use client"

import { useRef, useEffect } from "react"
import { Provider } from "react-redux"
import { makeStore } from "@/lib/store"
import { initCart } from "@/lib/features/cart/cartSlice"

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    storeRef.current.dispatch(initCart())
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
