const router = require("express").Router();

const {
  httpGetAllReviews,
  httpGetReview,
  setTourIdAndUserId,
  httpCreateReview,
  httpUpdateReview,
} = require("../controllers/review.controller");
const userMiddleware = require("../middleware/user.middleware");
router.use(userMiddleware.auth);

router
  .route("/")
  .get(httpGetAllReviews)
  .post(userMiddleware.authorize("user"), setTourIdAndUserId, httpCreateReview);

router
  .route("/:id")
  .get(httpGetReview)
  .patch(userMiddleware.authorize("user", "admin"), httpUpdateReview);

module.exports = router;
