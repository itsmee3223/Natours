const { StatusCodes } = require("http-status-codes");

const handlerFactory = require("../models/handlerFactory");
const TourSchema = require("../models/Tour.schema");

exports.httpGetAllTours = handlerFactory.getAll(TourSchema);
