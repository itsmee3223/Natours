const router = require("express").Router();
const {
  httpCreateUser,
  httpSignupUser,
  httpLoginUser,
  httpLogoutUser,
  httpForgetUserPassword,
} = require("../controllers/user.controller");
const userMiddleware = require("../middleware/user.middleware");

router.route("/").post(httpCreateUser);
router.route("/signup").post(userMiddleware.signUp, httpSignupUser);
router.route("/login").post(userMiddleware.loginUser, httpLoginUser);
router.route("/logout").get(userMiddleware.logoutUser, httpLogoutUser);
router
  .route("/forgotPassword")
  .post(userMiddleware.forgetPassword, httpForgetUserPassword);
module.exports = router;
