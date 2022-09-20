const router = require("express").Router();

const { httpGetAllTours } = require("../controllers/tour.controller");

router
  .route('/')
  .get(httpGetAllTours)

module.exports = router;
