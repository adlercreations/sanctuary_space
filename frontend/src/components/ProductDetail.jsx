import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest } from '../services/api';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Logic to add the product to the cart
    console.log('Product added to cart:', product);
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{product.name}</h2>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>{product.description}</p>
      {product.image_url && (
        <img src={product.image_url} alt={product.name} style={{ maxWidth: '300px' }} />
      )}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductDetail;


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getRequest } from '../services/api';

// function ProductDetail() {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     getRequest(`/products/${productId}`)
//       .then((data) => setProduct(data))
//       .catch((err) => console.error('Fetch product detail error:', err));
//   }, [productId]);

//   if (!product) {
//     return <p>Loading product...</p>;
//   }

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>{product.name}</h2>
//       <p>Price: ${product.price.toFixed(2)}</p>
//       <p>{product.description}</p>
//       {product.image_url && (
//         <img src={product.image_url} alt={product.name} style={{ maxWidth: '300px' }} />
//       )}
//       {/* Button to add to Cart */}
//     </div>
//   );
// }

// export default ProductDetail;