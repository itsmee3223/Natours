const router = require("express").Router();

const { httpGetAllReviews, httpGetReview } = require("../controllers/review.controller");
const userMiddleware = require("../middleware/user.middleware");
router.use(userMiddleware.auth);

router.route("/").get(httpGetAllReviews);
router.route("/:id").get(httpGetReview);
module.exports = router;
