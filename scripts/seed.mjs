import mongoose from "mongoose"
import OpenAI from "openai"

// ── Models ────────────────────────────────────────────────────────────────────

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
)

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: null },
    images: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, default: 0 },
    sku: String,
    tags: [String],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    specs: { type: Map, of: String },
    embedding: { type: [Number], select: false },
  },
  { timestamps: true }
)

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema)
const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

// ── Seed data (all prices in CAD) ─────────────────────────────────────────────

const categories = [
  {
    name: "Smartphones",
    slug: "smartphones",
    description: "Latest flagship and budget smartphones from top brands.",
    image: "https://placehold.co/800x400/6366f1/ffffff?text=Smartphones",
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "Ultrabooks, gaming laptops, and workstations for every need.",
    image: "https://placehold.co/800x400/8b5cf6/ffffff?text=Laptops",
  },
  {
    name: "Audio",
    slug: "audio",
    description: "Headphones, earbuds, and speakers for audiophiles and casual listeners.",
    image: "https://placehold.co/800x400/a78bfa/ffffff?text=Audio",
  },
  {
    name: "Wearables",
    slug: "wearables",
    description: "Smartwatches and fitness trackers to keep you connected and healthy.",
    image: "https://placehold.co/800x400/7c3aed/ffffff?text=Wearables",
  },
  {
    name: "Cameras",
    slug: "cameras",
    description: "DSLRs, mirrorless cameras, and action cams for every photographer.",
    image: "https://placehold.co/800x400/5b21b6/ffffff?text=Cameras",
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Consoles, controllers, and gaming accessories for every gamer.",
    image: "https://placehold.co/800x400/4c1d95/ffffff?text=Gaming",
  },
]

