const router = require("express").Router();

const { httpGetCheckoutSession } = require("../controllers/booking.controller");
const userMiddleware = require("../middleware/user.middleware");

router.use(userMiddleware.auth);

router.get("/checkout-session/:tourId", httpGetCheckoutSession);

module.exports = router;
