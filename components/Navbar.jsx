"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useTheme } from "next-themes"
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import { Switch } from "@/components/ui/switch"
import { Menu, X, ShoppingBag, ShoppingCart } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"
import { selectCartCount } from "@/lib/features/cart/cartSlice"

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
]

const authLinks = [
  { href: "/checkout", label: "Checkout" },
  { href: "/orders", label: "Orders" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const cartCount = useAppSelector(selectCartCount)

  const isDark = resolvedTheme === "dark"

  function NavLinks({ onClick }) {
    return (
      <>
        {publicLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === href ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
        <Show when="signed-in">
          {authLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </Show>
      </>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <ShoppingBag className="h-5 w-5" />
          ShopNest
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {isDark ? "Dark" : "Light"}
            </span>
            <Switch
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle theme"
            />
          </div>

          {/* Cart icon */}
          <Link
            href="/checkout"
            className="relative p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span
                className="absolute flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: "#ef4444", top: "-6px", right: "-6px", minWidth: "15px", height: "15px", borderRadius: "9999px", padding: "0 4px" }}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth controls (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton afterSignOutUrl="/" />
            </Show>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 rounded-md hover:bg-muted transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 pb-4 pt-2 flex flex-col gap-3">
          <nav className="flex flex-col gap-3">
            <NavLinks onClick={() => setOpen(false)} />
          </nav>
          <div className="flex items-center gap-2 pt-2 border-t">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton afterSignOutUrl="/" />
            </Show>
          </div>
        </div>
      )}
    </header>
  )
}
