const router = require("express").Router();

const { httpGetAllReviews } = require("../controllers/review.controller");
const userMiddleware = require("../middleware/user.middleware");
router.use(userMiddleware.auth);

router.route("/").get(httpGetAllReviews);

module.exports = router;
