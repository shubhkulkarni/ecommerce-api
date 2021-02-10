const authRouter = require("./authRoutes");
const productRouter = require("./productRoutes");

exports.appRouter = [
  { path: "/api/products", router: productRouter },
  { path: "/api", router: authRouter },
];
