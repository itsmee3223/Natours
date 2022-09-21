const asyncHandler = require("./async");
const TourSchema = require("../models/Tour.schema");
const { StatusCodes } = require("http-status-codes");

function topTours(req, res, next) {
  req.query.limit = 5;
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
}

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

  res.plan = {
    status: "success",
    data: plan,
  };

  next();
});

module.exports = {
  topTours,
  monthlyPlan,
};
