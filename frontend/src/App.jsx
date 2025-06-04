// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import CheckoutWrapper from './components/CheckoutWrapper';
import OrderConfirmation from './pages/OrderConfirmation';
import TeaClubPage from './pages/TeaClubPage';
import GardenPartiesPage from './pages/GardenPartiesPage';
import GardenPartyDetail from './components/GardenPartyDetail';
import MoodBoardPage from './pages/MoodBoardPage';
import EventsPage from './pages/EventsPage';
import DinnerClubPage from './pages/DinnerClubPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RCEuKPYhHyLlBfTORqWDec0uHEYbuJGoYYwK7BlOBFvjtFA0ZRORsRgBcrh5SWYceh4mMikuSqyfbCU1rvJe4Ll006yJ7ZCWM');

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Routes>
              {/* Root route - Entrance Page */}
              <Route path="/" element={<EntrancePage />} />
              
              {/* All other routes with NavBar and Footer */}
              <Route
                path="/*"
                element={
                  <>
                    <NavBar />
                    <main>
                      <Routes>
                        <Route path="home" element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="shop" element={<ShopPage />} />
                        <Route path="shop/:productId" element={<ProductDetail />} />
                        <Route path="community/*" element={<CommunityPage />} />
                        <Route path="tea-club" element={<TeaClubPage />} />
                        <Route path="events" element={<EventsPage />} />
                        <Route path="events/garden-parties" element={<GardenPartiesPage />} />
                        <Route path="events/dinner-club" element={<DinnerClubPage />} />
                        <Route path="events/tea-club" element={<TeaClubPage />} />
                        <Route path="events/garden-parties/:id" element={<GardenPartyDetail />} />
                        <Route path="mood-board" element={<MoodBoardPage />} />
                        <Route
                          path="cart"
                          element={
                            <ProtectedRoute>
                              <Cart />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="admin"
                          element={
                            <ProtectedRoute requireAdmin={true}>
                              <AdminDashboard />
                            </ProtectedRoute>
                          }
                        />
                        {/* Updated Checkout route using CheckoutWrapper */}
                        <Route path="checkout" element={<CheckoutWrapper />} />
                        {/* Order Confirmation route */}
                        <Route path="order-confirmation" element={<OrderConfirmation />} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
