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

  return (
    <div className="shop-container">
      <div className="daytime-motif" />
      <div className="bottom-image" />
      
      <div className="shop-top-content">
        <h1>Wellness Teas & Marketplace</h1>

        {/* Wrap the product listing in a content div for spacing */}
        <div className="shop-content">
          <div className="product-list">
            {products.map((product) => (
              <Link to={`/shop/${product.id}`} key={product.id} className="product-card">
                <img src={product.image_url} alt={product.name} />
                <div className="text-content">
                  <h3>{product.name}</h3>
                  <p className="price">Price: ${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;