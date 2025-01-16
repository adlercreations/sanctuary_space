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


// import React, { useEffect, useState } from 'react';

// function ProductList() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // The URL below must match your Flask route & port
//     fetch('http://127.0.0.1:5000/api/products')
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Server error: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log('Fetched products:', data);
//         setProducts(data);
//       })
//       .catch((error) => {
//         console.error('Fetch error:', error);
//       });
//   }, []);

//   return (
//     <div style={{ padding: '1rem' }}>
//       <h2>Product List</h2>
//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <ul>
//           {products.map((item) => (
//             <li key={item.id}>
//               {item.name} - ${item.price}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default ProductList;