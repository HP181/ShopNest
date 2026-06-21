# ShopNest — AI-Powered E-Commerce Platform

A full-stack e-commerce application built with **Next.js 16**, **MongoDB Atlas**, and **OpenAI embeddings** — featuring AI-powered similar product recommendations using vector search.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | Clerk |
| State Management | Redux Toolkit |
| AI / Embeddings | OpenAI `text-embedding-3-small` |
| Vector Search | MongoDB Atlas Vector Search |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |

---

## Features

- **Product catalog** — 33 products across 6 categories (Smartphones, Laptops, Audio, Wearables, Cameras, Gaming)
- **AI Similar Products** — Each product page shows semantically similar items powered by OpenAI embeddings + MongoDB Atlas Vector Search
- **Authentication** — Sign up / sign in via Clerk with protected routes
- **Shopping cart** — Redux-managed cart with add/remove/quantity controls
- **Checkout & Orders** — Full order flow with membership discounts (ShopNest Plus / Business)
- **Membership pricing** — 15% discount for Plus/Business plan members
- **Responsive UI** — Mobile-first design with dark mode support

---

## Project Structure

```
ecommerce/
├── app/
│   ├── api/
│   │   ├── categories/          # Category listing + products by category
│   │   ├── orders/              # Order creation + history
│   │   └── products/
│   │       └── [slug]/
│   │           └── similar/     # Vector search endpoint
│   ├── categories/              # Category browse pages
│   ├── checkout/                # Checkout flow
│   ├── orders/                  # Order history
│   ├── products/[slug]/         # Product detail page with similar items
│   ├── sign-in/ sign-up/        # Clerk auth pages
│   └── pricing/                 # Membership plans
├── components/                  # Shared UI components
├── lib/
│   ├── db.js                    # MongoDB connection (cached)
│   └── models/
│       ├── Product.js           # Product schema (+ embedding field)
│       ├── Category.js
│       ├── User.js              # Clerk-synced user model
│       ├── Cart.js
│       └── Order.js
└── scripts/
    ├── seed.mjs                 # Seed DB + generate OpenAI embeddings
    └── test-vector.mjs          # Vector search diagnostic tool
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# OpenAI (for embeddings)
OPENAI_API_KEY=sk-proj-...
```

### 3. Seed the database

This seeds 6 categories, 33 products, and generates a 1536-dimensional OpenAI embedding for each product:

```bash
node --env-file=.env.local scripts/seed.mjs
```

### 4. Set up MongoDB Atlas Vector Search index

After seeding, create the vector search index in Atlas:

1. Go to your Atlas cluster → **Atlas Search** tab
2. Click **Create Index** → choose **Atlas Vector Search** (not "Atlas Search")
3. Select database and collection: `<dbname>` / `products`
4. Set index name to `product_vector_index` and paste:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

5. Click **Create Search Index** and wait for status **Active** (~1–2 min)

> **Important:** Always create the index **after** seeding data. If you reseed, delete and recreate the index to avoid stale results.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How Vector Search Works

```
Product page visited
       │
       ▼
Fetch current product + its 1536-dim embedding from MongoDB
       │
       ▼
$vectorSearch aggregation on Atlas
  index: "product_vector_index"
  similarity: cosine
  numCandidates: 50 → limit: 5
       │
       ▼
Filter out current product + inactive products
       │
       ▼
Return top 4 similar products → render "Similar Products" grid
```

Each product's embedding is generated from:
```
"{name}. {description}. Tags: {tag1}, {tag2}, ..."
```

The `embedding` field uses `select: false` in Mongoose — it's never sent to the client and only loaded when explicitly needed for vector search.

---

## Diagnostic Tool

If similar products aren't showing, run the diagnostic script to test all likely index names:

```bash
node --env-file=.env.local scripts/test-vector.mjs
```

This checks:
- Whether the embedding is stored in MongoDB
- Which Atlas Vector Search index name is working
- Returns similarity scores for matched documents

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/categories` | List all active categories |
| GET | `/api/categories/[slug]/products` | Products in a category |
| GET | `/api/products/[slug]` | Single product by slug |
| GET | `/api/products/[slug]/similar` | Similar products via vector search |
| GET | `/api/orders` | Current user's orders (auth required) |
| POST | `/api/orders` | Create new order (auth required) |

---

## Data Models

### Product
```
name, slug, description, price, comparePrice
images[], category (ref), stock, sku, tags[]
ratings { average, count }, reviews[]
isFeatured, isActive, specs (Map)
embedding [Number] ← 1536-dim OpenAI vector (select: false)
```

### Order
```
user (ref), orderNumber, items[], subtotal
memberDiscount (15% for Plus/Business), tax (13%), shippingCost
paymentStatus, paymentMethod, status, shippingAddress
```

---

## Seeded Products (33 total)

| Category | Products |
|---|---|
| Smartphones | Galaxy S24 Ultra, iPhone 16 Pro, OnePlus 12R, Pixel 9, Xiaomi 14 Ultra, Galaxy S24+, Nothing Phone (2a) |
| Laptops | MacBook Air M3, Dell XPS 15, ROG Zephyrus G14, ThinkPad X1 Carbon, HP Spectre x360, Razer Blade 15 |
| Audio | Sony WH-1000XM5, AirPods Pro 2, JBL Charge 5, Bose QC45, Galaxy Buds 2 Pro, Sony SRS-XB43 |
| Wearables | Apple Watch S9, Galaxy Watch 6 Classic, Garmin Fenix 7 Pro, Fitbit Charge 6 |
| Cameras | Sony A7 IV, Canon EOS R50, Nikon Z6 III, Fujifilm X-T5 |
| Gaming | PS5 DualSense, Xbox Controller, Razer DeathAdder V3 Pro, Logitech G Pro X Superlight 2, Switch Pro Controller, SteelSeries Arctis Nova Pro |
