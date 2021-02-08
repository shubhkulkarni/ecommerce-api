const { findById } = require("../models/productModel");
const Product = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send({ status: 200, data: products || [] });
  } catch (err) {
    res.status(500).send(`${err} error occured`);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const reqBody = req.body;

    const newProduct = await Product.create(reqBody);
    res.status(201).send({ status: 201, data: newProduct });
  } catch (err) {
    res.status(500).send(`${err} error occured`);
  }
};

exports.getProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Product.findOne({ _id: id });
    if (!product) {
      res.status(404).send({ status: 404, message: "invalid id" });
    } else {
      res.status(200).send({ status: 200, data: [product] });
    }
  } catch (err) {
    res.status(500).send(`${err} error occured`);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res
      .status(204)
      .send({ status: 204, message: "product deleted successfully" });
  } catch (err) {
    res.status(500).send(`${err} error occured`);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      res.status(404).send({ status: 404, message: "Invalid id" });
    }
    await Product.findByIdAndUpdate(req.params.id, req.body);
    const updatedProduct = await Product.findOne({ _id: req.params.id });
    res.status(200).send({ status: 200, data: [updatedProduct] });
  } catch (err) {
    res.status(500).send(`${err} error occured`);
  }
};
