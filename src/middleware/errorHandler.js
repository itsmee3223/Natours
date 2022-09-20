const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // set default custom error
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  // Error validation
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // Error duplicate email
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value for ${Object.keys(
      err.keyValue
    )} please choose antoher value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // Error casting id handler for not found id
  if (err.name === "CastError") {
    customError.msg = `Not found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  // For detail full error use this
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });

  // For specific errors
  return res.status(customError.statusCode).json({
    status: "fail",
    message: customError.msg,
  });
};

module.exports = errorHandlerMiddleware;
