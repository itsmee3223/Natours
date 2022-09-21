const router = require("express").Router();

const {
  httpGetAllTours,
  httpGetTour,
  httpCreateTour,
  httpUpdateTour,
  httpDeleteTour,
  httpGetTopTours,
  httpGetMonthlyPlan,
  httpGetTourStats,
  httpGetToursWithin,
  httpGetToursDistance,
} = require("../controllers/tour.controller");
const toursMiddleware = require("../middleware/tourMiddleware");
const {
  uploadTourImages,
  resizeTourImages,
} = require("../middleware/uploadImage");

router.route("/").get(httpGetAllTours).post(httpCreateTour);
router.route("/tour-stats").get(toursMiddleware.tourStats, httpGetTourStats);
router.route("/top-5-cheap").get(toursMiddleware.topTours, httpGetTopTours);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(toursMiddleware.toursWithin, httpGetToursWithin);

router
  .route("/distances/:latlng/unit/:unit")
  .get(toursMiddleware.toursDistance, httpGetToursDistance);

router
  .route("/monthly-plan/:year")
  .get(toursMiddleware.monthlyPlan, httpGetMonthlyPlan);

router
  .route("/:id")
  .get(httpGetTour)
  .patch(uploadTourImages, resizeTourImages, httpUpdateTour)
  .delete(httpDeleteTour);

module.exports = router;