function makeProducts(catMap) {
  return [
    // ── Smartphones ──────────────────────────────────────────────────────────
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "galaxy-s24-ultra",
      description:
        "The Galaxy S24 Ultra redefines smartphone performance with its integrated S Pen, 200MP camera system, and the powerful Snapdragon 8 Gen 3 processor. Built for creators and professionals alike.",
      price: 1699.99,
      comparePrice: 1849.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=Galaxy+S24+Ultra"],
      category: catMap["smartphones"],
      stock: 14,
      sku: "SAM-S24U-512",
      tags: ["android", "5g", "ai", "s-pen", "flagship"],
      ratings: { average: 4.7, count: 819 },
      isFeatured: true,
      specs: new Map([
        ["Display", "6.8\" QHD+ Dynamic AMOLED 2X, 120Hz"],
        ["Processor", "Snapdragon 8 Gen 3"],
        ["RAM", "12 GB"],
        ["Storage", "512 GB"],
        ["Camera", "200MP + 12MP + 10MP + 10MP"],
        ["Battery", "5000 mAh, 45W fast charging"],
        ["OS", "Android 14, One UI 6.1"],
      ]),
    },
    {
      name: "Apple iPhone 16 Pro",
      slug: "iphone-16-pro",
      description:
        "iPhone 16 Pro features the A18 Pro chip, a 48MP Fusion camera with 5x optical zoom, and a stunning 6.3\" Super Retina XDR ProMotion display. The most powerful iPhone ever built.",
      price: 1549.99,
      comparePrice: 1699.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=iPhone+16+Pro"],
      category: catMap["smartphones"],
      stock: 9,
      sku: "APL-IP16P-256",
      tags: ["ios", "5g", "a18-pro", "flagship", "camera"],
      ratings: { average: 4.9, count: 1423 },
      isFeatured: true,
      specs: new Map([
        ["Display", "6.3\" Super Retina XDR ProMotion, 120Hz"],
        ["Processor", "A18 Pro"],
        ["RAM", "8 GB"],
        ["Storage", "256 GB"],
        ["Camera", "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto"],
        ["Battery", "3582 mAh, USB-C fast charging"],
        ["OS", "iOS 18"],
      ]),
    },
    {
      name: "OnePlus 12R",
      slug: "oneplus-12r",
      description:
        "A performance beast at a mid-range price. The OnePlus 12R packs Snapdragon 8 Gen 2, a 50MP triple camera, and 100W SUPERVOOC charging into a sleek design.",
      price: 549.99,
      comparePrice: 649.99,
      images: ["https://placehold.co/600x600/a78bfa/ffffff?text=OnePlus+12R"],
      category: catMap["smartphones"],
      stock: 31,
      sku: "OP-12R-256",
      tags: ["android", "5g", "snapdragon", "fast-charging"],
      ratings: { average: 4.5, count: 611 },
      isFeatured: false,
      specs: new Map([
        ["Display", "6.78\" LTPO AMOLED, 120Hz"],
        ["Processor", "Snapdragon 8 Gen 2"],
        ["RAM", "16 GB"],
        ["Storage", "256 GB"],
        ["Camera", "50MP + 8MP + 2MP"],
        ["Battery", "5500 mAh, 100W SUPERVOOC"],
        ["OS", "Android 14, OxygenOS 14"],
      ]),
    },
    {
      name: "Google Pixel 9",
      slug: "google-pixel-9",
      description:
        "Pure Android. Pure Google. The Pixel 9 brings Google's Tensor G4 chip, best-in-class computational photography, and 7 years of OS updates.",
      price: 999.99,
      comparePrice: 1099.99,
      images: ["https://placehold.co/600x600/7c3aed/ffffff?text=Pixel+9"],
      category: catMap["smartphones"],
      stock: 21,
      sku: "GOO-PIX9-128",
      tags: ["android", "ai", "google", "camera", "pure-android"],
      ratings: { average: 4.6, count: 407 },
      isFeatured: false,
      specs: new Map([
        ["Display", "6.3\" Actua OLED, 120Hz"],
        ["Processor", "Google Tensor G4"],
        ["RAM", "12 GB"],
        ["Storage", "128 GB"],
        ["Camera", "50MP + 48MP Ultra Wide"],
        ["Battery", "4700 mAh, 27W wired"],
        ["OS", "Android 15"],
      ]),
    },
    {
      name: "Xiaomi 14 Ultra",
      slug: "xiaomi-14-ultra",
      description:
        "Co-engineered with Leica, the Xiaomi 14 Ultra is a photography powerhouse featuring a 1-inch Sony LYT-900 sensor, four Leica Summilux lenses, and the Snapdragon 8 Gen 3 processor. A true flagship rival.",
      price: 1399.99,
      comparePrice: 1549.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=Xiaomi+14+Ultra"],
      category: catMap["smartphones"],
      stock: 10,
      sku: "XMI-14U-512",
      tags: ["android", "5g", "leica", "flagship", "camera"],
      ratings: { average: 4.7, count: 534 },
      isFeatured: false,
      specs: new Map([
        ["Display", "6.73\" LTPO AMOLED, 120Hz, 3200×1440"],
        ["Processor", "Snapdragon 8 Gen 3"],
        ["RAM", "16 GB LPDDR5X"],
        ["Storage", "512 GB UFS 4.0"],
        ["Camera", "50MP 1\" + 50MP Ultra Wide + 50MP 3.2x + 50MP 5x Leica Summilux"],
        ["Battery", "5000 mAh, 90W wired, 80W wireless"],
        ["OS", "Android 14, HyperOS"],
      ]),
    },
    {
      name: "Samsung Galaxy S24+",
      slug: "galaxy-s24-plus",
      description:
        "The Galaxy S24+ delivers a flagship experience in a large 6.7\" form factor. Powered by Snapdragon 8 Gen 3, Galaxy AI features, and a triple camera system with 50MP main sensor.",
      price: 1299.99,
      comparePrice: 1449.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=Galaxy+S24%2B"],
      category: catMap["smartphones"],
      stock: 18,
      sku: "SAM-S24P-256",
      tags: ["android", "5g", "ai", "flagship", "samsung"],
      ratings: { average: 4.6, count: 612 },
      isFeatured: false,
      specs: new Map([
        ["Display", "6.7\" QHD+ Dynamic AMOLED 2X, 120Hz"],
        ["Processor", "Snapdragon 8 Gen 3"],
        ["RAM", "12 GB"],
        ["Storage", "256 GB"],
        ["Camera", "50MP + 12MP Ultra Wide + 10MP 3x Telephoto"],
        ["Battery", "4900 mAh, 45W fast charging"],
        ["OS", "Android 14, One UI 6.1"],
      ]),
    },
    {
      name: "Nothing Phone (2a)",
      slug: "nothing-phone-2a",
      description:
        "Nothing Phone (2a) brings the iconic Glyph Interface to a mid-range price point. Powered by Dimensity 7200 Pro, a clean Nothing OS experience, and a unique transparent back design.",
      price: 429.99,
      comparePrice: 499.99,
      images: ["https://placehold.co/600x600/a78bfa/ffffff?text=Nothing+Phone+2a"],
      category: catMap["smartphones"],
      stock: 35,
      sku: "NTH-P2A-256",
      tags: ["android", "5g", "glyph", "mid-range", "unique-design"],
      ratings: { average: 4.4, count: 289 },
      isFeatured: false,
      specs: new Map([
        ["Display", "6.7\" AMOLED, 120Hz, 1080×2412"],
        ["Processor", "MediaTek Dimensity 7200 Pro"],
        ["RAM", "12 GB"],
        ["Storage", "256 GB"],
        ["Camera", "50MP + 50MP Ultra Wide"],
        ["Battery", "5000 mAh, 45W fast charging"],
        ["OS", "Android 14, Nothing OS 2.5"],
      ]),
    },

    // ── Laptops ──────────────────────────────────────────────────────────────
    {
      name: "MacBook Air M3 13\"",
      slug: "macbook-air-m3-13",
      description:
        "Impossibly thin. Incredibly powerful. MacBook Air with M3 chip features up to 18 hours of battery life, a stunning Liquid Retina display, and fanless silent design.",
      price: 1499.99,
      comparePrice: 1649.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=MacBook+Air+M3"],
      category: catMap["laptops"],
      stock: 8,
      sku: "APL-MBA-M3-8-256",
      tags: ["apple", "m3", "lightweight", "fanless", "macos"],
      ratings: { average: 4.9, count: 1204 },
      isFeatured: true,
      specs: new Map([
        ["Processor", "Apple M3 (8-core CPU, 10-core GPU)"],
        ["RAM", "8 GB unified memory"],
        ["Storage", "256 GB SSD"],
        ["Display", "13.6\" Liquid Retina, 2560×1664, 500 nits"],
        ["Battery", "Up to 18 hours"],
        ["Weight", "1.24 kg"],
        ["Ports", "2× USB-C (Thunderbolt 3), MagSafe 3, 3.5mm"],
      ]),
    },
    {
      name: "Dell XPS 15 (2024)",
      slug: "dell-xps-15-2024",
      description:
        "The Dell XPS 15 2024 combines Intel Core Ultra 7, NVIDIA GeForce RTX 4060, and a gorgeous 3.5K OLED display for creators who demand performance without compromise.",
      price: 2199.99,
      comparePrice: 2449.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=Dell+XPS+15"],
      category: catMap["laptops"],
      stock: 5,
      sku: "DELL-XPS15-7-RTX",
      tags: ["windows", "intel", "nvidia", "oled", "creator"],
      ratings: { average: 4.7, count: 342 },
      isFeatured: true,
      specs: new Map([
        ["Processor", "Intel Core Ultra 7 155H"],
        ["GPU", "NVIDIA GeForce RTX 4060 8GB"],
        ["RAM", "32 GB DDR5"],
        ["Storage", "1 TB NVMe SSD"],
        ["Display", "15.6\" 3.5K OLED, 120Hz"],
        ["Battery", "86 Whr, 130W adapter"],
        ["Weight", "1.86 kg"],
      ]),
    },
    {
      name: "ASUS ROG Zephyrus G14",
      slug: "asus-rog-zephyrus-g14",
      description:
        "Compact gaming powerhouse. The ROG Zephyrus G14 packs AMD Ryzen 9 8945HS and RTX 4070 into a 14\" chassis, making it the go-to choice for gamers on the move.",
      price: 2099.99,
      comparePrice: 2299.99,
      images: ["https://placehold.co/600x600/a78bfa/ffffff?text=ROG+G14"],
      category: catMap["laptops"],
      stock: 7,
      sku: "ASUS-G14-9-4070",
      tags: ["gaming", "amd", "nvidia", "compact", "rog"],
      ratings: { average: 4.8, count: 578 },
      isFeatured: false,
      specs: new Map([
        ["Processor", "AMD Ryzen 9 8945HS"],
        ["GPU", "NVIDIA GeForce RTX 4070 8GB"],
        ["RAM", "16 GB DDR5"],
        ["Storage", "1 TB PCIe 4.0 SSD"],
        ["Display", "14\" QHD+ 165Hz, 100% DCI-P3"],
        ["Battery", "73 Whr, up to 10 hours"],
        ["Weight", "1.65 kg"],
      ]),
    },
    {
      name: "Lenovo ThinkPad X1 Carbon Gen 12",
      slug: "thinkpad-x1-carbon-gen12",
      description:
        "The business ultrabook benchmark. ThinkPad X1 Carbon Gen 12 offers Intel Core Ultra 7, military-grade durability, an IPS anti-glare display, and legendary ThinkPad keyboard — all under 1.12 kg.",
      price: 1899.99,
      comparePrice: 2099.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=ThinkPad+X1"],
      category: catMap["laptops"],
      stock: 6,
      sku: "LNV-X1C-G12-16",
      tags: ["business", "ultrabook", "lightweight", "intel", "thinkpad"],
      ratings: { average: 4.8, count: 421 },
      isFeatured: false,
      specs: new Map([
        ["Processor", "Intel Core Ultra 7 165U"],
        ["RAM", "16 GB LPDDR5x"],
        ["Storage", "512 GB NVMe SSD"],
        ["Display", "14\" 2.8K IPS Anti-glare, 120Hz"],
        ["Battery", "57 Whr, up to 15 hours"],
        ["Weight", "1.12 kg"],
        ["Ports", "2× Thunderbolt 4, 2× USB-A, HDMI 2.1, 3.5mm"],
      ]),
    },
    {
      name: "HP Spectre x360 14\"",
      slug: "hp-spectre-x360-14",
      description:
        "The HP Spectre x360 14 is a premium 2-in-1 convertible with Intel Core Ultra 7, OLED touch display, and a gem-cut design. Versatile for work and creativity, it folds flat for tablet-mode use.",
      price: 1749.99,
      comparePrice: 1949.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=Spectre+x360"],
      category: catMap["laptops"],
      stock: 9,
      sku: "HP-SPX360-14-U7",
      tags: ["2-in-1", "convertible", "oled", "intel", "touch"],
      ratings: { average: 4.6, count: 318 },
      isFeatured: false,
      specs: new Map([
        ["Processor", "Intel Core Ultra 7 155H"],
        ["RAM", "16 GB LPDDR5x"],
        ["Storage", "1 TB PCIe NVMe SSD"],
        ["Display", "14\" 2.8K OLED Touch, 120Hz, 100% DCI-P3"],
        ["Battery", "66 Whr, up to 17 hours"],
        ["Weight", "1.41 kg"],
        ["Ports", "2× Thunderbolt 4, USB-A, microSD, 3.5mm"],
      ]),
    },
    {
      name: "Razer Blade 15 (2024)",
      slug: "razer-blade-15-2024",
      description:
        "The Razer Blade 15 is the world's most popular gaming laptop. RTX 4070, Intel Core i9, and a QHD 240Hz display in a sleek CNC aluminum chassis that's as powerful as it is portable.",
      price: 2799.99,
      comparePrice: 2999.99,
      images: ["https://placehold.co/600x600/7c3aed/ffffff?text=Razer+Blade+15"],
      category: catMap["laptops"],
      stock: 4,
      sku: "RZR-BL15-I9-4070",
      tags: ["gaming", "nvidia", "intel", "qhd", "razer"],
      ratings: { average: 4.7, count: 489 },
      isFeatured: false,
      specs: new Map([
        ["Processor", "Intel Core i9-14900HX"],
        ["GPU", "NVIDIA GeForce RTX 4070 8GB"],
        ["RAM", "16 GB DDR5"],
        ["Storage", "1 TB PCIe Gen 5 NVMe SSD"],
        ["Display", "15.6\" QHD 240Hz, 100% DCI-P3"],
        ["Battery", "80 Whr, 230W adapter"],
        ["Weight", "2.01 kg"],
      ]),
    },

    // ── Audio ────────────────────────────────────────────────────────────────
    {
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      description:
        "Industry-leading noise cancelling with Auto NC Optimizer, up to 30 hours battery, and multipoint connection for two devices simultaneously. The gold standard in wireless headphones.",
      price: 399.99,
      comparePrice: 449.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=Sony+XM5"],
      category: catMap["audio"],
      stock: 23,
      sku: "SONY-WH1000XM5-BLK",
      tags: ["wireless", "anc", "over-ear", "sony", "30hr-battery"],
      ratings: { average: 4.8, count: 2134 },
      isFeatured: true,
      specs: new Map([
        ["Driver", "30mm"],
        ["Frequency Response", "4Hz – 40kHz"],
        ["Battery", "30 hours (ANC on), 40 hours (ANC off)"],
        ["Charging", "USB-C, 3-min quick charge = 3 hours playback"],
        ["Connectivity", "Bluetooth 5.2, Multipoint"],
        ["Weight", "250 g"],
        ["Noise Cancellation", "Dual Noise Sensor, Auto NC Optimizer"],
      ]),
    },
    {
      name: "Apple AirPods Pro (2nd Gen)",
      slug: "airpods-pro-2nd-gen",
      description:
        "AirPods Pro with H2 chip deliver up to 2× more Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio for an immersive listening experience.",
      price: 329.99,
      comparePrice: 379.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=AirPods+Pro"],
      category: catMap["audio"],
      stock: 41,
      sku: "APL-APP2-USB",
      tags: ["wireless", "anc", "in-ear", "apple", "spatial-audio"],
      ratings: { average: 4.7, count: 3812 },
      isFeatured: false,
      specs: new Map([
        ["Chip", "Apple H2"],
        ["ANC", "Up to 2× previous generation"],
        ["Battery", "6 hrs (ANC on) + 24 hrs with case"],
        ["Charging", "USB-C / MagSafe"],
        ["Connectivity", "Bluetooth 5.3"],
        ["Water Resistance", "IPX4 (earbuds + case)"],
      ]),
    },
    {
      name: "JBL Charge 5",
      slug: "jbl-charge-5",
      description:
        "Take the party anywhere. The JBL Charge 5 delivers powerful JBL Pro Sound, 20 hours playtime, IP67 waterproofing, and a built-in powerbank to charge your devices.",
      price: 199.99,
      comparePrice: 249.99,
      images: ["https://placehold.co/600x600/a78bfa/ffffff?text=JBL+Charge+5"],
      category: catMap["audio"],
      stock: 55,
      sku: "JBL-CHG5-BLK",
      tags: ["bluetooth-speaker", "waterproof", "powerbank", "jbl", "outdoor"],
      ratings: { average: 4.6, count: 1567 },
      isFeatured: false,
      specs: new Map([
        ["Output Power", "40W RMS"],
        ["Battery", "20 hours playtime"],
        ["Water/Dust", "IP67"],
        ["Charging", "USB-C, also charges other devices"],
        ["Connectivity", "Bluetooth 5.1, PartyBoost"],
        ["Weight", "960 g"],
      ]),
    },
    {
      name: "Bose QuietComfort 45",
      slug: "bose-quietcomfort-45",
      description:
        "The Bose QuietComfort 45 sets the standard for noise cancelling comfort. World-class ANC, 24-hour battery life, and plush ear cushions make it the go-to choice for long flights and focused work.",
      price: 349.99,
      comparePrice: 429.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=Bose+QC45"],
      category: catMap["audio"],
      stock: 27,
      sku: "BOSE-QC45-WHT",
      tags: ["wireless", "anc", "over-ear", "bose", "noise-cancelling"],
      ratings: { average: 4.7, count: 1843 },
      isFeatured: false,
      specs: new Map([
        ["Driver", "40mm TriPort acoustic architecture"],
        ["Frequency Response", "20Hz – 20kHz"],
        ["Battery", "24 hours (ANC on)"],
        ["Charging", "USB-C, 15-min quick charge = 3 hours"],
        ["Connectivity", "Bluetooth 5.1, Multipoint (2 devices)"],
        ["Weight", "238 g"],
        ["Noise Cancellation", "Proprietary Bose ANC with Aware Mode"],
      ]),
    },
    {
      name: "Samsung Galaxy Buds 2 Pro",
      slug: "samsung-galaxy-buds-2-pro",
      description:
        "Galaxy Buds 2 Pro deliver 360 Audio, intelligent ANC, and Hi-Fi 24-bit sound in an ergonomic design. Seamlessly switch between Galaxy devices and enjoy crystal-clear voice calls.",
      price: 249.99,
      comparePrice: 299.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=Galaxy+Buds+2+Pro"],
      category: catMap["audio"],
      stock: 38,
      sku: "SAM-GBP2-BLK",
      tags: ["wireless", "anc", "in-ear", "samsung", "hi-fi"],
      ratings: { average: 4.5, count: 976 },
      isFeatured: false,
      specs: new Map([
        ["Driver", "10mm woofer + 5.3mm tweeter"],
        ["ANC", "Active Noise Cancellation with Voice Detect"],
        ["Battery", "5 hrs (ANC on) + 18 hrs with case"],
        ["Charging", "USB-C / Wireless"],
        ["Connectivity", "Bluetooth 5.3, AAC, Scalable Codec"],
        ["Water Resistance", "IPX7 (earbuds), IPX2 (case)"],
      ]),
    },
    {
      name: "Sony SRS-XB43",
      slug: "sony-srs-xb43",
      description:
        "Party starter. The Sony SRS-XB43 delivers Extra Bass sound, 24-hour battery, IP67 waterproofing, and a built-in light show. Perfect for outdoor gatherings and pool parties.",
      price: 179.99,
      comparePrice: 229.99,
      images: ["https://placehold.co/600x600/7c3aed/ffffff?text=Sony+SRS-XB43"],
      category: catMap["audio"],
      stock: 42,
      sku: "SONY-SRSXB43-BLK",
      tags: ["bluetooth-speaker", "waterproof", "extra-bass", "sony", "outdoor"],
      ratings: { average: 4.5, count: 1102 },
      isFeatured: false,
      specs: new Map([
        ["Output Power", "2× passive radiators + 2 tweeters"],
        ["Battery", "24 hours playtime"],
        ["Water/Dust", "IP67"],
        ["Charging", "USB-C"],
        ["Connectivity", "Bluetooth 5.0, Party Connect (up to 100 speakers)"],
        ["Weight", "1190 g"],
      ]),
    },

    // ── Wearables ────────────────────────────────────────────────────────────
    {
      name: "Apple Watch Series 9 (45mm)",
      slug: "apple-watch-series-9-45mm",
      description:
        "The most advanced Apple Watch yet. S9 chip powers the new Double Tap gesture, always-on Retina display is up to 2× brighter, and comprehensive health sensors keep you informed around the clock.",
      price: 579.99,
      comparePrice: 649.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=Watch+S9"],
      category: catMap["wearables"],
      stock: 18,
      sku: "APL-WS9-45-ALU",
      tags: ["smartwatch", "health", "gps", "apple", "ecg"],
      ratings: { average: 4.8, count: 921 },
      isFeatured: true,
      specs: new Map([
        ["Display", "45mm Always-On Retina LTPO OLED, 2000 nits"],
        ["Chip", "Apple S9 SiP"],
        ["Health Sensors", "ECG, Blood Oxygen, Temperature, Heart Rate"],
        ["GPS", "Precision dual-frequency L1/L5"],
        ["Battery", "Up to 18 hours"],
        ["Water Resistance", "50m"],
        ["Connectivity", "Bluetooth 5.3, Wi-Fi 4, UWB"],
      ]),
    },
    {
      name: "Samsung Galaxy Watch 6 Classic",
      slug: "galaxy-watch-6-classic",
      description:
        "The Galaxy Watch 6 Classic brings back the iconic rotating bezel with advanced health monitoring, including sleep coaching, body composition analysis, and fall detection.",
      price: 449.99,
      comparePrice: 529.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=GW6+Classic"],
      category: catMap["wearables"],
      stock: 14,
      sku: "SAM-GW6C-47",
      tags: ["smartwatch", "wear-os", "samsung", "rotating-bezel", "health"],
      ratings: { average: 4.5, count: 482 },
      isFeatured: false,
      specs: new Map([
        ["Display", "47mm Super AMOLED, 480×480, 2000 nits"],
        ["Processor", "Exynos W930"],
        ["RAM / Storage", "2 GB / 16 GB"],
        ["Health Sensors", "BioActive (HR, SpO2, ECG, Body Comp), Skin Temp"],
        ["Battery", "425 mAh, up to 40 hours"],
        ["Water Resistance", "5ATM + IP68"],
        ["OS", "Wear OS 4 with One UI Watch 5"],
      ]),
    },
    {
      name: "Garmin Fenix 7 Pro",
      slug: "garmin-fenix-7-pro",
      description:
        "Built for endurance athletes, the Garmin Fenix 7 Pro features solar charging, built-in LED flashlight, multi-band GPS, advanced health monitoring, and up to 22 days battery life. The ultimate adventure smartwatch.",
      price: 799.99,
      comparePrice: 899.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=Garmin+Fenix+7+Pro"],
      category: catMap["wearables"],
      stock: 12,
      sku: "GRM-FNX7P-BLK",
      tags: ["smartwatch", "gps", "outdoor", "fitness", "solar"],
      ratings: { average: 4.8, count: 634 },
      isFeatured: false,
      specs: new Map([
        ["Display", "1.3\" MIP 260×260, Solar lens"],
        ["GPS", "Multi-band GPS/GNSS (GPS, GLONASS, Galileo)"],
        ["Health Sensors", "Heart Rate, SpO2, Stress, Body Battery, HRV"],
        ["Battery", "Up to 22 days (smartwatch), 37 days (solar)"],
        ["Water Resistance", "100m"],
        ["Connectivity", "Bluetooth, ANT+, Wi-Fi"],
        ["Weight", "73 g (without strap)"],
      ]),
    },
    {
      name: "Fitbit Charge 6",
      slug: "fitbit-charge-6",
      description:
        "Fitbit Charge 6 is a health and fitness tracker powered by Google, featuring built-in GPS, ECG app, Google Maps, and Google Wallet. Track your heart rate, sleep, stress, and workouts all day.",
      price: 199.99,
      comparePrice: 239.99,
      images: ["https://placehold.co/600x600/a78bfa/ffffff?text=Fitbit+Charge+6"],
      category: catMap["wearables"],
      stock: 31,
      sku: "FIT-CHG6-BLK",
      tags: ["fitness-tracker", "gps", "ecg", "google", "health"],
      ratings: { average: 4.4, count: 891 },
      isFeatured: false,
      specs: new Map([
        ["Display", "1.04\" AMOLED, 450×172"],
        ["GPS", "Built-in GPS"],
        ["Health Sensors", "Heart Rate, ECG, SpO2, EDA (stress), Skin Temp"],
        ["Battery", "Up to 7 days"],
        ["Water Resistance", "50m"],
        ["Connectivity", "Bluetooth 5.0, NFC (Google Wallet)"],
        ["Weight", "22.9 g (without strap)"],
      ]),
    },

    // ── Cameras ──────────────────────────────────────────────────────────────
    {
      name: "Sony Alpha A7 IV",
      slug: "sony-alpha-a7-iv",
      description:
        "The Sony A7 IV sets a new standard for full-frame mirrorless photography. 33MP BSI-CMOS sensor, real-time tracking AF, and 4K 60fps video make it the ultimate hybrid camera for professionals.",
      price: 3299.99,
      comparePrice: 3599.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=Sony+A7+IV"],
      category: catMap["cameras"],
      stock: 4,
      sku: "SONY-ILCE7M4-BODY",
      tags: ["mirrorless", "full-frame", "4k", "sony", "professional"],
      ratings: { average: 4.9, count: 287 },
      isFeatured: true,
      specs: new Map([
        ["Sensor", "33MP Exmor R BSI Full-Frame CMOS"],
        ["ISO Range", "100–51200 (exp. 50–204800)"],
        ["Autofocus", "759 phase-detect + 425 contrast-detect"],
        ["Video", "4K 60fps, 10-bit 4:2:2 internally"],
        ["Stabilization", "5-axis IBIS, up to 5.5 stops"],
        ["Battery Life", "~610 shots (CIPA)"],
        ["Weather Sealing", "Yes (dust and moisture resistant)"],
      ]),
    },
    {
      name: "Canon EOS R50",
      slug: "canon-eos-r50",
      description:
        "Compact, lightweight, and packed with pro features. The EOS R50 is perfect for content creators and beginners stepping up to an interchangeable-lens camera with Dual Pixel CMOS AF.",
      price: 849.99,
      comparePrice: 999.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=Canon+R50"],
      category: catMap["cameras"],
      stock: 11,
      sku: "CAN-EOSR50-BODY",
      tags: ["mirrorless", "aps-c", "vlogging", "canon", "beginner"],
      ratings: { average: 4.6, count: 394 },
      isFeatured: false,
      specs: new Map([
        ["Sensor", "24.2MP APS-C CMOS"],
        ["Processor", "DIGIC X"],
        ["Autofocus", "Dual Pixel CMOS AF II, Subject Detection"],
        ["Video", "4K (oversampled from 6K), 30fps"],
        ["Stabilization", "Digital IS + lens IS"],
        ["Battery Life", "~390 shots (CIPA)"],
        ["Connectivity", "Wi-Fi 5GHz + Bluetooth"],
      ]),
    },
    {
      name: "Nikon Z6 III",
      slug: "nikon-z6-iii",
      description:
        "The Nikon Z6 III is a breakthrough full-frame mirrorless camera with a partially stacked 24.5MP sensor, 6K RAW video, 20fps burst shooting, and blackout-free EVF — a hybrid powerhouse for photographers and videographers.",
      price: 2999.99,
      comparePrice: 3299.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=Nikon+Z6+III"],
      category: catMap["cameras"],
      stock: 6,
      sku: "NIK-Z6III-BODY",
      tags: ["mirrorless", "full-frame", "4k", "nikon", "professional"],
      ratings: { average: 4.8, count: 201 },
      isFeatured: false,
      specs: new Map([
        ["Sensor", "24.5MP partially stacked CMOS Full-Frame"],
        ["ISO Range", "100–64000 (exp. 50–204800)"],
        ["Autofocus", "273-point phase-detect, subject recognition"],
        ["Video", "6K RAW 60fps, 4K 120fps"],
        ["Stabilization", "6-axis IBIS, up to 8 stops"],
        ["Battery Life", "~380 shots (CIPA)"],
        ["Weather Sealing", "Yes (dust and splash resistant)"],
      ]),
    },
    {
      name: "Fujifilm X-T5",
      slug: "fujifilm-x-t5",
      description:
        "The Fujifilm X-T5 packs a 40MP X-Trans BSI CMOS sensor and 7-stop IBIS into a compact retro body. With Fujifilm's legendary film simulations and 6.2K video, it's the ideal camera for travel and landscape photography.",
      price: 1999.99,
      comparePrice: 2199.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=Fujifilm+X-T5"],
      category: catMap["cameras"],
      stock: 8,
      sku: "FUJ-XT5-BODY",
      tags: ["mirrorless", "aps-c", "retro", "fujifilm", "high-resolution"],
      ratings: { average: 4.8, count: 312 },
      isFeatured: false,
      specs: new Map([
        ["Sensor", "40.2MP X-Trans BSI CMOS 5 HR (APS-C)"],
        ["ISO Range", "125–12800 (exp. 64–51200)"],
        ["Autofocus", "AI subject detection, 425 phase-detect points"],
        ["Video", "6.2K 30fps, 4K 60fps"],
        ["Stabilization", "7-stop IBIS"],
        ["Battery Life", "~740 shots (CIPA)"],
        ["Film Simulations", "20 classic Fujifilm film simulations"],
      ]),
    },

    // ── Gaming ───────────────────────────────────────────────────────────────
    {
      name: "PS5 DualSense Wireless Controller",
      slug: "ps5-dualsense-controller",
      description:
        "Feel the game like never before with haptic feedback and adaptive triggers that convey the feel of in-game actions. Includes a built-in mic and USB-C charging.",
      price: 89.99,
      comparePrice: 109.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=DualSense"],
      category: catMap["gaming"],
      stock: 48,
      sku: "SONY-DS-WHT",
      tags: ["ps5", "controller", "haptic", "adaptive-triggers", "wireless"],
      ratings: { average: 4.7, count: 2341 },
      isFeatured: true,
      specs: new Map([
        ["Connectivity", "Bluetooth 5.1, USB-C wired"],
        ["Battery", "Up to 12 hours"],
        ["Vibration", "Haptic feedback (dual actuators)"],
        ["Triggers", "Adaptive (L2/R2)"],
        ["Audio", "Built-in mic + 3.5mm headset jack"],
        ["Weight", "280 g"],
      ]),
    },
    {
      name: "Xbox Wireless Controller — Carbon Black",
      slug: "xbox-wireless-controller-carbon-black",
      description:
        "The Xbox Wireless Controller features a textured grip, Bluetooth for PC/mobile, USB-C charging, and is compatible with Xbox Series X|S, Xbox One, Windows PC, Android, and iOS.",
      price: 74.99,
      comparePrice: 84.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=Xbox+Controller"],
      category: catMap["gaming"],
      stock: 62,
      sku: "MS-XBWC-BLK",
      tags: ["xbox", "controller", "bluetooth", "pc", "cross-platform"],
      ratings: { average: 4.6, count: 1893 },
      isFeatured: false,
      specs: new Map([
        ["Connectivity", "Xbox Wireless, Bluetooth 4.2, USB-C wired"],
        ["Battery", "~40 hours (2× AA), rechargeable pack sold separately"],
        ["Compatibility", "Xbox Series X|S, Xbox One, PC, Android, iOS"],
        ["Rumble", "Dual rumble motors"],
        ["Weight", "287 g (with batteries)"],
      ]),
    },
    {
      name: "Razer DeathAdder V3 Pro",
      slug: "razer-deathadder-v3-pro",
      description:
        "Engineered for esports. The DeathAdder V3 Pro is the world's lightest wireless gaming mouse at 63g, with Focus Pro 30K optical sensor and up to 90 hours battery life.",
      price: 199.99,
      comparePrice: 239.99,
      images: ["https://placehold.co/600x600/a78bfa/ffffff?text=DeathAdder+V3+Pro"],
      category: catMap["gaming"],
      stock: 29,
      sku: "RZR-DAV3P-BLK",
      tags: ["gaming-mouse", "wireless", "razer", "esports", "lightweight"],
      ratings: { average: 4.8, count: 756 },
      isFeatured: false,
      specs: new Map([
        ["Sensor", "Razer Focus Pro 30K Optical"],
        ["DPI", "100 – 30,000 DPI"],
        ["Polling Rate", "4000Hz (with HyperPolling dongle)"],
        ["Clicks", "Razer HyperSpeed Wireless + Bluetooth"],
        ["Battery", "Up to 90 hours"],
        ["Weight", "63 g"],
      ]),
    },
    {
      name: "Logitech G Pro X Superlight 2",
      slug: "logitech-gpro-x-superlight-2",
      description:
        "The Logitech G Pro X Superlight 2 is the choice of esports champions. At just 60g with the HERO 2 25K sensor and 95-hour battery, it's the lightest and most precise wireless gaming mouse ever made.",
      price: 179.99,
      comparePrice: 219.99,
      images: ["https://placehold.co/600x600/6366f1/ffffff?text=Superlight+2"],
      category: catMap["gaming"],
      stock: 33,
      sku: "LOG-GPX-SL2-WHT",
      tags: ["gaming-mouse", "wireless", "logitech", "esports", "lightweight"],
      ratings: { average: 4.9, count: 1124 },
      isFeatured: false,
      specs: new Map([
        ["Sensor", "HERO 2 25K Optical"],
        ["DPI", "100 – 25,600 DPI"],
        ["Polling Rate", "2000Hz (with Lightspeed dongle)"],
        ["Connectivity", "Logitech Lightspeed Wireless"],
        ["Battery", "Up to 95 hours"],
        ["Weight", "60 g"],
      ]),
    },
    {
      name: "Nintendo Switch Pro Controller",
      slug: "nintendo-switch-pro-controller",
      description:
        "The Nintendo Switch Pro Controller offers a traditional controller layout with HD Rumble, motion controls, amiibo support, and 40+ hours battery life. Comfortable for long gaming sessions on Switch.",
      price: 89.99,
      comparePrice: 99.99,
      images: ["https://placehold.co/600x600/8b5cf6/ffffff?text=Switch+Pro"],
      category: catMap["gaming"],
      stock: 54,
      sku: "NIN-SWP-CTRL",
      tags: ["controller", "nintendo", "wireless", "hd-rumble", "motion-controls"],
      ratings: { average: 4.7, count: 3201 },
      isFeatured: false,
      specs: new Map([
        ["Connectivity", "Bluetooth + USB-C wired"],
        ["Battery", "Up to 40 hours"],
        ["Vibration", "HD Rumble"],
        ["Motion", "6-axis gyroscope + accelerometer"],
        ["NFC", "Yes (amiibo support)"],
        ["Weight", "246 g"],
      ]),
    },
    {
      name: "SteelSeries Arctis Nova Pro Wireless",
      slug: "steelseries-arctis-nova-pro-wireless",
      description:
        "The SteelSeries Arctis Nova Pro Wireless is the pinnacle of gaming audio. Active Noise Cancellation, hot-swappable dual batteries, multi-system connect for PC and console, and a high-fidelity speaker driver deliver unmatched immersion.",
      price: 349.99,
      comparePrice: 399.99,
      images: ["https://placehold.co/600x600/7c3aed/ffffff?text=Arctis+Nova+Pro"],
      category: catMap["gaming"],
      stock: 17,
      sku: "SS-ANPW-BLK",
      tags: ["gaming-headset", "wireless", "anc", "steelseries", "multi-system"],
      ratings: { average: 4.7, count: 892 },
      isFeatured: false,
      specs: new Map([
        ["Driver", "40mm High Fidelity"],
        ["Frequency Response", "10Hz – 40kHz"],
        ["ANC", "Active Noise Cancellation"],
        ["Battery", "Dual hot-swap batteries, 22 hrs each"],
        ["Connectivity", "2.4GHz Wireless + Bluetooth 5.0"],
        ["Platforms", "PC, PS5, PS4, Switch (USB-C), Mobile"],
        ["Weight", "338 g"],
      ]),
    },
  ]
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const uri = process.env.MONGO_URI
  const openaiKey = process.env.OPENAI_API_KEY
  if (!uri) {
    console.error("❌  MONGO_URI not found. Run: node --env-file=.env.local scripts/seed.mjs")
    process.exit(1)
  }
  if (!openaiKey) {
    console.error("❌  OPENAI_API_KEY not found. Run: node --env-file=.env.local scripts/seed.mjs")
    process.exit(1)
  }

  const openai = new OpenAI({ apiKey: openaiKey })

  console.log("🔌  Connecting to MongoDB…")
  await mongoose.connect(uri)
  console.log("✅  Connected\n")

  console.log("🗑️   Clearing existing categories and products…")
  await Product.deleteMany({})
  await Category.deleteMany({})

  console.log("📂  Seeding categories…")
  const inserted = await Category.insertMany(categories)
  const catMap = Object.fromEntries(inserted.map((c) => [c.slug, c._id]))
  inserted.forEach((c) => console.log(`   ✓ ${c.name}`))

  console.log("\n📦  Seeding products…")
  const products = makeProducts(catMap)
  const insertedProducts = await Product.insertMany(products)
  const fmt = (n) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n)
  insertedProducts.forEach((p) => console.log(`   ✓ ${p.name} — ${fmt(p.price)}`))

  console.log("\n🧠  Generating OpenAI embeddings (text-embedding-3-small)…")
  const texts = insertedProducts.map(
    (p) => `${p.name}. ${p.description}. Tags: ${p.tags.join(", ")}`
  )

  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  })

  const bulkOps = insertedProducts.map((p, i) => ({
    updateOne: {
      filter: { _id: p._id },
      update: { $set: { embedding: embeddingRes.data[i].embedding } },
    },
  }))

  await Product.bulkWrite(bulkOps)
  insertedProducts.forEach((p) => console.log(`   ✓ ${p.name} — embedding stored`))

  console.log(`\n🎉  Done! Seeded ${inserted.length} categories and ${insertedProducts.length} products with embeddings.`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message)
  process.exit(1)
})
