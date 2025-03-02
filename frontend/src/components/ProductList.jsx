// frontend/src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { getRequest } from '../services/api';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getRequest('/products')
      .then((data) => setProducts(data))
      .catch((err) => console.error('Fetch products error:', err));
  }, []);

  if (!products.length) {
    return <p>Loading products...</p>;
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((p) => (
          <li key={p.id} style={{ marginBottom: '1rem' }}>
            <Link to={`/shop/${p.id}`}>
              <strong>{p.name}</strong> - ${p.price.toFixed(2)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
