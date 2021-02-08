const express = require("express");
const {
  getAllProducts,
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { checkProduct } = require("../middlewares/product");

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

module.exports = productRouter;
