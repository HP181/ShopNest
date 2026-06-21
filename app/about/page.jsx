import { ShieldCheck, Zap, Heart, Globe } from "lucide-react"

const team = [
  { name: "Arjun Mehta", role: "Founder & CEO", avatar: "https://placehold.co/100x100/6366f1/ffffff?text=AM" },
  { name: "Priya Sharma", role: "Head of Products", avatar: "https://placehold.co/100x100/8b5cf6/ffffff?text=PS" },
  { name: "Rohan Patel", role: "Lead Engineer", avatar: "https://placehold.co/100x100/a78bfa/ffffff?text=RP" },
  { name: "Sneha Joshi", role: "Customer Experience", avatar: "https://placehold.co/100x100/7c3aed/ffffff?text=SJ" },
]

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Quality",
    desc: "Every product on ShopNest is hand-verified for authenticity. We partner only with certified brands and authorized distributors.",
  },
  {
    icon: Zap,
    title: "Speed & Reliability",
    desc: "From order placement to doorstep delivery — we obsess over every minute. Most orders ship within 24 hours.",
  },
  {
    icon: Heart,
    title: "Customer First",
    desc: "Our 30-day return policy and 24/7 support aren't perks — they're our promise. Your satisfaction is our product.",
  },
  {
    icon: Globe,
    title: "Built for India",
    desc: "Prices in INR, EMI options, COD support, and regional-language help. We're built for every Indian shopper.",
  },
]

const stats = [
  { value: "2.4L+", label: "Happy Customers" },
  { value: "12,000+", label: "Products Listed" },
  { value: "48h", label: "Avg. Delivery Time" },
  { value: "4.8★", label: "Average Rating" },
]

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            We believe great tech should be{" "}
            <span className="text-primary">accessible to all</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            ShopNest was founded in 2021 with a simple mission: bring India's shoppers
            the best electronics at honest prices, with service that actually cares.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-primary">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            It started in a small apartment in Ahmedabad. Arjun Mehta, frustrated by
            overpriced electronics and unreliable sellers online, decided to build something
            better. He wanted a place where a first-time buyer and a seasoned tech enthusiast
            could both shop with complete confidence.
          </p>
          <p>
            ShopNest launched in January 2021 with just 200 SKUs and a team of three. Within
            six months, we had served 10,000 customers and expanded to every major category —
            from smartphones and laptops to cameras, audio, and gaming gear.
          </p>
          <p>
            Today, we're a team of 40+ people spread across Ahmedabad, Bengaluru, and Mumbai,
            with a catalogue of 12,000+ products from over 150 brands. But our obsession
            hasn't changed: make every order feel like it was packed with care, and every
            customer feel like they got the best deal possible.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 border-y py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 bg-card rounded-xl border p-6">
                <div className="shrink-0 p-2 rounded-lg bg-primary/10 h-fit">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map(({ name, role, avatar }) => (
            <div key={name} className="flex flex-col items-center text-center gap-3">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
