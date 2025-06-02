import React from 'react';
import '../styles/SharedStyles.css';
import '../styles/GardenStyles.css';

function TeaClubPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">Sanctuary Space Tea Club</h1>
        <div className="content-text">
          <p>
            Welcome to our Tea Club, where passion for tea meets mindful living. At Sanctuary Space, 
            we believe in the transformative power of tea rituals and their ability to create moments 
            of peace in our busy lives.
          </p>
          <p>
            Our Tea Club is more than just a subscription service - it's a community of tea enthusiasts 
            who share our dedication to quality, sustainability, and the art of tea preparation. Each month, 
            our members receive carefully curated selections of premium teas, along with detailed tasting 
            notes and preparation guides.
          </p>
          <p>
            We source our teas directly from ethical producers around the world, ensuring that each cup 
            you brew not only tastes exceptional but also supports sustainable farming practices and 
            fair trade relationships.
          </p>
          <p>
            Join us in celebrating the ancient tradition of tea drinking while creating new, meaningful 
            connections in our modern world.
          </p>
        </div>
      </div>
      <div className="bottom-image"></div>
    </div>
  );
}

export default TeaClubPage;