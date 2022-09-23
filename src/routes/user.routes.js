const router = require("express").Router();
const {
  httpCreateUser,
  httpSignupUser,
  httpLoginUser,
} = require("../controllers/user.controller");
const userMiddleware = require("../middleware/user.middleware");

router.route("/").post(httpCreateUser);
router.route("/signup").post(userMiddleware.signUp, httpSignupUser);
router.route("/login").post(userMiddleware.loginUser, httpLoginUser);
module.exports = router;
