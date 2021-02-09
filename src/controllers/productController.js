const Product = require("../models/productModel");
const catchAsync = require("../utils/asyncErrorCatcher");

exports.getAllProducts = catchAsync(async (req, res) => {
  let queryObj = { ...req.query };
  console.log(req.query);
  let excludeFields = ["page", "limit", "sort", "fields"];
  excludeFields.forEach((i) => delete queryObj[i]);

  //1.filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

  //build query
  let query = Product.find(JSON.parse(queryStr));

  //2.Sorting
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(req.query.sortBy); //query.sort('field1 field2') sorting sequence if field1 has tie
  }

  //3.field limiting
  if (req.query.limit) {
    let limit = req.query.limit.split(",").join(" ");
    query = query.select(limit);
  } else {
    query = query.select("-__v");
  }

  //4.Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 100 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    let prods = await Product.countDocuments();
    if (skip >= prods) throw new Error("Page does not exist");
  }
  //execute query
  const products = await query;

  res.status(200).send({ status: 200, data: products || [] });
});

exports.addProduct = catchAsync(async (req, res) => {
  const reqBody = req.body;

  const newProduct = await Product.create(reqBody);
  res.status(201).send({ status: 201, data: newProduct });

  res.status(500).send({ status: 500, message: `${err} error occured` });
});

exports.getProduct = catchAsync(async (req, res) => {
  let id = req.params.id;
  let product = await Product.findOne({ _id: id });
  if (!product) {
    res.status(404).send({ status: 404, message: "invalid id" });
  } else {
    res.status(200).send({ status: 200, data: [product] });
  }
});

exports.deleteProduct = catchAsync(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res
    .status(204)
    .send({ status: 204, message: "product deleted successfully" });
});

exports.updateProduct = catchAsync(async (req, res) => {
  let product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    res.status(404).send({ status: 404, message: "Invalid id" });
  }
  await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  const updatedProduct = await Product.findOne({ _id: req.params.id });
  res.status(200).send({ status: 200, data: [updatedProduct] });

  res.status(500).send({ status: 500, message: `${err} error occured` });
});
