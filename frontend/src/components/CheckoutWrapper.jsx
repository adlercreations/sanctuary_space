// frontend/src/components/CheckoutWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiService } from '../services/api';
import Checkout from './Checkout';

const stripePromise = loadStripe(
  'pk_test_51RCEuKPYhHyLlBfTORqWDec0uHEYbuJGoYYwK7BlOBFvjtFA0ZRORsRgBcrh5SWYceh4mMikuSqyfbCU1rvJe4Ll006yJ7ZCWM'
);

const CheckoutWrapper = () => {
  const { cartItems } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define the appearance for Stripe Elements
  const appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
    },
  };

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (cartItems.length > 0) {
        try {
          const response = await apiService.post('/orders/create-payment-intent');
          setClientSecret(response.clientSecret);
        } catch (error) {
          console.error('Error creating payment intent:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/cart'); // Redirect if no items in cart
      }
    };

    createPaymentIntent();
  }, [cartItems, navigate]);

  if (loading) {
    return <p>Loading payment options...</p>;
  }

  if (!clientSecret) {
    return <p>Error loading payment options.</p>;
  }

  // Options for the Elements provider include clientSecret and appearance
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <Checkout />
    </Elements>
  );
};

export default CheckoutWrapper;