import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, default: "IN" },
  isDefault: { type: Boolean, default: false },
})

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: { type: String, default: "" },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model("User", userSchema)
