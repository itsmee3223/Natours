/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const bookTour = async (tourId) => {
  var stripe = Stripe(
    "pk_test_51LlKBYCRU9A0lr5W8TZddQSy0L2VKWTDdVemV0kBp1cW4yaoeAmJDonzbybZVui61P52JdQZeWLhwxSP2vPbp0lo00JkHshcEd"
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    console.log(session);
    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
