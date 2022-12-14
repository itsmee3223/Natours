const crypto = require("crypto");
const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const UserSchema = require("../models/User.schema");
const asyncHandler = require("./async");
const Email = require("../utils/email");

const UnauthenticatedError = require("../utils/errors/unauthenticated");
const BadRequestError = require("../utils/errors/badRequest");
const NotFoundError = require("../utils/errors/notFound");

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
  user.__v = undefined;
  res.status(statusCode);
  res.userInfo = {
    status: "success",
    token,
    data: user,
  };

  next();
};

const auth = asyncHandler(async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : req.cookies.jwt;

  if (!token) {
    return next(new UnauthenticatedError("You are not logged in"));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await UserSchema.findById(decoded.id);
  if (!currentUser) {
    return next(
      new UnauthenticatedError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new UnauthenticatedError(
        "User recently changed password! Please log in again.",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new UnauthenticatedError("You don't have permission"));
    }
    next();
  };
};

const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await UserSchema.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
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
  createAndSendToken(user, StatusCodes.OK, req, res, next);
});

const logoutUser = (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.userInfo = {
    status: "success",
  };

  next();
};

const forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserSchema.findOne({ email: req.body.email });
  if (!user) {
    return next(new NotFoundError("There is no user with this email address"));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.userInfo = {
      status: "success",
      message: "Token sent to email!",
    };
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(err);
  }
  console.log(resetToken);
  next();
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(req.params.token);
  const user = await UserSchema.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new BadRequestError("Token is invalid or has expired"));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createAndSendToken(user, StatusCodes.OK, req, res, next);
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await UserSchema.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new BadRequestError("Your current password is wrong."));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createAndSendToken(user, StatusCodes.OK, req, res, next);
});

const getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

const updateCurrentUser = asyncHandler(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new BadRequestError(
        "This route is not for password updates. Please use /updateMyPassword."
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await UserSchema.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.updatedUser = {
    status: "success",
    data: updatedUser,
  };
  next();
});

const deleteMe = asyncHandler(async (req, res, next) => {
  await UserSchema.findByIdAndDelete(req.user.id, { active: false });
  res.deletedMe = {
    status: "success",
    message: "Deleted....",
  };

  next();
});

module.exports = {
  signUp,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  updatePassword,
  auth,
  authorize,
  getMe,
  updateCurrentUser,
  deleteMe,
  isLoggedIn,
};
