// frontend/src/components/Cart.jsx
import { useEffect } from 'react';
import { useCart } from './CartContext';
import '../styles/Cart.css';
import '../styles/SharedStyles.css';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart, loadCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartItems.length) {
      loadCart();
    }
  }, [cartItems.length, loadCart]);

  const handleRemoveItem = async (orderItemId) => {
    try {
      await removeFromCart(orderItemId);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart');
    }
  };

  return (
    <div className="cart-container">
      <div className="daytime-motif" />
      <div className="bottom-image" />
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
              {cartItems.map((item) => (
                <div key={item.order_item_id} className="cart-item">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="cart-item-image" />
                  )}
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">${item.price?.toFixed(2) || '0.00'}</p>
                    <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                    <button 
                      className="remove-item-button"
                      onClick={() => handleRemoveItem(item.order_item_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <p>Total: ${cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}</p>
              </div>
              <button className="checkout-button" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;