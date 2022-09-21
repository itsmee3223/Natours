function topTours(req, res, next) {
  req.query.limit = 5;
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
}

module.exports = topTours;
