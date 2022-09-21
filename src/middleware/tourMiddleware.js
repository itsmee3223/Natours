const asyncHandler = require("./async");
const TourSchema = require("../models/Tour.schema");
const { BadRequestError } = require("../utils/errors");

const topTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

const monthlyPlan = asyncHandler(async (req, res, next) => {
  const year = Number(req.params.year);
  const plan = await TourSchema.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.toursPlan = {
    status: "success",
    data: plan,
  };

  next();
});

const tourStats = asyncHandler(async (req, res, next) => {
  const stats = await TourSchema.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.tourStats = {
    status: "success",
    data: stats,
  };

  next();
});

const toursWithin = asyncHandler(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if ((!lat, !lng)) {
    next(
      new BadRequestError(
        "Please provide latitude and longitude in the format lat, lang."
      )
    );
  }

  const tours = await TourSchema.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.toursWithin = {
    status: "success",
    data: tours,
  };

  next();
});

module.exports = {
  topTours,
  monthlyPlan,
  tourStats,
  toursWithin,
};
