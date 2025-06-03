// frontend/src/pages/ShopPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import '../styles/ShopPage.css';
import '../styles/SharedStyles.css';

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiService.get('/products')
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch products error:', err);
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error)   return <p>{error}</p>;

  // For now, let's assume the first two products are Enhanced Teas
  const enhancedTeas = products.slice(0, 2); // Adjust this logic as needed
  const wellnessTeas = []; // No products yet

  return (
    <div className="shop-container">
      <div className="daytime-motif" />
      <div className="bottom-image" />
      
      <div className="shop-top-content">
        <h1>Wellness Teas & Marketplace</h1>

        {/* Enhanced Teas Section */}
        <h2>Enhanced Teas</h2>
        <div className="shop-content">
          {enhancedTeas.map((product) => (
            <Link to={`/shop/${product.id}`} key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} />
              <div className="text-content">
                <h3>{product.name}</h3>
                <p className="price">Price: ${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Wellness Teas Section */}
        <h2>Wellness Teas</h2>
        <div className="shop-content">
          {/* Empty for now */}
          {wellnessTeas.length === 0 && (
            <p style={{ opacity: 0.6, fontStyle: 'italic' }}>Coming soon!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;