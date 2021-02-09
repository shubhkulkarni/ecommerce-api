const express = require("express");
const dotenv = require("dotenv");
const productRouter = require("./src/routes/productRoutes");
const AppError = require("./src/utils/Error");
const { errMiddleware } = require("./src/middlewares/error");
const app = express();
dotenv.config({ path: "./config.env" });
app.use(express.json());
require("./database");

app.use("/api/products", productRouter);

app.all("*", (req, res, next) => {
  next(new AppError("invalid url : " + req.originalUrl, 404));
});

app.use(errMiddleware);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception...shutting down");
  server.close(() => {
    process.exit(1);
  });
});
