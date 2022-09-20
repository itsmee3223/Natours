const { StatusCodes } = require("http-status-codes");
const CutstomApiError = require("./customApi");

class BadRequestError extends CutstomApiError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
