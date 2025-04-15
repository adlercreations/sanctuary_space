// frontend/src/components/Checkout.jsx
import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import PaymentForm from './PaymentForm';
import '../styles/Checkout.css';
import '../styles/SharedStyles.css';

function Checkout() {
  const { cartItems } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (cartItems.length > 0) {
        try {
          const response = await apiService.post('/orders/create-payment-intent');
          console.log('Payment Intent Response:', response);
          setClientSecret(response.clientSecret);
        } catch (error) {
          console.error('Error creating payment intent:', error);
        }
      } else {
        navigate('/cart'); // Redirect to cart if no items
      }
    };

    createPaymentIntent();
  }, [cartItems, navigate]);

  return (
    <div className="checkout-container">
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
          {clientSecret ? (
            <PaymentForm clientSecret={clientSecret} />
          ) : (
            <p>Loading payment options...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Checkout;


// // frontend/src/components/Checkout.jsx
// import React, { useEffect, useState } from 'react';
// import { useCart } from './CartContext';
// import { useNavigate } from 'react-router-dom';
// import { apiService } from '../services/api';
// import { loadStripe } from '@stripe/stripe-js';
// import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
// import '../styles/Checkout.css';
// import '../styles/SharedStyles.css';

// function Checkout() {
//   const { cartItems } = useCart();
//   const [clientSecret, setClientSecret] = useState('');
//   const navigate = useNavigate();
//   const stripe = useStripe();
//   const elements = useElements();
// //   const stripePromise = loadStripe('pk_test_51RCEuKPYhHyLlBfTORqWDec0uHEYbuJGoYYwK7BlOBFvjtFA0ZRORsRgBcrh5SWYceh4mMikuSqyfbCU1rvJe4Ll006yJ7ZCWM'); // Replace with your Stripe publishable key

//   // Define the appearance object for the flat theme
//   const appearance = {
//     theme: 'flat',
//     variables: {
//       fontFamily: 'Helvetica, Arial, sans-serif',
//       colorPrimary: '#0e3f6b', // Customize primary color
//       colorBackground: '#ffffff', // Background color
//       colorText: '#000000', // Text color
//       colorDanger: '#fa755a', // Danger color
//       borderRadius: '4px', // Border radius for elements
//     },
//   };

//   useEffect(() => {
//     const createPaymentIntent = async () => {
//       if (cartItems.length > 0) {
//         try {
//           const response = await apiService.post('/orders/create-payment-intent');
//           console.log('Payment Intent Response:', response);
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

// const handlePayment = async () => {
//     // Ensure Stripe and Elements are loaded
//     if (!stripe || !elements) {
//       console.error('Stripe has not loaded yet.');
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) {
//       console.error('CardElement not found.');
//       return;
//     }

//     // Confirm payment with the card element retrieved via useElements()
//     const { error } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: cardElement,
//         billing_details: {
//           name: 'Customer Name',
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
// };

// //   const handlePayment = async () => {
// //     const stripe = await stripePromise;
// //     const cardElement = document.getElementById('card-element'); // Get the card element

// //     const { error } = await stripe.confirmCardPayment(clientSecret, {
// //       payment_method: {
// //         card: cardElement,
// //         billing_details: {
// //           name: 'Customer Name', // Replace with actual customer name
// //         },
// //       },
// //     });

// //     if (error) {
// //       console.error('Payment failed:', error);
// //       alert('Payment failed. Please try again.');
// //     } else {
// //       alert('Payment successful!');
// //       // Optionally, redirect to a success page or clear the cart
// //     }
// //   };

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
//             <Elements stripe={stripe} options={{ clientSecret, appearance }}>
//               <CardElement />
//             </Elements>
//           ) : (
//             <p>Loading payment options...</p>
//           )}
//           <button onClick={handlePayment}>Pay Now</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Checkout;
