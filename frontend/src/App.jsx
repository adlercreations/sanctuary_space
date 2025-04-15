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


// // frontend/src/App.jsx
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { CartProvider } from './components/CartContext';
// import { AuthProvider } from './components/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import EntrancePage from './components/EntrancePage';
// import HomePage from './pages/HomePage';
// import AboutPage from './pages/AboutPage';
// import ShopPage from './pages/ShopPage';
// import CommunityPage from './pages/CommunityPage';
// import ProductDetail from './components/ProductDetail';
// import NavBar from './components/NavBar';
// import Cart from './components/Cart';
// import Footer from './components/Footer';
// import AdminDashboard from './components/AdminDashboard';
// import LoginPage from './pages/LoginPage';
// import Checkout from './components/Checkout';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe('pk_test_51RCEuKPYhHyLlBfTORqWDec0uHEYbuJGoYYwK7BlOBFvjtFA0ZRORsRgBcrh5SWYceh4mMikuSqyfbCU1rvJe4Ll006yJ7ZCWM'); // Replace with your Stripe publishable key

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <CartProvider>
//           <div className="app">
//             <Routes>
//               {/* Root route - Entrance Page */}
//               <Route path="/" element={<EntrancePage />} />
              
//               {/* All other routes with NavBar and Footer */}
//               <Route path="/*" element={
//                 <>
//                   <NavBar />
//                   <main>
//                     <Routes>
//                       <Route path="home" element={<HomePage />} />
//                       <Route path="about" element={<AboutPage />} />
//                       <Route path="login" element={<LoginPage />} />
//                       <Route path="shop" element={<ShopPage />} />
//                       <Route path="shop/:productId" element={<ProductDetail />} />
//                       <Route path="community/*" element={<CommunityPage />} />
//                       <Route path="cart" element={
//                         <ProtectedRoute>
//                           <Cart />
//                         </ProtectedRoute>
//                       } />
//                       <Route path="admin" element={
//                         <ProtectedRoute requireAdmin={true}>
//                           <AdminDashboard />
//                         </ProtectedRoute>
//                       } />
//                       <Route path="checkout" element={
//                         <Elements stripe={stripePromise}>
//                           <Checkout />
//                         </Elements>
//                       } />
//                     </Routes>
//                   </main>
//                   <Footer />
//                 </>
//               } />
//             </Routes>
//           </div>
//         </CartProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
