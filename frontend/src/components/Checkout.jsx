// frontend/src/components/Checkout.jsx
import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import '../styles/Checkout.css';
import '../styles/SharedStyles.css';

function Checkout() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [deliveryOption, setDeliveryOption] = useState('mail'); // 'mail' or 'local'
  const [mailingAddress, setMailingAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [localAddress, setLocalAddress] = useState({ street: '', apt: '' });
  // TODO: Add state for delivery fee and update total

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

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'mail') {
      setMailingAddress(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'local') {
      setLocalAddress(prev => ({ ...prev, [name]: value }));
    }
  };

  // TODO: Calculate total price including delivery fee
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 5.00; // Example delivery fee
  const finalTotal = totalPrice + (cartItems.length > 0 ? deliveryFee : 0);

  return (
    <form onSubmit={handleSubmit} className="checkout-container">
      <h2>Checkout</h2>

      <div className="delivery-options-tabs">
        <button 
          type="button" 
          className={`tab-button ${deliveryOption === 'mail' ? 'active' : ''}`}
          onClick={() => setDeliveryOption('mail')}
        >
          Mail Delivery
        </button>
        <button 
          type="button" 
          className={`tab-button ${deliveryOption === 'local' ? 'active' : ''}`}
          onClick={() => setDeliveryOption('local')}
        >
          Local Delivery
        </button>
      </div>

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
          <p>Subtotal: ${totalPrice.toFixed(2)}</p>
          <p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
          <h4>Total: ${finalTotal.toFixed(2)}</h4>

          {deliveryOption === 'mail' && (
            <div className="address-form mail-delivery-form">
              <h4>Mailing Address</h4>
              <input type="text" name="street" placeholder="Street Address" value={mailingAddress.street} onChange={(e) => handleInputChange(e, 'mail')} required />
              <input type="text" name="city" placeholder="City" value={mailingAddress.city} onChange={(e) => handleInputChange(e, 'mail')} required />
              <input type="text" name="state" placeholder="State" value={mailingAddress.state} onChange={(e) => handleInputChange(e, 'mail')} required />
              <input type="text" name="zip" placeholder="Zip Code" value={mailingAddress.zip} onChange={(e) => handleInputChange(e, 'mail')} required />
            </div>
          )}

          {deliveryOption === 'local' && (
            <div className="address-form local-delivery-form">
              <h4>Local Delivery (New York City)</h4>
              <p>We personally deliver to anywhere in New York City within 1 mile of any subway station.</p>
              <input type="text" name="street" placeholder="Street Address" value={localAddress.street} onChange={(e) => handleInputChange(e, 'local')} required />
              <input type="text" name="apt" placeholder="Apt, Suite, etc. (Optional)" value={localAddress.apt} onChange={(e) => handleInputChange(e, 'local')} />
            </div>
          )}
          
          <div className="payment-section">
            <h4>Payment Details</h4>
            {/* Render the PaymentElement; the clientSecret and appearance are provided by the Elements provider */}
            <PaymentElement />
            <button type="submit" disabled={!stripe || !elements || cartItems.length === 0}>
              Pay ${finalTotal.toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default Checkout;
