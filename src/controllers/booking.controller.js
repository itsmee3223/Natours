const Stripe = require("stripe");

const TourSchema = require("../models/Tour.schema");
const UserSchema = require("../models/User.schema");
const BookingSchema = require("../models/Booking.schema");

const asyncHandler = require("../middleware/async");
const { BadRequestError } = require("../utils/errors");

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
  const tour = session.client_refrence_id;
  const user = await UserSchema.findOne({ email: session.customer_email }).id;
  const price = session.display_items[0].amount / 100;

  await BookingSchema.create({ tour, user, price });
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
