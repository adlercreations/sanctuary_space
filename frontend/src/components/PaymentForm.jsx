// frontend/src/components/PaymentForm.jsx
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css'; // You can create a dedicated PaymentForm.css if needed

const PaymentForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // Define the appearance for the CardElement (optional)
  const appearance = {
    theme: 'flat',
    variables: {
      fontFamily: 'Helvetica, Arial, sans-serif',
      colorPrimary: '#0e3f6b',
      colorBackground: '#ffffff',
      colorText: '#000000',
      colorDanger: '#fa755a',
      borderRadius: '4px',
    },
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      console.error('Stripe has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error('CardElement not found.');
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Customer Name', // Replace with actual customer name if available
        },
      },
    });

    setProcessing(false);

    if (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } else {
      alert('Payment successful!');
      // Redirect to an order confirmation page after success
      navigate('/order-confirmation');
    }
  };

  return (
    <div className="payment-form">
      <CardElement options={{ style: { base: appearance } }} />
      <button onClick={handlePayment} disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentForm;