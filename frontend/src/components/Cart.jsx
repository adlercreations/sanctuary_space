// frontend/src/components/Cart.jsx
import { useState } from 'react';
import '../styles/Cart.css';

function Cart() {
  // eslint-disable-next-line no-unused-vars
  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="cart-container">
      <div className="daytime-motif" />
      <h2>Your Shopping Cart</h2>
      
      <div className="cart-content">
        {!cartItems.length ? (
          <div className="empty-cart-message">
            <p>Your cart is empty.</p>
            <p>Browse our shop to add items to your cart.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="cart-item-image" />
                  )}
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">${item.price?.toFixed(2) || '0.00'}</p>
                    <p className="cart-item-quantity">Quantity: {item.quantity || 1}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <p>Total: ${cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}</p>
              </div>
              <button className="checkout-button">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;