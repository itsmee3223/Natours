const router = require("express").Router();

const {
  httpGetCheckoutSession,
  httpCreateBooking,
  httpGetAllBookings,
  httpGetBooking,
  httpUpdateBooking,
  httpDeleteBooking,
} = require("../controllers/booking.controller");
const userMiddleware = require("../middleware/user.middleware");

router.use(userMiddleware.auth);

router.get("/checkout-session/:tourId", httpGetCheckoutSession);

router.use(userMiddleware.authorize("admin", "lead-guide"));

router.route("/").post(httpCreateBooking).get(httpGetAllBookings);

router
  .route("/:id")
  .get(httpGetBooking)
  .patch(httpUpdateBooking)
  .delete(httpDeleteBooking);

module.exports = router;
