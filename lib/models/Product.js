import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
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
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, trim: true },
    tags: [{ type: String, lowercase: true }],
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

productSchema.index({ name: "text", description: "text", tags: "text" })
productSchema.index({ category: 1, isActive: 1 })
productSchema.index({ isFeatured: 1, isActive: 1 })

export default mongoose.models.Product || mongoose.model("Product", productSchema)
