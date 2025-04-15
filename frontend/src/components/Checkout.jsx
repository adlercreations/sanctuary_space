// frontend/src/components/Checkout.jsx
import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import '../styles/Checkout.css';
import '../styles/SharedStyles.css';

function Checkout() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe has not loaded yet.');
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Optionally, provide a return URL:
        return_url: window.location.origin + '/order-confirmation',
      },
    });

    if (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
    // If payment succeeds, Stripe will handle the redirection.
  };

  // You can still show a summary of cart items if desired.
  return (
    <form onSubmit={handleSubmit} className="checkout-container">
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <h3>Your Items:</h3>
          <ul>
            {cartItems.map(item => (
              <li key={item.order_item_id}>
                {item.name} - ${item.price.toFixed(2)} x {item.quantity}
              </li>
            ))}
          </ul>
          {/* Render the PaymentElement; the clientSecret and appearance are provided by the Elements provider */}
          <PaymentElement />
          <button type="submit">Pay Now</button>
        </div>
      )}
    </form>
  );
}

export default Checkout;


// // frontend/src/components/Checkout.jsx
// import React, { useEffect, useState } from 'react';
// import { useCart } from './CartContext';
// import { useNavigate } from 'react-router-dom';
// import { apiService } from '../services/api';
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import '../styles/Checkout.css';
// import '../styles/SharedStyles.css';

// function Checkout() {
//   const { cartItems } = useCart();
//   const [clientSecret, setClientSecret] = useState('');
//   const navigate = useNavigate();
  
//   // These hooks now access the Elements context provided from App.jsx
//   const stripe = useStripe();
//   const elements = useElements();

//   // Define the appearance for Stripe Elements
//   const appearance = {
//     theme: 'flat',
//     variables: {
//       colorPrimary: '#0570de',
//       colorBackground: '#ffffff',
//       colorText: '#30313d',
//       colorDanger: '#df1b41',
//       fontFamily: 'Ideal Sans, system-ui, sans-serif',
//       spacingUnit: '2px',
//       borderRadius: '4px',
//     },
//   };

//   useEffect(() => {
//     const createPaymentIntent = async () => {
//       if (cartItems.length > 0) {
//         try {
//           const response = await apiService.post('/orders/create-payment-intent');
//           setClientSecret(response.clientSecret);
//         } catch (error) {
//           console.error('Error creating payment intent:', error);
//         }
//       } else {
//         navigate('/cart'); // Redirect to cart if no items
//       }
//     };

//     createPaymentIntent();
//   }, [cartItems, navigate]);

//   const handlePayment = async () => {
//     if (!stripe || !elements) {
//       console.error('Stripe has not loaded yet.');
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) {
//       console.error('CardElement is not available.');
//       return;
//     }

//     const { error } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: cardElement,
//         billing_details: {
//           name: 'Customer Name', // Replace with actual customer name when available
//         },
//       },
//     });

//     if (error) {
//       console.error('Payment failed:', error);
//       alert('Payment failed. Please try again.');
//     } else {
//       alert('Payment successful!');
//       navigate('/order-confirmation');
//     }
//   };

//   return (
//     <div className="checkout-container">
//       <h2>Checkout</h2>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           <h3>Your Items:</h3>
//           <ul>
//             {cartItems.map(item => (
//               <li key={item.order_item_id}>
//                 {item.name} - ${item.price.toFixed(2)} x {item.quantity}
//               </li>
//             ))}
//           </ul>
//           {clientSecret ? (
//             <>
//               <CardElement className="StripeElement" options={{ style: { base: appearance } }} />
//               <button onClick={handlePayment}>Pay Now</button>
//             </>
//           ) : (
//             <p>Loading payment options...</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Checkout;


// // frontend/src/components/Checkout.jsx
// import React, { useEffect, useState } from 'react';
// import { useCart } from './CartContext';
// import { useNavigate } from 'react-router-dom';
// import { apiService } from '../services/api';
// import { loadStripe } from '@stripe/stripe-js';
// import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
// import '../styles/Checkout.css';
// import '../styles/SharedStyles.css';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// function Checkout() {
//   const { cartItems } = useCart();
//   const [clientSecret, setClientSecret] = useState('');
//   const navigate = useNavigate();
//   const stripe = useStripe();
//   const elements = useElements();

//   useEffect(() => {
//     const createPaymentIntent = async () => {
//       if (cartItems.length > 0) {
//         try {
//           const response = await apiService.post('/orders/create-payment-intent');
//           setClientSecret(response.clientSecret);
//         } catch (error) {
//           console.error('Error creating payment intent:', error);
//         }
//       } else {
//         navigate('/cart'); // Redirect to cart if no items
//       }
//     };

//     createPaymentIntent();
//   }, [cartItems, navigate]);

//   const handlePayment = async () => {
//     if (!stripe || !elements) {
//       console.error('Stripe has not loaded yet.');
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);
    
//     // Check if cardElement is null
//     if (!cardElement) {
//       console.error('CardElement is not available.');
//       return;
//     }

//     const { error } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: cardElement,
//         billing_details: {
//           name: 'Customer Name', // Replace with actual customer name
//         },
//       },
//     });

//     if (error) {
//       console.error('Payment failed:', error);
//       alert('Payment failed. Please try again.');
//     } else {
//       alert('Payment successful!');
//       // Optionally, redirect to a success page or clear the cart here
//     }
//   };

//   // Define the appearance object for Stripe Elements
//   const appearance = {
//     theme: 'flat',
//     variables: {
//       colorPrimary: '#0570de', // Your primary brand color
//       colorBackground: '#ffffff', // Background color for inputs
//       colorText: '#30313d', // Default text color
//       colorDanger: '#df1b41', // Color for errors
//       fontFamily: 'Ideal Sans, system-ui, sans-serif', // Font family
//       spacingUnit: '2px', // Spacing unit
//       borderRadius: '4px', // Border radius for inputs
//     },
//   };

//   return (
//     <div className="checkout-container">
//       <h2>Checkout</h2>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           <h3>Your Items:</h3>
//           <ul>
//             {cartItems.map(item => (
//               <li key={item.order_item_id}>
//                 {item.name} - ${item.price.toFixed(2)} x {item.quantity}
//               </li>
//             ))}
//           </ul>
//           {clientSecret ? (
//             <Elements stripe={stripePromise} options={{ appearance }}>
//               <CardElement className="StripeElement" />
//               <button onClick={handlePayment}>Pay Now</button>
//             </Elements>
//           ) : (
//             <p>Loading payment options...</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Checkout;
