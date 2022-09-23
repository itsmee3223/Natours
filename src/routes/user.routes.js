const router = require("express").Router();
const {
  httpCreateUser,
  httpSignupUser,
  httpLoginUser,
  httpLogoutUser,
  httpForgetUserPassword,
  httpResetPassword,
  httpUpdatePassword,
  httpGetMe,
} = require("../controllers/user.controller");
const userMiddleware = require("../middleware/user.middleware");

router.route("/").post(httpCreateUser);
router.route("/signup").post(userMiddleware.signUp, httpSignupUser);
router.route("/login").post(userMiddleware.loginUser, httpLoginUser);
router.route("/logout").get(userMiddleware.logoutUser, httpLogoutUser);
router
  .route("/forgotPassword")
  .post(userMiddleware.forgetPassword, httpForgetUserPassword);
router
  .route("/resetPassword/:token")
  .patch(userMiddleware.resetPassword, httpResetPassword);

router.use(userMiddleware.auth);
router
  .route("/updateMyPassword")
  .patch(userMiddleware.updatePassword, httpUpdatePassword);
router.route("/me").get(userMiddleware.getMe, httpGetMe);
module.exports = router;
