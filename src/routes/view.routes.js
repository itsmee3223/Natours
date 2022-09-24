const router = require("express").Router();

const {
  getLoginForm,
  alerts,
  getOverview,
  getTour,
  getAccount,
  getMyTours,
  updateUserData,
} = require("../controllers/view.controller");
const userMiddleware = require("../middleware/user.middleware");

router.use(alerts);

router.get("/", userMiddleware.isLoggedIn, getOverview);
router.get("/login", userMiddleware.isLoggedIn, getLoginForm);
router.get("/me", userMiddleware.auth, getAccount);
router.get("/my-tours", userMiddleware.auth, getMyTours);
router.post("/submit-user-data", userMiddleware.auth, updateUserData);
router.get("/tour/:slug", userMiddleware.isLoggedIn, getTour);
module.exports = router;
