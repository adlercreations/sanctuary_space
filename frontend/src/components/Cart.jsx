import React, { useState } from 'react';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddItem = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  if (!cartItems.length) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Cart</h2>
      {cartItems.map((item, index) => (
        <div key={index}>
          <p>{item.name} - Quantity: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default Cart;