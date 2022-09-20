const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./customApi");

class UnauthenticatedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
