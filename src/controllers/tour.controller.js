const handlerFactory = require("../models/handlerFactory");
const TourSchema = require("../models/Tour.schema");

exports.httpGetAllTours = handlerFactory.getAll(TourSchema);
exports.httpGetTour = handlerFactory.getOne(TourSchema, { path: "reviews" });
