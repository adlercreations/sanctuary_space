// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import EntrancePage from './components/EntrancePage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ShopPage from './pages/ShopPage';
import CommunityPage from './pages/CommunityPage';
import ProductDetail from './components/ProductDetail';
import NavBar from './components/NavBar';
import Cart from './components/Cart';
import Footer from './components/Footer';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Optional Global Nav */}
        <NavBar />

        <Routes>
          <Route path="/" element={<EntrancePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:productId" element={<ProductDetail />} />
          <Route path="/community" element={<CommunityPage />} />
          {/* Add cart route if you want a dedicated page */}
          <Route path="/cart" element={<Cart />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;


