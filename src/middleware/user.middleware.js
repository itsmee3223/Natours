const jwt = require("jsonwebtoken");

const UserSchema = require("../models/User.schema");
const asyncHandler = require("./async");
const UnauthenticatedError = require("../utils/errors/unauthenticated");
const BadRequestError = require("../utils/errors/badRequest");
const Email = require("../utils/email");
const { StatusCodes } = require("http-status-codes");

const createAndSendToken = (user, statusCode, req, res, next) => {
  const id = user._id;
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 69 * 69 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;
  res.status(statusCode);
  res.userInfo = {
    status: "success",
    token,
    data: user,
  };

  next();
};

const signUp = asyncHandler(async (req, res, next) => {
  const newUser = await UserSchema.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, StatusCodes.CREATED, req, res, next);
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new BadRequestError("Please provide email and password!"));
  }
  // 2) Check if user exists && password is correct
  const user = await UserSchema.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new UnauthenticatedError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createAndSendToken(user, 200, req, res, next);
});

module.exports = {
  signUp,
  loginUser,
};
