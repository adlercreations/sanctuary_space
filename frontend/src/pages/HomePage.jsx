// frontend/src/pages/HomePage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  useEffect(() => {
    console.log('HomePage mounted');
  }, []);

  return (
    <div className="home-container">
      <div className="daytime-motif" />
      <div className="arch-background" />
      {/* <div className="top-right-image" />
      <div className="top-left-image" /> */}
      <div className="bottom-image" />
      
      <div className="home-top-content">
        <img src="/assets/Title.svg" alt="Sanctuary Space Title" className="title-image" />
        
        <div className="cards-container">
          <Link to="/about" className="home-card about-card">
            <h2>About</h2>
            <p>Learn about our mission & vision</p>
          </Link>

          <Link to="/shop" className="home-card shop-card">
            <h2>Shop</h2>
            <p>Explore our wellness teas & products</p>
          </Link>

          <Link to="/community" className="home-card community-card">
            <h2>Community</h2>
            <p>Join our forum, read our blog, see events</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;