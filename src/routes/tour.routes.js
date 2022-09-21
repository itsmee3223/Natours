const router = require("express").Router();

const {
  httpGetAllTours,
  httpGetTour,
  httpCreateTour,
  httpUpdateTour,
  httpDeleteTour,
  httpGetTopTours,
  httpGetMonthlyPlan,
} = require("../controllers/tour.controller");
const toursMiddleware = require("../middleware/tourMiddleware");
const {
  uploadTourImages,
  resizeTourImages,
} = require("../middleware/uploadImage");

router.route("/").get(httpGetAllTours).post(httpCreateTour);
router.route("/top-5-cheap").get(toursMiddleware.topTours, httpGetTopTours);
router.route("/monthly-plan/:year").get((toursMiddleware.monthlyPlan), httpGetMonthlyPlan);

router
  .route("/:id")
  .get(httpGetTour)
  .patch(uploadTourImages, resizeTourImages, httpUpdateTour)
  .delete(httpDeleteTour);

module.exports = router;
