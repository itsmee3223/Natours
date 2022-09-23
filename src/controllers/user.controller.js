const { StatusCodes } = require("http-status-codes");
const hadnlerFactory = require("../models/handlerFactory");
const UserSchema = require("../models/User.schema");

exports.httpCreateUser = (req, res, next) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "This route is not defined! please use /signup instead",
  });
};

exports.httpSignupUser = (req, res, next) => {
  return res.json(res.userInfo);
};

exports.httpLoginUser = (req, res, next) => {
  return res.json(res.userInfo);
};

exports.httpLogoutUser = (req, res, next) => {
  return res.status(StatusCodes.OK).json(res.userInfo);
};

exports.httpForgetUserPassword = (req, res, next) => {
  return res.status(StatusCodes.OK).json(res.userInfo);
};

exports.httpResetPassword = (req, res, next) => {
  return res.json(res.userInfo);
};

exports.httpUpdatePassword = (req, res, next) => {
  return res.json(res.userInfo);
};

exports.httpUpdatePassword = (req, res, next) => {
  return res.json(res.userInfo);
};

exports.httpUpdateCurrentUser = (req, res, next) => {
  return res.status(StatusCodes.OK).json(res.updatedUser);
};

exports.httpGetMe = hadnlerFactory.getOne(UserSchema);
