// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import EntrancePage from './components/EntrancePage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ShopPage from './pages/ShopPage';
import CommunityPage from './pages/CommunityPage';
import ProductDetail from './components/ProductDetail';
import NavBar from './components/NavBar';
import Cart from './components/Cart';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Root route - Entrance Page */}
            <Route path="/" element={<EntrancePage />} />
            
            {/* All other routes with NavBar and Footer */}
            <Route path="*" element={
              <>
                <NavBar />
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/shop/:productId" element={<ProductDetail />} />
                  <Route path="/community/*" element={<CommunityPage />} />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
