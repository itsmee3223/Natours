const { StatusCodes } = require("http-status-codes");

const asyncHandler = require("../middleware/async");
const { NotFoundError } = require("../utils/errors");
const AdvancedQuery = require("../utils/advanceQuery");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);
    if (!data) {
      return next(new NotFoundError("No data found with that id"));
    }

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
      data,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidatos: true,
    });

    if (!data) {
      return next(new NotFoundError("No data found with that id"));
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      data,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.create(req.body);
    return res.status(StatusCodes.OK).json({
      status: "success",
      data,
    });
  });

exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const data = !populateOptions
      ? await Model.findById(req.params.id)
      : await Model.findById(req.params.id).populate(populateOptions);
    if (!data) {
      return next(new NotFoundError("No data found with that id"));
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      data,
    });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const data = new AdvancedQuery(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await data.query.explain();
    const doc = await data.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });
