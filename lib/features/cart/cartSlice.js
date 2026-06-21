import { createSlice } from "@reduxjs/toolkit"

function loadFromStorage() {
  try {
    const data = localStorage.getItem("cart")
    return data ? JSON.parse(data) : { items: [] }
  } catch {
    return { items: [] }
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem("cart", JSON.stringify(state))
  } catch {}
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    initCart(state) {
      const saved = loadFromStorage()
      state.items = saved.items
    },
    addToCart(state, action) {
      const incoming = action.payload
      const existing = state.items.find((i) => i.id === incoming.id)
      if (existing) {
        existing.quantity += incoming.quantity ?? 1
      } else {
        state.items.push({ ...incoming, quantity: incoming.quantity ?? 1 })
      }
      saveToStorage(state)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
      saveToStorage(state)
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find((i) => i.id === id)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id)
        } else {
          item.quantity = quantity
        }
      }
      saveToStorage(state)
    },
    clearCart(state) {
      state.items = []
      saveToStorage(state)
    },
  },
})

export const { initCart, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
export const selectItemInCart = (id) => (state) =>
  state.cart.items.find((i) => i.id === id)

export default cartSlice.reducer
