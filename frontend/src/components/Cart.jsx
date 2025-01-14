import React, { useState } from 'react';

function Cart() {
  // For a real app, you'd fetch or share "cart items" via Context or Redux
  const [cartItems, setCartItems] = useState([]);

  // Fake example
  // In real usage, you'd pass data from ProductDetail -> add to cart in global state
  if (!cartItems.length) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.productId}>
          <p>{item.productName} - Quantity: {item.quantity}</p>
        </div>
      ))}
      {/* Checkout button -> Stripe integration in future */}
    </div>
  );
}

export default Cart;