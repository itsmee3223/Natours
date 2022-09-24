const { StatusCodes } = require("http-status-codes");

const TourSchema = require("../models/Tour.schema");
const UserSchema = require("../models/User.schema");
const BookingSchema = require("../models/Booking.schema");

const asyncHandler = require("../middleware/async");
const { NotFoundError } = require("../utils/errors");

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "booking") {
    ("Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.");
  }
  next();
};

exports.getOverview = asyncHandler(async (req, res, next) => {
  const tours = await TourSchema.find();
  res.status(StatusCodes.OK).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = asyncHandler(async (req, res, next) => {
  const tour = await TourSchema.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return new (NotFoundError("There is no tours with that name"))();
  }

  res.status(StatusCodes.OK).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(StatusCodes.OK).render("login", {
    title: "Login | Account",
  });
};

exports.getAccount = (req, res) => {
  res.status(StatusCodes.OK).render("account", {
    tittle: "Your Account",
  });
};

exports.getMyTours = asyncHandler(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await BookingSchema.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await TourSchema.find({ _id: { $in: tourIDs } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});

exports.updateUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserSchema.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});
