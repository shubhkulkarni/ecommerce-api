const express = require("express");
const dotenv = require("dotenv");
const productRouter = require("./src/routes/productRoutes");
const app = express();
dotenv.config({ path: "./config.env" });
app.use(express.json());
require("./database");

app.use("/api/products", productRouter);

app.all("*", (req, res) => {
  res
    .status(404)
    .json({ status: 404, message: "invalid url : " + req.originalUrl });
});
app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}`)
);
