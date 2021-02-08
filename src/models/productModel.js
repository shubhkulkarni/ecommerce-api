const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    category: {
      type: String,
      required: [true, "category is required"],
      default: "general",
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    rating: {
      type: Number,
    },
    brand: {
      type: String,
    },
    stock: { type: Number, required: [true, "stock is required"] },
    colors: {
      type: [String],
      enum: ["red", "yellow", "black", "white"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
