const router = require("express").Router();

const {
  httpGetAllTours,
  httpGetTour,
  httpCreateTour,
  httpUpdateTour,
} = require("../controllers/tour.controller");
const { uploadTourImages, resizeTourImages } = require("../middleware/uploadImage");


router.route("/")
  .get(httpGetAllTours)
  .post(httpCreateTour);

router
  .route("/:id")
  .get(httpGetTour)
  .patch(uploadTourImages, resizeTourImages, httpUpdateTour);

module.exports = router;
