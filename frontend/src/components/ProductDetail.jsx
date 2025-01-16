// frontend/src/components/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest } from '../services/api';
import { useCart } from './CartContext';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getRequest(`/products/${productId}`)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch product detail error:', err);
        setError('Failed to load product details.');
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
        addToCart({ ...product, quantity: 1 }); // Assuming quantity is 1 for simplicity
        alert(`${product.name} has been added to your cart!`);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{product.name}</h2>
      {product.image_url && (
        <img 
            src={product.image_url} 
            alt={product.name} 
            style={styles.image} 
        />
      )}
      <p style={styles.price}>Price: ${product.price.toFixed(2)}</p>
      {product.description && (
        <p style={styles.description}>{product.description}</p>
      )}
      <button onClick={handleAddToCart} style={styles.button}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetail;