const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      minLength: 2,
    },
    category: {
      type: String,
      required: [true, "category is required"],
      default: "general",
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: 0,
    },
    rating: {
      type: Number,
      max: 5,
      min: 0,
    },
    brand: {
      type: String,
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
      min: 0,
      select: false,
    },
    colors: {
      type: [String],
      enum: ["red", "yellow", "black", "white"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("discount").get(function () {
  return this.price * 0.1;
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
