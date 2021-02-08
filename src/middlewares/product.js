exports.checkProduct = async (req, res, next) => {
  if (!req.body || !req.body.name) {
    res
      .status(400)
      .send({ status: 400, message: "Bad request ! data is inappropriate" });
  }
  next();
};

exports.cheapProducts = (req, res, next) => {
  req.query.price = { lte: 1000 };
  next();
};
