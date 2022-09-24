const Stripe = require("stripe");

const TourSchema = require("../models/Tour.schema");
const UserSchema = require("../models/User.schema");
const BookingSchema = require("../models/Booking.schema");

const handlerFactory = require("../models/handlerFactory");

const asyncHandler = require("../middleware/async");

exports.httpGetCheckoutSession = asyncHandler(async (req, res, next) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const tour = await TourSchema.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get("host")}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
  });
  res.status(200).json({
    status: "success",
    session,
  });
});

const createBookingCheckout = asyncHandler(async (session) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
});

exports.webhookCheckout = (req, res, next) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];
  const event = stripe.checkout.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "checkout.session.completed") {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

exports.httpCreateBooking = handlerFactory.createOne(BookingSchema);
exports.httpGetAllBookings = handlerFactory.getAll(BookingSchema);
exports.httpGetBooking = handlerFactory.getOne(BookingSchema);
exports.httpUpdateBooking = handlerFactory.updateOne(BookingSchema);
exports.httpDeleteBooking = handlerFactory.deleteOne(BookingSchema);
