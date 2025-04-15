// frontend/src/components/ProductDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { triggerLoginModal } from './ProtectedRoute';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    apiService.get(`/products/${productId}`)
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
    if (!isAuthenticated()) {
      triggerLoginModal();
      return;
    }

    if (product) {
      addToCart({ ...product, quantity });
      alert(`${quantity} ${quantity === 1 ? 'item' : 'items'} of ${product.name} ${quantity === 1 ? 'has' : 'have'} been added to your cart!`);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div className="container">
      <h2 className="heading">{product.name}</h2>
      {product.image_url && (
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="image" 
        />
      )}
      <p className="price">Price: ${product.price.toFixed(2)}</p>
      {product.description && (
        <p className="description">{product.description}</p>
      )}
      
      <div className="quantity-container">
        <label htmlFor="quantity" className="quantity-label">Quantity:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="quantity-input"
        />
      </div>

      <button onClick={handleAddToCart} className="button">
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetail;