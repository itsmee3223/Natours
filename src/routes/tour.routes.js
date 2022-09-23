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
const toursMiddleware = require("../middleware/tour.middleware");
const { uploadTourImages, resizeImages } = require("../middleware/uploadImage.middleware");

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
  .patch(uploadTourImages, resizeImages, httpUpdateTour)
  .delete(httpDeleteTour);

module.exports = router;
