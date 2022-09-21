const router = require("express").Router();
const {
  httpCreateUser,
  httpSignupUser,
} = require("../controllers/user.controller");
const userMiddleware = require("../middleware/user.middleware");

router.route("/").post(httpCreateUser);
router.route("/signup").post(userMiddleware, httpSignupUser);

module.exports = router;
