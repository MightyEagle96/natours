import axios from 'axios';
import { showAlert } from './alerts';
import { loadStripe } from '@stripe/stripe-js';

export const bookTour = async (tourId) => {
  try {
    const stripe = await loadStripe(
      'pk_test_51HA8rvFipmgBai7IgM0jOfFUB8nGprOLDn4Y2LnZIUux92C6VwBVUV8tKWKIDbTGae3eqbrqKGS6B86P0lwfdLu600uSottIgy'
    );

    //1. Get the session from the server
    const session = await axios(
      `http://127.0.0.1:2207/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session.data.session.id);

    //2. create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: `${session.data.session.id}`,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
