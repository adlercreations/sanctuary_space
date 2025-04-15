// frontend/src/components/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { apiService } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (item) => {
    try {
      // Add to backend cart first
      await apiService.post('/orders/cart', {
        product_id: item.id,
        quantity: item.quantity
      });

      // If backend update successful, update frontend state
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
        
        if (existingItemIndex >= 0) {
          // If item exists, update quantity
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + item.quantity
          };
          return updatedItems;
        } else {
          // If item is new, add it to the array
          return [...prevItems, item];
        }
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  const loadCart = async () => {
    try {
      const response = await apiService.get('/orders/cart');
      if (response.items) {
        const cartItemsWithDetails = await Promise.all(
          response.items.map(async (item) => {
            const product = await apiService.get(`/products/${item.product_id}`);
            return {
              ...product,
              quantity: item.quantity,
              order_item_id: item.order_item_id
            };
          })
        );

        // Only update state if the cart items have changed
        if (JSON.stringify(cartItems) !== JSON.stringify(cartItemsWithDetails)) {
          setCartItems(cartItemsWithDetails);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const removeFromCart = async (orderItemId) => {
    try {
      await apiService.delete(`/orders/cart/${orderItemId}`);
      setCartItems(prevItems => prevItems.filter(item => item.order_item_id !== orderItemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};
