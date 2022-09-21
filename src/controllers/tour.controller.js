const { StatusCodes } = require("http-status-codes");
const handlerFactory = require("../models/handlerFactory");
const TourSchema = require("../models/Tour.schema");

exports.httpGetAllTours = handlerFactory.getAll(TourSchema);
exports.httpGetTour = handlerFactory.getOne(TourSchema, { path: "reviews" });
exports.httpCreateTour = handlerFactory.createOne(TourSchema);
exports.httpUpdateTour = handlerFactory.updateOne(TourSchema);
exports.httpDeleteTour = handlerFactory.deleteOne(TourSchema);
exports.httpGetTopTours = handlerFactory.getAll(TourSchema);
exports.httpGetMonthlyPlan = (req, res, next) => {
  res.status(StatusCodes.OK).json(res.toursPlan);
};
exports.httpGetTourStats = (req, res, next) => {
  return res.status(StatusCodes.OK).json(res.tourStats);
};
exports.httpGetToursWithin = (req, res, next) => {
  return res.status(StatusCodes.OK).json(res.toursWithin);
};
