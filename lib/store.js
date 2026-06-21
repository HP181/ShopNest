import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "@/lib/features/cart/cartSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
  })
}
