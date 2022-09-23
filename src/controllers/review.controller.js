const handlerFactory = require("../models/handlerFactory");
const ReviewSchema = require("../models/Review.schema");

exports.setTourIdAndUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.setTourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.httpGetAllReviews = handlerFactory.getAll(ReviewSchema);
exports.httpGetReview = handlerFactory.getOne(ReviewSchema);
exports.httpCreateReview = handlerFactory.createOne(ReviewSchema);
