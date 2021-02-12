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

//indexes are very important to improve read performance

productSchema.index({ price: 1, stock: -1 }); //1 for ascending order   -1 for descending order

// productSchema.index({...},{unique:true})   //this allows to set the combination should be unique

// index reduces no. of documents to be examined, so performance increases
//indexes should be set to fields which are queried/accessed the most

//static methods always call on the Model
//query.explain() to get query performance statistics

productSchema.virtual("discount").get(function () {
  //discount will only appear in getresults, and not in Database
  return this.price * 0.1;
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
