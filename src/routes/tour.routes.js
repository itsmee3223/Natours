const router = require("express").Router();

const {
  httpGetAllTours,
  httpGetTour,
  httpCreateTour,
  httpUpdateTour,
  httpDeleteTour,
  httpGetTopTours,
} = require("../controllers/tour.controller");
const topTours = require("../middleware/topTours");
const {
  uploadTourImages,
  resizeTourImages,
} = require("../middleware/uploadImage");

router.route("/").get(httpGetAllTours).post(httpCreateTour);
router.route("/top-5-cheap").get(topTours, httpGetTopTours);

router
  .route("/:id")
  .get(httpGetTour)
  .patch(uploadTourImages, resizeTourImages, httpUpdateTour)
  .delete(httpDeleteTour);

module.exports = router;
