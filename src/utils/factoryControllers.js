const catchAsync = require("./asyncErrorCatcher");
const AppError = require("./Error");

exports.deleteOneItem = (Model) => {
  const name = Model.modelName; // to access the model name
  return catchAsync(async (req, res, next) => {
    let document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError(`${name} not found`, 404));
    }
    res
      .status(204)
      .send({ status: 204, message: `${name} is deleted successfully` });
  });
};
