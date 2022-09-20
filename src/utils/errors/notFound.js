const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./customApi");

class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
