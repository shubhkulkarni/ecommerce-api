const express = require("express");
const dotenv = require("dotenv");
const productRouter = require("./src/routes/productRoutes");
const AppError = require("./src/utils/Error");
const { errMiddleware } = require("./src/middlewares/error");
const { appRouter } = require("./src/routes/route.config");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const app = express();
dotenv.config({ path: "./config.env" });
app.use(express.json());
require("./database");

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try after one hour.", // this limits requests from same ip
});

app.use(helmet()); //this adds security response headers
app.use(mongoSanitize()); //sanitizes queries in request data (NoSQL query injection)
app.use(xss()); //preventing xss attacks (malicious html code)

//use hpp package for preventing parameter pollution

app.use("/api", limiter);
appRouter.forEach((i) => app.use(i.path, i.router));

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
