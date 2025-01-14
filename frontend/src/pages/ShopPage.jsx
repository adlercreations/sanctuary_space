// frontend/src/pages/ShopPage.jsx
import React from 'react';
import '../styles/ShopPage.css';
import ProductList from '../components/ProductList';

function ShopPage() {
  return (
    <div className="shop-container">
      <div className="daytime-motif" />
      <h1>Wellness Teas & Marketplace</h1>
      <div className="shop-content">
        {/* Here’s the product listing or other elements */}
        <ProductList />
      </div>
    </div>
  );
}

export default ShopPage;



// import React from 'react';
// import ProductList from '../components/ProductList';

// function ShopPage() {
//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Wellness Teas & Marketplace</h2>
//       <ProductList />
//     </div>
//   );
// }

// export default ShopPage;