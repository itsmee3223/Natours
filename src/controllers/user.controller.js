const { StatusCodes } = require("http-status-codes");

exports.httpCreateUser = (req, res, next) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "This route is not defined! please use /signup instead",
  });
};