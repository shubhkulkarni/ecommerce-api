const express = require("express");
const {
  getAllProducts,
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(addProduct);

productRouter
  .route("/:id")
  .get(getProduct)
  .delete(deleteProduct)
  .patch(updateProduct);

module.exports = productRouter;
