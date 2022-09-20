const router = require("express").Router();

const {
  httpGetAllTours,
  httpGetTour,
} = require("../controllers/tour.controller");

router.route("/").get(httpGetAllTours);

router.route("/:id").get(httpGetTour);

module.exports = router;
