const express = require("express");
const {
  getAllProducts,
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  addToCart,
  removeFromCart,
} = require("../controllers/productController");
const { checkProduct, cheapProducts } = require("../middlewares/product");
const { protect, authorizeTo } = require("../middlewares/userAuth");

const productRouter = express.Router();

productRouter.param("id", (req, res, next, val) => {
  console.log("Testing param middleware");
  next();
});

productRouter
  .route("/")
  .get(protect, getAllProducts)
  .post(checkProduct, protect, authorizeTo("admin", "seller"), addProduct);

productRouter
  .route("/:id")
  .get(protect, getProduct)
  .delete(protect, authorizeTo("admin"), deleteProduct)
  .patch(protect, authorizeTo("admin", "seller"), updateProduct);

productRouter
  .route("/alias/cheapProducts")
  .get(protect, cheapProducts, getAllProducts);

productRouter
  .route("/cart/:id")
  .get(protect, addToCart)
  .delete(protect, removeFromCart);

module.exports = productRouter;
