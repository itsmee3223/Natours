const handlerFactory = require("../models/handlerFactory");
const TourSchema = require("../models/Tour.schema");

exports.httpGetAllTours = handlerFactory.getAll(TourSchema);
exports.httpGetTour = handlerFactory.getOne(TourSchema, { path: "reviews" });
exports.httpCreateTour = handlerFactory.createOne(TourSchema);
exports.httpUpdateTour = handlerFactory.updateOne(TourSchema);
exports.httpDeleteTour = handlerFactory.deleteOne(TourSchema);
