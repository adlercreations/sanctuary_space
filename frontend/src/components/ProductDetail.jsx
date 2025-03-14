// frontend/src/components/ProductDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { triggerLoginModal } from './ProtectedRoute';
import '../styles/ProductDetail.css';

// Define styles
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px'
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: '20px'
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333'
  },
  description: {
    marginTop: '20px',
    lineHeight: '1.6'
  },
  button: {
    backgroundColor: '#9cd1ff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: 'bold'
  }
};

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

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
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Trigger login modal if not authenticated
      triggerLoginModal();
      return;
    }

    // Add to cart if authenticated
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