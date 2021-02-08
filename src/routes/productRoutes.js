const express = require("express");
const {
  getAllProducts,
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { checkProduct, cheapProducts } = require("../middlewares/product");

const productRouter = express.Router();

productRouter.param("id", (req, res, next, val) => {
  console.log("Testing param middleware");
  next();
});

productRouter.route("/").get(getAllProducts).post(checkProduct, addProduct);

productRouter
  .route("/:id")
  .get(getProduct)
  .delete(deleteProduct)
  .patch(updateProduct);

productRouter.route("/alias/cheapProducts").get(cheapProducts, getAllProducts);

module.exports = productRouter;
