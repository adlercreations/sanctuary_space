// frontend/src/pages/OrderConfirmation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/OrderConfirmation.css'; // Create and style as needed

const OrderConfirmation = () => {
  return (
    <div className="order-confirmation-container">
      <h1>Thank You!</h1>
      <p>Your payment was successful.</p>
      <p>Your order is being processed.</p>
      <Link to="/home" className="home-button">Return to Home</Link>
    </div>
  );
};

export default OrderConfirmation;