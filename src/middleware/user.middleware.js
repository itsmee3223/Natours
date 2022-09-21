const jwt = require("jsonwebtoken");

const UserSchema = require("../models/User.schema");
const asyncHandler = require("./async");
const Email = require("../utils/email");

const createAndSendToken = asyncHandler(async (req, res, next) => {
  const newUser = await UserSchema.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const id = newUser._id;
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(newUser, url).sendWelcome();

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 69 * 69 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  newUser.password = undefined;

  res.singUpUser = {
    status: "success",
    token,
    data: newUser,
  };

  next();
});

module.exports = createAndSendToken;
