import { Zap } from "lucide-react"
import { PricingTable } from "@clerk/nextjs"

const faqs = [
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. You can cancel Plus or Business at any time from your account settings. Your benefits continue until the end of the billing period.",
  },
  {
    q: "Is the Plus plan for one account only?",
    a: "Yes, ShopNest Plus covers a single account. For team usage, Business plans support multiple users under one billing account.",
  },
  {
    q: "What payment methods are accepted for subscriptions?",
    a: "We accept credit/debit cards. All transactions are secured and processed via Clerk Billing.",
  },
  {
    q: "Do I get a refund if I'm not satisfied?",
    a: "Absolutely. If you're not happy within the first 30 days, write to us and we'll issue a full refund — no questions asked.",
  },
  {
    q: "Does the Plus plan include a free trial?",
    a: "Yes! ShopNest Plus includes a 7-day free trial so you can experience express delivery and member discounts before committing.",
  },
]

export const metadata = {
  title: "Pricing — ShopNest",
  description: "Choose a plan and unlock express delivery, member discounts, and more.",
}

export default function PricingPage() {
  return (
    <main className="flex-1">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-16 px-4 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
          <Zap className="h-3 w-3" /> Simple Pricing
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Plans for every shopper
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Start free. Upgrade when you need faster delivery, exclusive deals, and priority support.
          Plus members save 15% on every order at checkout.
        </p>
      </section>

      {/* Clerk PricingTable */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <PricingTable
          highlightedPlan="shopnest_plus"
          newSubscriptionRedirectUrl="/checkout"
          for="user"
        />
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-card rounded-xl border p-5">
                <p className="font-semibold mb-2">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
