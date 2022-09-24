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
const {
  uploadTourImages,
  resizeImages,
} = require("../middleware/uploadImage.middleware");
const { authorize, auth } = require("../middleware/user.middleware");

router
  .route("/")
  .get(httpGetAllTours)
  .post(auth, authorize("admin", "lead-guide"), httpCreateTour);
  
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
  .get(
    authorize("admin", "lead-guide", "guide"),
    toursMiddleware.monthlyPlan,
    httpGetMonthlyPlan
  );

router
  .route("/:id")
  .get(httpGetTour)
  .patch(
    uploadTourImages,
    resizeImages,
    auth,
    authorize("admin", "lead-guide"),
    httpUpdateTour
  )
  .delete(auth, authorize("admin", "lead-guide"), httpDeleteTour);

module.exports = router;
