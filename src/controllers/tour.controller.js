const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../middleware/async");
const handlerFactory = require("../models/handlerFactory");
const TourSchema = require("../models/Tour.schema");

exports.httpGetAllTours = handlerFactory.getAll(TourSchema);
exports.httpGetTour = handlerFactory.getOne(TourSchema, { path: "reviews" });
exports.httpCreateTour = handlerFactory.createOne(TourSchema);
exports.httpUpdateTour = handlerFactory.updateOne(TourSchema);
exports.httpDeleteTour = handlerFactory.deleteOne(TourSchema);
exports.httpGetTopTours = handlerFactory.getAll(TourSchema);
exports.httpGetMonthlyPlan = (req, res, next) => {
  res.status(StatusCodes.OK).json(res.plan);
};
